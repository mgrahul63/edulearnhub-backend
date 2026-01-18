// models/Category.js
import { mongoose, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    category_name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const CategoryModel =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default CategoryModel;

// 🔹 Suggested Categories for LMS Platform
// 1️⃣ Tech / Programming
// Web Development
// Mobile App Development
// Programming Languages (Python, Java, C++, JS)
// Data Science / Machine Learning
// AI & Deep Learning
// Cloud Computing (AWS, Azure)
// Cybersecurity
// 2️⃣ Business / Finance
// Entrepreneurship
// Management
// Marketing
// Finance & Accounting
// Project Management
// HR & Leadership
// 3️⃣ Creative / Design
// Graphic Design
// UI/UX Design
// Photography
// Video Editing / Animation
// Music / Audio Production
// Writing / Content Creation
// 4️⃣ Personal Development
// Productivity
// Communication Skills
// Mindfulness / Meditation
// Career Development
// 5️⃣ Lifestyle / Health
// Fitness & Nutrition
// Yoga & Meditation
// Cooking
// Fashion & Beauty
// 6️⃣ Language Learning
// English
// Spanish / French / German
// Programming Language Courses
// 🔹 Optional Subcategories
// Tech → Web, Mobile, Data Science
// Business → Marketing, HR, Finance
// Creative → Design, Writing, Photography
