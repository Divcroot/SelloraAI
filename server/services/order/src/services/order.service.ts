import { Types } from "mongoose";
import axios from "axios";
import { AppError } from "../error/AppError.js";
import { env } from "../config/env.js";
import { razorpay } from "../config/razorpay.js";
import { Order } from "../models/order.model.js";
import { createHmac } from "node:crypto";
import redis from "../../../../shared/redis/redis.js";

interface CreateOrderInput {
    productId: string;
    partnerId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    partnerEmail: string;
    productTitle: string;
    links: {
        title: string;
        url: string;
    }[];
}

interface VerifyPaymentData {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

const ORDERS_CACHE_KEY = "orders:all";

const invalidateOrdersCache = async (partnerId: string) => {
    await redis.del(ORDERS_CACHE_KEY);
    await redis.del(`ai:${partnerId.trim()}`);
};

export const createOrder = async (input: CreateOrderInput) => {
    const {
        productId,
        partnerId,
        amount,
        customerName,
        customerEmail,
        partnerEmail,
        productTitle,
        links,
    } = input;

    if (
        !Types.ObjectId.isValid(productId) ||
        !Types.ObjectId.isValid(partnerId)
    ) {
        throw new AppError("Invalid product or partner ID", 400);
    }

    if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !customerName?.trim() ||
        !customerEmail?.trim() ||
        !partnerEmail?.trim() ||
        !productTitle?.trim() ||
        !Array.isArray(links)
    ) {
        throw new AppError("Invalid order details", 400);
    }

    const amountInPaise = Math.round(amount * 100);
    const partnerAmount = Math.round(amountInPaise * 0.95) / 100;
    const adminAmount = (amountInPaise - Math.round(amountInPaise * 0.95)) / 100;

    const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
        productId,
        partnerId,
        productPrice: amount,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        partnerEmail: partnerEmail.trim().toLowerCase(),
        productTitle: productTitle.trim(),
        links,
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: "pending",
        partnerAmount,
        adminAmount,
    });

    await invalidateOrdersCache(partnerId);

    return {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: "INR",
        key: env.RAZORPAY_KEY_ID,
    };
};

export const verifyPayment = async (
    data: VerifyPaymentData,
) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = data;

    const order = await Order.findOne({
        razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    const generatedSignature = createHmac(
        "sha256",
        env.RAZORPAY_KEY_SECRET,
    )
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (generatedSignature !== razorpay_signature) {
        throw new AppError("Payment verification failed", 400);
    }

    if (order.paymentStatus === "success") {
        return order;
    }

    order.paymentStatus = "success";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    await order.save();

    await axios.patch(
        `${env.GATEWAY_URL}/api/auth/partner/update-sales`,
        {
            partnerId: order.partnerId.toString(),
            amount: order.productPrice,
        },
    );

    await axios.patch(
        `${env.GATEWAY_URL}/api/public-product/update-sales`,
        {
            productId: order.productId.toString(),
            amount: order.productPrice,
        },
    );

    await invalidateOrdersCache(order.partnerId.toString());

    return order;
};

export const getAllOrders = async () => {
    const cachedOrders = await redis.get(ORDERS_CACHE_KEY);

    if (cachedOrders) {
        return {
            source: "Cached",
            orders: JSON.parse(cachedOrders),
        };
    }

    const orders = await Order.find()
        .select(
            "_id productId partnerId productTitle productPrice customerName customerEmail partnerEmail paymentStatus partnerAmount adminAmount createdAt"
        )
        .sort({ createdAt: -1 })
        .lean();

    await redis.set(
        ORDERS_CACHE_KEY,
        JSON.stringify(orders),
        "EX",
        600,
    );

    return {
        source: "Database",
        orders,
    };
};
