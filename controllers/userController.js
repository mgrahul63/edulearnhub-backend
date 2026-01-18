import bcrypt from "bcryptjs";
import cloudinary from "../lib/loudinary.js";
import UserModel from "../models/user-model.js";
import { generateToken } from "../utils/generateToken.js";
import { saltAndHashPassword } from "../utils/hash.js";

// ===========================
// SIGNUP
// ===========================
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body; 

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await saltAndHashPassword(password);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);
    const { password: _, ...userData } = newUser._doc;

    res.status(201).json({
      success: true,
      user: userData,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// LOGIN
// ===========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);
    const { password: _, ...userData } = user;

    res.status(200).json({
      success: true,
      user: userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// CHECK AUTH
// ===========================
export const checkAuth = async (req, res) => {
  console.log(req.user);
  res.json({
    success: true,
    user: req.user, // already sanitized by middleware
  });
};

// ===========================
// UPDATE PROFILE
// ===========================
export const updateProfile = async (req, res) => {
  try {
    const { name, image } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;

    if (image) {
      const upload = await cloudinary.uploader.upload(image, {
        folder: "profiles",
      });
      updateData.image = upload.secure_url;
    }

    const updateUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updateUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};


