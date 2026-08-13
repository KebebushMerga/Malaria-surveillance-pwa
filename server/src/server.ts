import "dotenv/config";
import express from "express";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/authRoutes";
import "./models/Role";
import userRoutes from "./routes/userRoutes";
import healthFacilityRoutes from "./routes/healthFacilityRoutes";
import "./models/Woreda";
import regionRoutes from "./routes/regionRoutes";
import zoneRoutes from "./routes/zoneRoutes";
import woredaRoutes from "./routes/woredaRoutes";
import "./models/MalariaCase";
import patientRoutes from "./routes/patientRoutes";
import malariaCaseRoutes from "./routes/malariaCaseRoutes";
import notificationRoutes from "./routes/notificationRoutes";


const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/health-facilities", healthFacilityRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/woredas", woredaRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/malaria-cases", malariaCaseRoutes);
app.use("/api/notifications", notificationRoutes);

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