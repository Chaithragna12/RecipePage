import User from "../models/recipeschema.js";
// import mongoose from "mongoose";
export const Signup = async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(409).json({ message: "Username already exists" });
        }
        const newUser = new User({
            username,
            email,
            password,
            recipes:[]
        });

        const savedUser = await newUser.save();
        
        res.status(200).json({ message: "User created successfully", success: true });
    } catch (error) {
        console.log("Error", error.message);
        res.status(500).json({ error: "Internal Server error" })
    }
}

export const Login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found.", success: false });
      }
  
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials.", success: false });
      }
  
      // If login is successful
      res.status(200).json({
        message: "Login successful.",
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          recipes: user.recipes,
        },
      });
  
    } catch (error) {
      console.log("Error", error.message);
      res.status(500).json({ error: "Internal Server Error", success: false });
    }
  };



  export const addRecipe = async (req, res) => { 
    try {
      const { email, recipeData } = req.body; // `recipeData` contains title, ingredients, instructions, imageUrl
  
      // Validate inputs
      if (!email || !recipeData) {
        return res.status(400).json({ message: "Email and recipe data are required." });
      }
  
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Add the new recipe to the user's recipes array
      user.recipes.push(recipeData);
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({
        message: "Recipe added successfully.",
        success: true,
        recipes: user.recipes, // Return the updated recipes
      });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getRecipes = async (req, res) => {
    try {
      const { email } = req.body; // Email is used to identify the user
  
      // Validate input
      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }
  
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Return the user's recipes
      res.status(200).json({
        success: true,
        recipes: user.recipes, // Return the user's recipe array
      });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

export const editRecipe = async (req, res) => {
    try {
      const { email, recipeId, newRecipeData } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found.", success: false });
      }
  
      // Find the recipe in the recipes array by ID
      const recipe = user.recipes.id(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found.", success: false });
      }
  
      // Update the recipe details
      if (newRecipeData.title) recipe.title = newRecipeData.title;
      if (newRecipeData.ingredients) recipe.ingredients = newRecipeData.ingredients;
      if (newRecipeData.instructions) recipe.instructions = newRecipeData.instructions;
      if (newRecipeData.imageUrl) recipe.imageUrl = newRecipeData.imageUrl;
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Recipe updated successfully.",
        recipes: user.recipes, // Return the updated recipes list
      });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ message: "Internal Server Error", success: false });
    }
  };
  export const deleteRecipe = async (req, res) => {
    try {
      const { email, recipeId } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found.", success: false });
      }
  
      // Find the recipe in the recipes array by ID
      const recipeIndex = user.recipes.findIndex((recipe) => recipe._id.toString() === recipeId);
      if (recipeIndex === -1) {
        return res.status(404).json({ message: "Recipe not found.", success: false });
      }
  
      // Remove the recipe from the recipes array
      user.recipes.splice(recipeIndex, 1);
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({
        message: "Recipe deleted successfully.",
        success: true,
        recipes: user.recipes, // Return the updated recipes list
      });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ message: "Internal Server Error", success: false });
    }
  };
    