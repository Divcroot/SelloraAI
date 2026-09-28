import { Router } from "express";

import {authServiceProxy} from "../proxy/service.proxy.js";

const router = Router();

// Auth routes
router.use("/auth", authServiceProxy);

export default router;