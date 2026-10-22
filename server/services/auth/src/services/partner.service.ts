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
const PUBLIC_PARTNERS_CACHE_TTL = 10 * 60;
const PUBLIC_PARTNERS_CACHE_KEY = "public:partners:v2";

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

export interface PublicPartner {
    _id: string;
    name: string;
    isActive: boolean;
    partnerProfile: {
        slug: string;
        bio: string;
        website: string;
        socialLinks: {
            youtube: string;
            linkedin: string;
            instagram: string;
            github: string;
        };
    };
}

interface PublicPartnersResult {
    partners: PublicPartner[];
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

export const getAllPublicPartner = async (): Promise<PublicPartnersResult> => {
    const cachedPartners = await redis.get(PUBLIC_PARTNERS_CACHE_KEY);

    if (cachedPartners) {
        const partners: unknown = JSON.parse(cachedPartners);
        const hasActiveStatus = Array.isArray(partners) &&
            partners.every(
                (partner) =>
                    typeof partner === "object" &&
                    partner !== null &&
                    "isActive" in partner &&
                    typeof partner.isActive === "boolean",
            );

        if (hasActiveStatus) {
            return {
                partners: partners as PublicPartner[],
                source: "Redis",
            };
        }

        await redis.del(PUBLIC_PARTNERS_CACHE_KEY);
    }

    const partnerDocuments = await User.find({
        role: "partner",
        isActive: true,
        "partnerProfile.slug": { $regex: /\S/ },
    })
        .select(
            "_id name isActive partnerProfile.slug partnerProfile.bio partnerProfile.website partnerProfile.socialLinks",
        )
        .lean();

    const partners: PublicPartner[] = partnerDocuments.map((partner) => ({
        _id: partner._id.toString(),
        name: partner.name,
        isActive: partner.isActive,
        partnerProfile: {
            slug: partner.partnerProfile?.slug ?? "",
            bio: partner.partnerProfile?.bio ?? "",
            website: partner.partnerProfile?.website ?? "",
            socialLinks: {
                youtube: partner.partnerProfile?.socialLinks?.youtube ?? "",
                linkedin: partner.partnerProfile?.socialLinks?.linkedin ?? "",
                instagram: partner.partnerProfile?.socialLinks?.instagram ?? "",
                github: partner.partnerProfile?.socialLinks?.github ?? "",
            },
        },
    }));

    await redis.set(
        PUBLIC_PARTNERS_CACHE_KEY,
        JSON.stringify(partners),
        "EX",
        PUBLIC_PARTNERS_CACHE_TTL,
    );

    return {
        partners,
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
            redis.del(PUBLIC_PARTNERS_CACHE_KEY),
        ]);

        return partner;
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            throw new AppError("Profile slug already taken", 409);
        }

        throw error;
    }
};
