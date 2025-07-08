const userModel = require('../model/user');
const OTP = require('../model/otp');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../mail/emailVerificationTemplate');
const otpGenerator = require('otp-generator');
const notConfirmedModel = require('../model/notConfirmed');
const pendingUserModel = require('../model/pendingUser');
const mongoose = require('mongoose');
module.exports.signUp = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;
        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/;
        
        // Check if password meets the criteria
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message:
                "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, #, $, %, ^, &, *).",
            });
        }
        const isUserAlreadyExist = await userModel.findOne({ email });
        if (isUserAlreadyExist ) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        } 
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            phone
        });
        const savedUser = await newUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: savedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to create user"
        });
    }
}

module.exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }
        const user = await userModel.findOne({ email });
        console.log("user:", user);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        } else if (isPasswordMatch) {
            
            const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            });
        }
        
    } catch (error) {
        console.log("Error in signIn:", error);
        res.status(500).json({
            success: false,
            message: "Unable to signIn user"
        });
    }
}

module.exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await userModel.findOne({ email: email });

    if (checkUserPresent) {
        return res.status(401).json({
            success: false,
            message: `User is Already Registered`,
        });
    }

    let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });


    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    const mailResponse = await mailSender(
      email,
      "Verification email",
      emailTemplate(otp)
    )
    // console.log("mail response:", mailResponse);

    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
    });
  } catch (error) {
    return res.status(500).json({ 
        success: false, 
        error: "Error in sending OTP" 
    });
  }
};

module.exports.verifyotp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
        return res.status(400).json({
            success: false,
            message: "OTP and email are required",
        });
    }

    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry) {
        return res.status(401).json({ message: "Invalid OTP." });
    }
    
    // Find the user in notConfirmedModel
    const currUser = await notConfirmedModel.findOne({ email });
    if (!currUser) {
        return res.status(404).json({
            message: "User not found in notConfirmed list.",
        });
    }

    // Create a new entry in pendingUserModel
    const approvedUser = new pendingUserModel({
      name: currUser.firstName,
      email: currUser.email,
      password: currUser.password,
    });

    await approvedUser.save();
    await notConfirmedModel.findByIdAndDelete(currUser._id); // Delete from notConfirmedModel
    await OTP.deleteOne({ email, otp }); // Delete the OTP after successful verification

    return res.status(200).json({
        success: true,
        message: "OTP verified successfully. User moved to pending list.",
    });
  } catch (err) {
        return res.status(500).json({ message: "OTP verification failed" });
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided",
        });
    }

    res.status(200).json({
        message: "User Logged out",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.dashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (id !== req.user.id) {
        return res.status(404).send({
            success: false,
            message: 'User is unauthorized to check other persons data'
        })
    } else if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(200).json({
            success: false,
            message: "Invalid user ID",
        });
    }

    const user = await userModel
      .findById(id)
      .select("-password") // Exclude the password field
      .populate({
        path:"orders",
        populate: {
        path: "items.product",
        model: "product",
        select: "product_name price description category", // Fetch specific fields from subjects
        },  
    }).exec();

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      success: true,
    });
  } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
      });
  }
};
