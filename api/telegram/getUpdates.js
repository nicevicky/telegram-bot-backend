/**
 * Get updates endpoint (for polling)
 */

import { handleCors, createResponse, handleApiError, logRequest } from '../../lib/utils.js';
import { verifyApiKey, validateBotToken, checkRateLimit } from '../../lib/auth.js';
import { getUpdates } from '../../lib/telegram.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;
  
  if (req.method !== 'POST') {
    return res.status(405).json(createResponse(false, null, 'Method not allowed'));
  }
  
  try {
    logRequest(req, { endpoint: 'getUpdates' });
    
    if (!verifyApiKey(req)) {
      return res.status(401).json(createResponse(false, null, 'Unauthorized'));
    }
    
    const clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    if (!checkRateLimit(clientIp, 30, 60000)) {
      return res.status(429).json(createResponse(false, null, 'Rate limit exceeded'));
    }
    
    const { token, ...options } = req.body;
    
    if (!validateBotToken(token)) {
      return res.status(400).json(createResponse(false, null, 'Invalid bot token format'));
    }
    
    const result = await getUpdates(token, options);
    
    if (result.success) {
      res.status(200).json(createResponse(true, result.data, 'Updates retrieved successfully'));
    } else {
      res.status(400).json(createResponse(false, null, result.error || 'Failed to get updates'));
    }
    
  } catch (error) {
    handleApiError(res, error);
  }
}
