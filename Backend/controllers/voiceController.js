require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const prompt = require("../prompts/geminiPrompt.js");
const {addToCart, removeFromCart} = require("../controllers/cartController.js");
const { placeOrder } = require("../controllers/orderController.js");
const { getProductById } = require("../controllers/productsController.js");
const Product = require("../model/product.js");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const findProductByName = async (name) => {
    if (!name) return null;
    const words = name.trim().split(/\s+/).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = words.join(".*\\s*");

    const regex = new RegExp(pattern, "i");

    const product = await Product.findOne({
      product_name: { $regex: regex }
    });

  return product;
};

const handleMissingProductName = (res) => {
  return res.status(400).json({
    success: false,
    message: "Product name is required"
  });
};

const parseGeminiModel = async (transcript) => {
  try{
    let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("Using Gemini model:", model);

    let result = await model.generateContent(prompt(transcript));
    console.log("Gemini result", result);

    if(!result || !result.response) {
        console.error("No response from Gemini model");
        return res.status(500).json({
            success: false,
            message: "Invalid Gemini response",
        });
    }

    let text = result.response.text();
    console.log("Gemini response:", text);

    if (!text) {
      return res.status(500).json({
        success: false,
        message: "No response from Gemini model",
      });
    }
    console.log("Gemini response text:", text);

    let jsonStart = text.indexOf("{");
    console.log("JSON start index:", jsonStart);
    let json = text.slice(jsonStart);
    console.log("Extracted JSON string:", json);
    let parsedText = JSON.parse(json);
    console.log("Parsed text:", parsedText);

    if (!parsedText.product) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }
    
    return parsedText;

  } catch (error) {
      console.error("Gemini parse error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to parse the Gemini response",
      });
  }
}

module.exports.interpretCommand = async (req, res) => {
    try {
    let transcript = req.body.command;
    console.log("Received transcript:", transcript);

    if (!transcript) {
      return res.status(400).json({
        success: false,
        message: "Transcript is required",
      });
    }

    let parsedText = await parseGeminiModel(transcript);
    console.log("Hello Parsed text:", parsedText);
    switch (parsedText.intent) {
        case "add_to_cart":
        if (!parsedText.product) {
            return handleMissingProductName(res);
        }

        let product = await findProductByName(parsedText.product.toLowerCase());

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: `Product "${parsedText.product}" not found` 
            });
        }
        console.log("Found product:", product);
        req.params = { id: product._id.toString() };
        return await addToCart(req, res);

        case "remove_from_cart":
            if (!parsedText.product) {
                return handleMissingProductName(res);
            }
            let removeProduct = await findProductByName(parsedText.product.toLowerCase());
            console.log("Product to remove:", removeProduct);
            if (!removeProduct) {
                return res.status(404).json({ 
                    success: false, 
                    message: `Product "${parsedText.product}" not found` 
                });
            }

            req.body = { productId: removeProduct._id.toString() };
            return await removeFromCart(req, res);

        case "search_product":
            if (!parsedText.product) {
                return handleMissingProductName(res);
            }

            let searchedProduct = await findProductByName(parsedText.product.toLowerCase());
            console.log("Product to search:", searchedProduct);
            if (!searchedProduct) {
                return res.status(404).json({ 
                    success: false,
                    product_name: parsedText.product, 
                    message: `Product "${parsedText.product}" not found` 
                });
            }

            req.params = { id: searchedProduct._id.toString() };
            return await getProductById(req, res);
          
        case "place_order":
          
          return await placeOrder(req, res);

        default:
            return res.status(400).json({
                success: false,
                message: `Unknown intent: "${parsedText.intent}"`
            });
    }

  } catch (error) {
    console.error("Gemini interpret error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to interpret the voice command",
    });
  }
};

module.exports.getProductsByName = async (req, res) => {
    try {
      let transcript = req.body.command;
      console.log("Received transcript:", transcript);

      if (!transcript) {
        return res.status(400).json({
          success: false,
          message: "Transcript is required",
        });
      }
      
      let parsedText = await parseGeminiModel(transcript);
        
      if(parsedText.fallback_to_search_all){
          try {
            let words = parsedText.product.trim().split(/\s+/);
            let regexFilters = words.map(word => ({
              product_name: { $regex: word, $options: "i" }
            }));
            console.log("Regex filters:", regexFilters);

            let similarProducts = await Product.find({
              $and: regexFilters
            });
            
            if (!similarProducts || similarProducts.length === 0) {
              similarProducts = await Product.find({ $or: regexFilters });
              if (!similarProducts || similarProducts.length === 0) {
                return res.status(404).json({
                  success: false,
                  message: `No similar products found for "${productText}"`,
                });
              }
            }

            console.log("Similar products found:", similarProducts);

            return res.status(200).json({
              success: true,
              message: `Similar products for "${parsedText.product}"`,
              products: similarProducts
            });

        } catch (error) {
            console.error("Error searching all products:", error);
            return res.status(500).json({
              success: false,
              message: "Failed to search all products",
            });
        }
      }

    } catch (error) {
        console.error("Error fetching product by name:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch product"
        });
    }
}
