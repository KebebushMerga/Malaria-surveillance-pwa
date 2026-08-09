import "dotenv/config";
import express from "express";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/authRoutes";
import "./models/Role";
import userRoutes from "./routes/userRoutes";


const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Malaria Surveillance API is running",
  });
});

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();