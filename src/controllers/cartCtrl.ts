import {Response} from "express";

import Cart from "../models/cartModel";
import Product from "../models/productModel";
import {IReqAuth} from "../types";

const cartCtrl = {
  getCart: async (req: IReqAuth, res: Response) => {
    try {
      const userId = req.user?._id;
      const cart = await Cart.findOne({user: userId}).populate(
        "product.product"
      );

      if (!cart) {
        res.status(400).json({message: "Cart not found."});
        return;
      }
      res.json(cart);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  addCart: async (req: IReqAuth, res: Response) => {
    try {
      const userId = req.user?._id;
      const {productId, quantity} = req.body;

      let cart = await Cart.findOne({user: userId});
      if (cart) {
        let productIndex = cart.product.findIndex(
          (p) => p.product == productId
        );
        const pro = await Product.findById(productId).select("price");
        if (!pro) {
          res.status(400).json({message: "Product not found."});
          return;
        }
        if (productIndex > -1) {
          let productItem = cart.product[productIndex];
          productItem.price = pro.price;
          cart.product[productIndex] = productItem;
        } else {
          let price = pro.price;
          cart.product.push({
            product: productId,
            price,
          });
        }
        cart = await cart.save();
        res.status(201).json({message: "Cart updated."});
        return;
      } else {
        const pro = await Product.findById(productId).select("price");
        if (!pro) {
          res.status(400).json({message: "Product not found."});
          return;
        }
        let taxPrice = (18 / 100) * pro.price;
        let totalPrice = pro.price + taxPrice;
        await Cart.create({
          user: userId,
          product: [
            {
              product: productId,
              price: pro.price,
              taxPrice: taxPrice,
              totalPrice: totalPrice,
            },
          ],
        });
        res.status(201).json({message: "Cart Updated."});
        return;
      }
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  removeCart: async (req: IReqAuth, res: Response) => {
    try {
      const userId = req.user?._id;
      const productId = req.params.id;
      let cart = await Cart.findOne({user: userId});
      if (!cart) {
        res.status(400).json({message: "Cart not found."});
        return;
      }
      let productIndex = cart.product.findIndex(
        (p: any) => p.product == productId
      );
      if (productIndex > -1) {
        cart.product.splice(productIndex, 1);
      }
      cart = await cart.save();

      res.status(201).json({message: "Product remove to cart."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default cartCtrl;
