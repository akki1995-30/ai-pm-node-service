import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (req: any, res: any) => {
  res.status(200).json({
    status: "OK",
    message: "Node service is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Node service running on port ${PORT}`);
  });
};

startServer();
