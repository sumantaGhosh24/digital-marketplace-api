import mongoose, {Document} from "mongoose";

import {ICategory} from "./categoryModel";
import {IUser} from "./userModel";

export interface IProduct extends Document {
  owner: IUser;
  title: string;
  description: string;
  thumbnail: {
    url: string;
    public_id: string;
  };
  assets: {
    url: string;
    public_id: string;
  }[];
  category: ICategory;
  price: number;
}

const productSchema = new mongoose.Schema(
  {
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    title: {type: String, trim: true, required: true},
    description: {type: String, trim: true, required: true},
    thumbnail: {url: String, public_id: String},
    assets: [{url: String, public_id: String}],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    price: {type: Number, required: true},
  },
  {timestamps: true}
);

productSchema.index({title: "text", price: "text", category: "text"});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
