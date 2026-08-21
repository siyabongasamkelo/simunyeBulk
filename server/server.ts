import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./features/users/user.routes";
import syndicateRoutes from "./features/syndicates/syndicate.routes";

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
