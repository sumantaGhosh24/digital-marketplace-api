import mongoose, {Document} from "mongoose";

import {IProduct} from "./productModel";
import {IUser} from "./userModel";

export interface IOrder extends Document {
  user: IUser;
  orderItems: IProduct[];
  paymentResult: {
    id: string;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
  price: number;
}

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
    ],
    paymentResult: {
      id: {type: String},
      status: {type: String},
      razorpay_order_id: {type: String},
      razorpay_payment_id: {type: String},
      razorpay_signature: {type: String},
    },
    price: {type: Number, required: true},
  },
  {timestamps: true}
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
