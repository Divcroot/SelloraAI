import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllPartnerProducts,
    updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/all", getAllPartnerProducts);
router.delete("/:productId", deleteProduct);
router.patch("/:productId", updateProduct);
router.post('/', createProduct);

export default router;