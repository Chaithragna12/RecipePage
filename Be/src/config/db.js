import mongoose from 'mongoose';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DBCONNECT);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error in connecting DB", error.message);
  }
};

export default connectToMongoDB;
