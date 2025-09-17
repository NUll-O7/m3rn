import ratelimit from '../config/limiter.js';

const rateLimiter = async (req, res, next) => {
    try {
        const { success, limit, remaining, reset } = await ratelimit.limit(req.ip);
        if (!success) {
            return res.status(429).json({ message: "Too many requests, please try again later." });
        }
        // Optionally set rate limit headers for client awareness
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', reset);
        next();
    } catch (error) {
        console.error('Rate limiter error:', error);
        next(error);
    }
};

export default rateLimiter;
