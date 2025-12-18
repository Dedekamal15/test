import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import router from "./routes/index.js";
const app = express();
dotenv.config();

try {
  await db.authenticate();
  console.log("Database connected...");
} catch (error) {
  console.error("Connection failed:", error);
}

app.use(express.json());
app.use(router);
app.listen(3000, () => console.log("Server running on port 3000"));
