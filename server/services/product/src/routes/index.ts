import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getAllPartnerProducts,
    getAllPublicProducts,
    handleDownload,
    updateProduct,
    updateProductSales,
} from "../controllers/product.controller.js";

const router = Router();

router.post("/", createProduct);
router.post("/download", handleDownload);
router.get("/all", getAllPartnerProducts);
router.get("/all-public", getAllPublicProducts);

router.patch("/update-sales", updateProductSales);
router.patch("/:productId", updateProduct);

router.delete("/:productId", deleteProduct);

export default router;