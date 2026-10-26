import { Router } from "express";
import { getAIAnalytics } from "../controllers/ai.controller.js";

const router = Router();

router.post("/analytics", getAIAnalytics);

export default router;