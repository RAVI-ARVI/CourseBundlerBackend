import mongoose from "mongoose";

export const connectDB = async () => {
  const { connection } = await mongoose.connect(process.env.MONGO_URL);
  try {
    console.log(`MongoDB connected with ${connection.host}`);
  } catch (err) {
    console.log(err, "whelie connection the db");
  }
};
