import CategoryModel from "../models/category-model.js";
import {
  objectIdArrayConvert,
  objectIdConvert,
} from "../utils/objectIdConvert.js";

export const getCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find().lean();

    const formattedCategories = objectIdArrayConvert(categories);

    res.status(200).json({
      success: true,
      categories: formattedCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { category_name, description, id } = req.body;

    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    let category;

    if (id) {
      category = await CategoryModel.findByIdAndUpdate(
        id,
        { category_name, description },
        { new: true }
      );
    } else {
      category = await CategoryModel.create({
        category_name,
        description,
      });
    }

    res.status(id ? 200 : 201).json({
      success: true,
      message: id
        ? "Category updated successfully"
        : "Category added successfully",
      category: objectIdConvert(category),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
