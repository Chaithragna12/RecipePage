import mongoose from "mongoose";

// Schema for storing individual recipes
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String], // Array of ingredients
    required: true,
  },
  instructions: {
    type: String, // Cooking instructions for the recipe
    required: true,
  },
  imageUrl: {
    type: String, // URL to an image of the recipe (optional)
  },
  
});

// Schema for User data
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique email
  },
  password: {
    type: String,
    required: true,
  },
  recipes: {
    type: [recipeSchema], // Reference to the Recipe schema
    // ref: "Recipe",
    default: [], // Default to an empty array
  },
});

// const Recipe = mongoose.model("Recipe", recipeSchema);
const User = mongoose.model("User", userSchema);

export default User;
