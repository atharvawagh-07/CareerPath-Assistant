import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const ipBuckets = new Map<string, RateLimitStore>();

// Cleanup stale buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipBuckets.entries()) {
    if (now > record.resetTime) {
      ipBuckets.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(options: { windowMs: number; max: number; message?: string }) {
  const { windowMs, max, message = 'Too many requests. Please try again later.' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiting in development or test if desired, but keep it active for safety
    const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown-ip';
    const routeKey = `${req.baseUrl}${req.path}:${clientIp}`;
    const now = Date.now();

    const record = ipBuckets.get(routeKey);

    if (!record || now > record.resetTime) {
      ipBuckets.set(routeKey, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count++;
    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        error: message,
        retryAfterSeconds
      });
    }

    next();
  };
}
