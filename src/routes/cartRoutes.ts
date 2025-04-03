import express from "express";

import cartCtrl from "../controllers/cartCtrl";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/cart", auth, cartCtrl.getCart);

router.post("/cart", auth, cartCtrl.addCart);

router.delete("/cart/:id", auth, cartCtrl.removeCart);

export default router;
