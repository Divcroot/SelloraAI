import crypto from "node:crypto";

import { getAuth } from "firebase-admin/auth";

import redis from "../../../../shared/redis/redis.js"
import firebaseApp from "../config/firebase.js";
import { AppError } from "../error/AppError.js";
import { User } from "../models/user.model.js";

const firebaseAuth = getAuth(firebaseApp);

const SESSION_TTL = 7 * 24 * 60 * 60;

interface SessionData {
    userId: string;
    name: string;
    email: string;
    role: "partner" | "admin";
}

interface LoginUser {
    id: string;
    name: string;
    email: string;
    role: "partner" | "admin";
}

interface LoginResult {
    user: LoginUser;
    sessionId: string;
}

const updateSession = async (
    sessionId: string,
    session: SessionData,
): Promise<void> => {
    await redis.set(
        `session:${sessionId}`,
        JSON.stringify(session),
        "EX",
        SESSION_TTL,
    );
};

// =====================================================
// LOGIN
// =====================================================

export const login = async (
    token: string,
): Promise<LoginResult> => {
    let decodedToken;

    try {
        decodedToken = await firebaseAuth.verifyIdToken(token);
    } catch {
        throw new AppError("Invalid or expired Firebase token", 401);
    }

    const firebaseUid = decodedToken.uid;

    let user = await User.findOne({
        firebaseUid,
    });

    if (!user) {
        if (!decodedToken.email) {
            throw new AppError("Firebase account does not have an email", 400);
        }

        user = await User.create({
            firebaseUid,
            name: decodedToken.name ?? "User",
            email: decodedToken.email,
        });
    }

    const sessionId = crypto.randomUUID();

    const session: SessionData = {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
    };

    await updateSession(
        sessionId,
        session,
    );

    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        },
        sessionId,
    };
};

// =====================================================
// LOGOUT
// =====================================================

export const logout = async (
    sessionId: string,
): Promise<void> => {
    await redis.del(
        `session:${sessionId}`,
    );
};

