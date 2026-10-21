import mongoose from "mongoose";
import DBNAME from "../constent.js";
const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URL);

    const connection = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DBNAME}`,
    );
    // console.log(connection);
  } catch (error) {
    console.log("mongodb connetction failed", error);
    process.exit(1);
  }
};

export default connectDB;
