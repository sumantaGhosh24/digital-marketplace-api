import express from "express";

import productCtrl from "../controllers/productCtrl";
import authAdmin from "../middleware/authAdmin";

const router = express.Router();

router.get("/products", productCtrl.getProducts);

router.get("/product/:id", productCtrl.getProduct);

router.get("/admin/products", authAdmin, productCtrl.getProductsAdmin);

router.get("/admin/product/:id", authAdmin, productCtrl.getProductAdmin);

router.post("/product", authAdmin, productCtrl.createProduct);

router.put("/product/:id", authAdmin, productCtrl.updateProduct);

router.patch("/add-assets/:id", authAdmin, productCtrl.addAssets);

router.patch("/remove-assets/:id", authAdmin, productCtrl.removeAssets);

router.delete("/product/:id", authAdmin, productCtrl.deleteProduct);

export default router;
