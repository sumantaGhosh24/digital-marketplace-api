import mongoose, {Document} from "mongoose";

import {IProduct} from "./productModel";
import {IUser} from "./userModel";

export interface ICart extends Document {
  user: IUser;
  product: {
    product: IProduct;
    price: number;
  }[];
}

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: [
      {
        product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
        price: {type: Number},
      },
    ],
  },
  {timestamps: true}
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
