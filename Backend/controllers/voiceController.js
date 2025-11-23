import { GoogleGenerativeAI } from "@google/generative-ai";
import prompt from "../prompts/geminiPrompt.js";
import { addToCart, removeFromCart } from "../controllers/cartController.js";
import { placeOrder } from "../controllers/orderController.js";
import { getProductById } from "../controllers/productsController.js";
import Product from "../model/product.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const findProductByName = async (name) => {
  if (!name) return null;

  const words = name
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const pattern = words.join(".*\\s*");
  const regex = new RegExp(pattern, "i");

  return await Product.findOne({
    product_name: { $regex: regex },
  });
};

const handleMissingProductName = (res) => {
  return res.status(400).json({
    success: false,
    message: "Product name is required",
  });
};

const parseGeminiModel = async (transcript) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let result = await model.generateContent(prompt(transcript));

    if (!result || !result.response) {
      return {
        success: false,
        message: "Invalid Gemini response",
      };
    }

    let text = result.response.text();
    if (!text) {
      return {
        success: false,
        message: "No response from Gemini model",
      };
    }

    let jsonStart = text.indexOf("{");
    let json = text.slice(jsonStart);
    let parsedText = JSON.parse(json);

    return parsedText;
  } catch (error) {
    console.error("Gemini parse error:", error.message);
    return {
      success: false,
      message: "Failed to parse the Gemini response",
    };
  }
};

export const interpretCommand = async (req, res) => {
  try {
    let transcript = req.body.command;

    if (!transcript) {
      return res.status(400).json({
        success: false,
        message: "Transcript is required",
      });
    }

    let parsedText = await parseGeminiModel(transcript);

    switch (parsedText.intent) {
      case "add_to_cart": {
        if (!parsedText.product) return handleMissingProductName(res);

        const product = await findProductByName(
          parsedText.product.toLowerCase()
        );
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product "${parsedText.product}" not found`,
          });
        }

        req.params = { id: product._id.toString() };
        return await addToCart(req, res);
      }

      case "remove_from_cart": {
        if (!parsedText.product) return handleMissingProductName(res);

        let removeProduct = await findProductByName(
          parsedText.product.toLowerCase()
        );
        if (!removeProduct) {
          return res.status(404).json({
            success: false,
            message: `Product "${parsedText.product}" not found`,
          });
        }

        req.body = { productId: removeProduct._id.toString() };
        return await removeFromCart(req, res);
      }

      case "search_product": {
        if (!parsedText.product) return handleMissingProductName(res);

        let searchedProduct = await findProductByName(
          parsedText.product.toLowerCase()
        );
        if (!searchedProduct) {
          return res.status(404).json({
            success: false,
            product_name: parsedText.product,
            message: `Product "${parsedText.product}" not found`,
          });
        }

        req.params = { id: searchedProduct._id.toString() };
        return await getProductById(req, res);
      }

      case "place_order":
        return await placeOrder(req, res);

      default:
        return res.status(400).json({
          success: false,
          message: `Unknown intent: "${parsedText.intent}"`,
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

export const getProductsByName = async (req, res) => {
  try {
    let transcript = req.body.command;

    if (!transcript) {
      return res.status(400).json({
        success: false,
        message: "Transcript is required",
      });
    }

    let parsedText = await parseGeminiModel(transcript);

    if (parsedText.fallback_to_search_all) {
      try {
        let words = parsedText.product.trim().split(/\s+/);

        let regexFilters = words.map((word) => ({
          product_name: { $regex: word, $options: "i" },
        }));

        let similarProducts = await Product.find({ $and: regexFilters });

        if (!similarProducts || similarProducts.length === 0) {
          similarProducts = await Product.find({ $or: regexFilters });

          if (!similarProducts || similarProducts.length === 0) {
            return res.status(404).json({
              success: false,
              message: `No similar products found for "${parsedText.product}"`,
            });
          }
        }

        return res.status(200).json({
          success: true,
          message: `Similar products for "${parsedText.product}"`,
          products: similarProducts,
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
      message: "Unable to fetch product",
    });
  }
};
