import rateLimit from "express-rate-limit";

// Create rate limiter
const limiter = rateLimit({
  windowMs: 3 * 60 * 60 * 1000, // 3 hours
  max: 4, // limit each IP to 10 requests per windowMs
  handler: (_, res) => {
    res.status(429).json({
      error: "Too many requests, please try again later.",
      allowed: false,
    });
  },
});

export default function handler(req, res) {
  // Apply rate limiting
  return new Promise((resolve, reject) => {
    limiter(req, res, (result) => {
      if (result instanceof Error) {
        reject(result);
      }
      res.status(200).json({ allowed: true });
      resolve(result);
    });
  });
}
