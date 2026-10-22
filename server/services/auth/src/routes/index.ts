import { Router } from "express";

import { getAdmin } from "../controllers/admin.controller.js";
import { login, logout } from "../controllers/auth.controller.js";
import {
    getAllPublicPartner,
    getPartner,
    updatePartner,
} from "../controllers/partner.controller.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/admin", getAdmin);
router.get("/partners", getAllPublicPartner);
router.get("/partner", getPartner);
router.patch("/partner", updatePartner);

export default router;