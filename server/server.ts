import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "🇿🇦 Simunye App Backend is running smoothly with TypeScript!",
  });
});

export default app;
