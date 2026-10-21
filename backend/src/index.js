import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
let port = process.env.PORT || 4000;

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`app is listening on ${port}`);
    });
  })
  .catch((err) => {
    console.log(`mongodb connection failed`, err);
  });
