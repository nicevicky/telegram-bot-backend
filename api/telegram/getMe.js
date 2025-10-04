/**
 * Get bot information endpoint
 */

import { handleCors, createResponse, handleApiError, logRequest } from '../../lib/utils.js';
import { verifyApiKey, validateBotToken, checkRateLimit } from '../../lib/auth.js';
import { getBotInfo } from '../../lib/telegram.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json(createResponse(false, null, 'Method not allowed'));
  }
  
  try {
    // Log request
    logRequest(req, { endpoint: 'getMe' });
    
    // Verify API key
    if (!verifyApiKey(req)) {
      return res.status(401).json(createResponse(false, null, 'Unauthorized'));
    }
    
    // Rate limiting
    const clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    if (!checkRateLimit(clientIp, 60, 60000)) { // 60 requests per minute
      return res.status(429).json(createResponse(false, null, 'Rate limit exceeded'));
    }
    
    const { token } = req.body;
    
    // Validate token
    if (!validateBotToken(token)) {
      return res.status(400).json(createResponse(false, null, 'Invalid bot token format'));
    }
    
    // Get bot info from Telegram
    const result = await getBotInfo(token);
    
    if (result.success) {
      res.status(200).json(createResponse(true, result.data, 'Bot information retrieved successfully'));
    } else {
      res.status(400).json(createResponse(false, null, result.error || 'Failed to get bot information'));
    }
    
  } catch (error) {
    handleApiError(res, error);
  }
}
