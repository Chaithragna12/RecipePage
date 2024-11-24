import React, { useState, useEffect } from "react";
import axios from "axios";
import "./add.css"; // Import the CSS file
import { Link } from "react-router-dom";

const AddRecipeForm = () => {
  const [email, setEmail] = useState("");
  const [recipeData, setRecipeData] = useState({
    title: "",
    ingredients: [], // Ensure ingredients is an array
    instructions: "",
    imageUrl: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [recipes, setRecipes] = useState([]); // State for storing fetched recipes
  const [editingRecipeId, setEditingRecipeId] = useState(null); // Track which recipe is being edited

  // Retrieve email from local storage when the component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Fetch the recipes for the logged-in user
    const fetchRecipes = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/admin/getrecipes", {
          email: storedEmail, // Use the email from local storage
        });

        if (response.data.success) {
          setRecipes(response.data.recipes);
        } else {
          setMessage("Error: Unable to fetch recipes.");
        }
      } catch (error) {
        setMessage("Error: Unable to fetch recipes.");
      }
    };

    if (storedEmail) {
      fetchRecipes();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleIngredientsChange = (e) => {
    const ingredients = e.target.value.split(",").map((item) => item.trim()); // Ensure ingredients is an array
    setRecipeData((prevData) => ({
      ...prevData,
      ingredients: ingredients, // Update ingredients as an array
    }));
  };

  const handleEditClick = (recipeId) => {
    const recipeToEdit = recipes.find((recipe) => recipe._id === recipeId);
    if (recipeToEdit) {
      setRecipeData({
        title: recipeToEdit.title,
        ingredients: recipeToEdit.ingredients,
        instructions: recipeToEdit.instructions,
        imageUrl: recipeToEdit.imageUrl,
      });
      setEditingRecipeId(recipeId); // Set the recipeId for editing
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingRecipeId) {
      // Edit existing recipe
      try {
        const response = await axios.post("http://localhost:5000/api/admin/editrecipes", {
          email,
          recipeId: editingRecipeId,
          newRecipeData: recipeData, // Send updated recipe data
        });

        if (response.data.success) {
          setMessage(response.data.message);
          setSuccess(true);
          // Optionally, you can update the recipes list here to reflect the changes
          setRecipes((prevRecipes) =>
            prevRecipes.map((recipe) =>
              recipe._id === editingRecipeId ? { ...recipe, ...recipeData } : recipe
            )
          );
        } else {
          setMessage(response.data.message);
          setSuccess(false);
        }
      } catch (error) {
        setMessage("Error: Unable to update recipe.");
        setSuccess(false);
      }
    } else {
      // Add new recipe
      try {
        const response = await axios.post("http://localhost:5000/api/admin/addrecipes", {
          email,
          recipeData,
        });

        if (response.data.success) {
          setMessage(response.data.message);
          setSuccess(true);
          // Optionally, you can add the new recipe to the list of recipes
          setRecipes((prevRecipes) => [...prevRecipes, response.data.recipe]);
        } else {
          setMessage(response.data.message);
          setSuccess(false);
        }
      } catch (error) {
        setMessage("Error: Unable to add recipe.");
        setSuccess(false);
      }
    }
  };

  // Handle recipe delete
  const handleDeleteClick = async (recipeId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/admin/deleterecipes", {
        email,
        recipeId,
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setSuccess(true);
        // Remove the deleted recipe from the recipes list
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe._id !== recipeId)
        );
      } else {
        setMessage(response.data.message);
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Error: Unable to delete recipe.");
      setSuccess(false);
    }
  };

  return (
    <div className="add-recipe-form">
      <h1>{editingRecipeId ? "Edit Recipe" : "Add Recipe"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={true} // Make it read-only since it comes from local storage
          />
        </label>
        <br />
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={recipeData.title}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Ingredients (comma separated):
          <input
            type="text"
            name="ingredients"
            value={recipeData.ingredients.join(", ")} // Join the array for display
            onChange={handleIngredientsChange}
            required
          />
        </label>
        <br />
        <label>
          Instructions:
          <textarea
            name="instructions"
            value={recipeData.instructions}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Image URL:
          <input
            type="text"
            name="imageUrl"
            value={recipeData.imageUrl}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">{editingRecipeId ? "Update Recipe" : "Add Recipe"}</button>
      </form>

      {message && (
        <div className={`message ${success ? "success" : "error"}`}>
          <strong>{message}</strong>
        </div>
      )}

      {/* Display fetched recipes */}
      <h2>Your Recipes</h2>
      <div className="recipe-list">
  {recipes.length > 0 ? (
    recipes
      .filter((recipe) => recipe && recipe._id) // Filter out invalid recipes
      .map((recipe) => (
        <div key={recipe._id} className="recipe-card">
          <h3>{recipe.title || "No Title Available"}</h3>
          
          <ul>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))
            ) : (
              <p>No ingredients listed.</p>
            )}
          </ul>
          
          <p>
            {recipe.instructions
              ? recipe.instructions
              : "No instructions provided."}
          </p>

          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.title || "Recipe"} />
          ) : (
            <p>No image available.</p>
          )}

          <div className="recipe-actions">
            <button className="editbutton" onClick={() => handleEditClick(recipe._id)}>Edit</button>
            <button className="bg-red-500 recipbut" onClick={() => handleDeleteClick(recipe._id)}>Delete</button>
          </div>
        </div>
      ))
  ) : (
    <p>No recipes found.</p>
  )}
</div>

      <Link to='/home'>
      
      <button>Back To Home</button>
      </Link>
    </div>
  );
};

export default AddRecipeForm;
