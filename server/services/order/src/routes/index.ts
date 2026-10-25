import { Router } from "express";
import { createOrder, getAllOrders, verifyPayment } from "../controllers/order.controller.js";

const router = Router();

router.post("/create", createOrder);
router.post("/verify", verifyPayment);
router.get("/all", getAllOrders);

export default router;