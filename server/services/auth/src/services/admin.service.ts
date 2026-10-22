import { AppError } from "../error/AppError.js";
import { User } from "../models/user.model.js";

interface AdminProfile {
    name: string;
    email: string;
    role: "admin";
}

export const getAdmin = async (): Promise<AdminProfile> => {
    const user = await User.findOne({
        role: "admin",
        isActive: true,
    })
        .select("name email role")
        .lean();

    if (!user) {
        throw new AppError("Active admin not found", 404);
    }

    return {
        name: user.name,
        email: user.email,
        role: "admin",
    };
};
