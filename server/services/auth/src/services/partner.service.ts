import redis from "../../../../shared/redis/redis.js";
import { AppError } from "../error/AppError.js";
import { User } from "../models/user.model.js";
import type {
    IPartnerProfile,
    IPaymentDetails,
    IUser,
} from "../models/user.model.js";
import { Types } from "mongoose";

const SESSION_TTL = 7 * 24 * 60 * 60;

interface SessionData {
    userId: string;
    [key: string]: unknown;
}

export interface PartnerUpdate {
    name?: string;
    profileDetails?: Partial<IPartnerProfile>;
    paymentDetails?: Partial<IPaymentDetails>;
}

interface PartnerResult {
    partner: unknown;
    source: "Redis" | "Database";
}

const isSessionData = (value: unknown): value is SessionData =>
    typeof value === "object" &&
    value !== null &&
    "userId" in value &&
    typeof value.userId === "string" &&
    Boolean(value.userId.trim()) &&
    Types.ObjectId.isValid(value.userId);

const getSession = async (sessionId: string): Promise<SessionData> => {
    const sessionData = await redis.get(`session:${sessionId}`);

    if (!sessionData) {
        throw new AppError("Session expired or invalid", 401);
    }

    let session: unknown;

    try {
        session = JSON.parse(sessionData);
    } catch {
        throw new AppError("Invalid session data", 401);
    }

    if (!isSessionData(session)) {
        throw new AppError("Invalid session data", 401);
    }

    return session;
};

const isDuplicateKeyError = (error: unknown): boolean =>
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000;

export const getPartner = async (
    sessionId: string,
): Promise<PartnerResult> => {
    const session = await getSession(sessionId);
    const { userId } = session;
    const cachedPartner = await redis.get(`partner:${userId}`);

    if (cachedPartner) {
        return {
            partner: JSON.parse(cachedPartner),
            source: "Redis",
        };
    }

    const partner = await User.findById(userId);

    if (!partner) {
        throw new AppError("Partner not found", 404);
    }

    await redis.set(
        `partner:${userId}`,
        JSON.stringify(partner),
        "EX",
        SESSION_TTL,
    );

    return {
        partner,
        source: "Database",
    };
};

export const updatePartner = async (
    sessionId: string,
    update: PartnerUpdate,
): Promise<IUser> => {
    try {
        const session = await getSession(sessionId);
        const sessionKey = `session:${sessionId}`;
        const sessionTtl = await redis.ttl(sessionKey);

        if (sessionTtl === 0) {
            throw new AppError("Session expired or invalid", 401);
        }

        const partner = await User.findById(session.userId);

        if (!partner || partner.role !== "partner") {
            throw new AppError("Partner not found", 404);
        }

        if (update.name !== undefined) {
            partner.name = update.name;
            session.name = update.name;
        }

        if (update.profileDetails) {
            const profile = update.profileDetails;
            if (profile.slug !== undefined) {
                partner.set("partnerProfile.slug", profile.slug);
            }
            if (profile.bio !== undefined) {
                partner.set("partnerProfile.bio", profile.bio);
            }
            if (profile.website !== undefined) {
                partner.set("partnerProfile.website", profile.website);
            }
            if (profile.socialLinks) {
                for (const key of ["youtube", "linkedin", "instagram", "github"] as const) {
                    const value = profile.socialLinks[key];
                    if (value !== undefined) {
                        partner.set(`partnerProfile.socialLinks.${key}`, value);
                    }
                }
            }
        }

        if (update.paymentDetails) {
            for (const key of [
                "method",
                "upiId",
                "accountHolderName",
                "accountNumber",
                "ifscCode",
            ] as const) {
                const value = update.paymentDetails[key];
                if (value !== undefined) {
                    partner.set(`paymentDetails.${key}`, value);
                }
            }
        }

        await partner.save();

        const updatedSession = JSON.stringify(session);
        const sessionWrite = sessionTtl > 0
            ? redis.set(sessionKey, updatedSession, "EX", sessionTtl)
            : redis.set(sessionKey, updatedSession);

        await Promise.all([
            sessionWrite,
            redis.set(
                `partner:${session.userId}`,
                JSON.stringify(partner),
                "EX",
                SESSION_TTL,
            ),
        ]);

        return partner;
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            throw new AppError("Profile slug already taken", 409);
        }

        throw error;
    }
};
