import { Router } from "express";

import {
    authServiceProxy,
    productServiceProxy,
} from "../proxy/service.proxy.js";
import { protect } from "../middlewares/isAuth.js";
import { getCurrentUser } from "../controller/user.controller.js";

const router = Router();

// Auth routes
router.use("/auth", authServiceProxy);

// Current user
router.get("/user/me", protect, getCurrentUser);

//Product routes
router.use("/product", protect, productServiceProxy);

export default router;