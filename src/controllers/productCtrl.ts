import {Request, Response} from "express";

import Product from "../models/productModel";
import {APIFeatures} from "../lib";
import {IReqAuth} from "../types";

const productCtrl = {
  getProducts: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Product.find()
          .select("-assets")
          .populate("owner", "_id username email mobileNumber image")
          .populate("category", "_id name image"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(Product.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const products = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({products, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getProduct: async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id)
        .select("-assets")
        .populate("owner", "_id username email mobileNumber image")
        .populate("category", "_id name image");
      if (!product) {
        res.status(404).json({message: "Product not found."});
        return;
      }

      res.status(200).json(product);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getProductsAdmin: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Product.find()
          .populate("owner", "_id username email mobileNumber image")
          .populate("category", "_id name image"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(Product.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const products = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({products, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getProductAdmin: async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate("owner", "_id username email mobileNumber image")
        .populate("category", "_id name image");
      if (!product) {
        res.status(404).json({message: "Product not found."});
        return;
      }

      res.status(200).json(product);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  createProduct: async (req: IReqAuth, res: Response) => {
    try {
      const owner = req.user?._id;
      const {title, description, category, price, thumbnail, assets} = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !price ||
        !thumbnail ||
        !assets
      ) {
        res.status(400).json({message: "Please fill all fields."});
        return;
      }

      const newProduct = new Product({
        owner: owner,
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        category,
        price,
        thumbnail,
        assets,
      });
      await newProduct.save();

      res.json({message: "Product Created successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  updateProduct: async (req: Request, res: Response) => {
    try {
      const {title, description, category, price, thumbnail} = req.body;

      const product = await Product.findById(req.params.id);
      if (!product) {
        res.status(400).json({message: "Product does not exists."});
        return;
      }

      if (title) product.title = title.toLowerCase();
      if (description) product.description = description.toLowerCase();
      if (category) product.category = category;
      if (price) product.price = price;
      if (thumbnail) product.thumbnail = thumbnail;
      await product.save();

      res.json({message: "Product updated successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  addAssets: async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        res.status(400).json({message: "Product does not exists."});
        return;
      }

      product.assets = [...product.assets, ...req.body.assets];
      await product.save();

      res.json({message: "Assets added successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  removeAssets: async (req: Request, res: Response) => {
    try {
      const {public_id} = req.body;

      if (!public_id) {
        res.status(400).json({message: "Please select an asset."});
        return;
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        res.status(400).json({message: "Product does not exists."});
        return;
      }

      product.assets = product.assets.filter(
        (asset) => asset.public_id !== public_id
      );
      await product.save();

      res.json({message: "Asset removed successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  deleteProduct: async (req: Request, res: Response) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        res.status(400).json({message: "Product does not exists."});
        return;
      }

      await Product.findByIdAndDelete(req.params.id);

      res.json({message: "Product deleted successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default productCtrl;
