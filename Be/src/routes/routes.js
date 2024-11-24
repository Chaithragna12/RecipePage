import express from 'express';
import { Signup, Login ,addRecipe,getRecipes,editRecipe,deleteRecipe} from '../controller/recipecontroller.js';
const router = express.Router();

router.post('/signup',Signup );  // ✅
router.post('/login',Login );
router.post("/addrecipes", addRecipe);
router.post("/getrecipes", getRecipes);
router.post('/editrecipes', editRecipe);
router.post('/deleterecipes', deleteRecipe);
export default router;
