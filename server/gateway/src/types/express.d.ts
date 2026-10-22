declare module "../../../shared/redis/redis.js" {
    import type Redis from "ioredis";

    const redis: Redis;
    export default redis;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                name: string;
                email: string;
                role: string;
            };
        }
    }
}

export { };