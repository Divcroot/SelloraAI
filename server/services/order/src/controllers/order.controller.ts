import type { NextFunction, Request, Response } from "express";
import {
    createOrder as createOrderService,
    verifyPayment as verifyPaymentService,
    getAllOrders as getAllOrdersService,
} from "../services/order.service.js";
import { AppError } from "../error/AppError.js";


export const createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const result = await createOrderService(req.body);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            throw new AppError("Payment details are missing", 400);
        }

        const order = await verifyPaymentService({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { source, orders } = await getAllOrdersService();

        res.status(200).json({
            success: true,
            source,
            orders,
        });
    } catch (error) {
        next(error);
    }
};
