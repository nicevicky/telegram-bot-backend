/**
 * Authentication and security utilities
 */

const API_SECRET_KEY = process.env.API_SECRET_KEY || 'telegram-bot-api-key-runner';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? 
  process.env.ALLOWED_ORIGINS.split(',') : ['*'];

/**
 * Verify API secret key
 */
export function verifyApiKey(req) {
  const apiKey = req.headers['x-api-key'] || 
                 req.body?.secret || 
                 req.query?.secret;
  
  return apiKey === API_SECRET_KEY;
}

/**
 * CORS handler
 */
export function handleCors(req, res) {
  const origin = req.headers.origin;
  
  if (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization, X-API-Key');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  
  return false;
}

/**
 * Validate bot token format
 */
export function validateBotToken(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Telegram bot token format: {bot_id}:{bot_token}
  const tokenPattern = /^\d+:[A-Za-z0-9_-]{35}$/;
  return tokenPattern.test(token);
}

/**
 * Rate limiting (simple in-memory implementation)
 */
const rateLimitMap = new Map();

export function checkRateLimit(identifier, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }
  
  const requests = rateLimitMap.get(identifier);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(time => time > windowStart);
  
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);
  
  return true;
}
