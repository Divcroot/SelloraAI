import proxy from "express-http-proxy";
import type { Request } from "express";

import { env } from "../config/env.js";

const proxyWithUserId = (serviceUrl: string) => proxy(serviceUrl, {
    proxyReqOptDecorator: (
        proxyReqOpts,
        req: Request,
    ) => {
        const userId = req.user?.userId;

        if (userId) {
            proxyReqOpts.headers = {
                ...proxyReqOpts.headers,
                ...(userId
                    ? {
                        "x-user-id": userId,
                    }
                    : {}),
            };
        }

        return proxyReqOpts;
    },
});

export const authServiceProxy = proxy(env.AUTH_SERVICE_URL);

export const productServiceProxy = proxyWithUserId(env.PRODUCT_SERVICE_URL);

export const orderServiceProxy = proxy(env.ORDER_SERVICE_URL);

export const publicProductServiceProxy = proxy(env.PRODUCT_SERVICE_URL, {
    filter: (req) =>
        (req.method === "GET" && req.path === "/all-public") ||
        (req.method === "POST" && req.path === "/download") ||
        (req.method === "PATCH" && req.path === "/update-sales"),

    proxyReqOptDecorator: (proxyReqOpts) => {
        if (proxyReqOpts.headers) {
            delete proxyReqOpts.headers["x-user-id"];
        }

        return proxyReqOpts;
    },
});