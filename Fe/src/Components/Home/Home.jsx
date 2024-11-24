import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './home.css'
const HomePage = () => {
  const [email, setEmail] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      fetchRecipes(storedEmail);
    }
  }, []);

  const fetchRecipes = async (email) => {
    try {
      const response = await axios.post("http://localhost:5000/api/admin/getrecipes", {
        email: email,
      });

      if (response.data.success) {
        setRecipes(response.data.recipes);
      } else {
        setMessage("No recipes found.");
      }
    } catch (error) {
      setMessage("Error: Unable to fetch recipes.");
    }
  };

  const handleAddRecipeClick = () => {
    navigate("/add"); // Navigate to the Add Recipe page
  };

  return (
    <div>
        <h1>Welcome to Recipe page</h1>
      <h1>Your Recipes</h1>
      {message && <div className="message">{message}</div>}
      <div className="recipe-list">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <p>{recipe.instructions}</p>
              {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} />}
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
      <div className="button-container">
  <button className="centered-button" onClick={handleAddRecipeClick}>
    Add Recipe
  </button>
</div>

    </div>
  );
};

export default HomePage;
