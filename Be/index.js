import express from 'express';
import connectToMongoDB from './src/config/db.js'
import dotenv from 'dotenv';
import router from './src/routes/routes.js';
import cors from 'cors'; 

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.use('/api/admin',router)

app.listen(port,()=>{
    connectToMongoDB();
    console.log(`Server running on port ${port}`)
})

