import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import { errorMiddleware } from "./middleware/error.middleware";
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import teamRoutes from "./routes/team.routes";
import logger from "./utils/logger";
import { startHealthCheckCron } from "./cron/healthCheck.cron";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);

app.get("/health", (req: any, res: any) => {
  res.status(200).json({
    status: "OK",
    message: "Node service is running",
  });
});

// Global error handler — must be registered after all routes
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Node service running on port ${PORT}`);
    startHealthCheckCron();
  });
};

startServer();
