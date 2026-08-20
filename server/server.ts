import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import syndicateRoutes from "./routes/syndicateRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/syndicates", syndicateRoutes);

app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🇿🇦 Simunye App Backend is running smoothly with TypeScript!",
  });
});

export default app;
