import { Document, model, Schema, Types } from "mongoose";

export const PAYMENT_STATUSES = ["pending", "success", "failed"] as const;

export interface IProductLink {
    title: string;
    url: string;
}

export interface IOrder extends Document {
    productId: Types.ObjectId;
    partnerId: Types.ObjectId;
    productTitle: string;
    productPrice: number;
    links: IProductLink[];
    partnerEmail: string;
    customerName: string;
    customerEmail: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    paymentStatus: (typeof PAYMENT_STATUSES)[number];
    partnerAmount: number;
    adminAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

const productLinkSchema = new Schema<IProductLink>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false },
);

const orderSchema = new Schema<IOrder>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },
        partnerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        productTitle: {
            type: String,
            required: true,
        },
        productPrice: {
            type: Number,
            required: true,
        },
        links: {
            type: [productLinkSchema],
            default: [],
        },
        partnerEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        customerName: {
            type: String,
            required: true,
            trim: true,
        },
        customerEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        razorpayOrderId: {
            type: String,
            index: true,
        },
        razorpayPaymentId: {
            type: String,
        },
        razorpaySignature: {
            type: String,
        },
        paymentStatus: {
            type: String,
            enum: PAYMENT_STATUSES,
            default: "pending",
            index: true,
        },
        partnerAmount: {
            type: Number,
            default: 0,
        },
        adminAmount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

export const Order = model<IOrder>("Order", orderSchema);