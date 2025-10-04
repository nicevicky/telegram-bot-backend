/**
 * Answer callback query endpoint
 */

import { handleCors, createResponse, handleApiError, logRequest, validateRequiredFields } from '../../lib/utils.js';
import { verifyApiKey, validateBotToken, checkRateLimit } from '../../lib/auth.js';
import { answerCallbackQuery } from '../../lib/telegram.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;
  
  if (req.method !== 'POST') {
    return res.status(405).json(createResponse(false, null, 'Method not allowed'));
  }
  
  try {
    logRequest(req, { endpoint: 'answerCallbackQuery' });
    
    if (!verifyApiKey(req)) {
      return res.status(401).json(createResponse(false, null, 'Unauthorized'));
    }
    
    const clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    if (!checkRateLimit(clientIp, 200, 60000)) {
      return res.status(429).json(createResponse(false, null, 'Rate limit exceeded'));
    }
    
    const missing = validateRequiredFields(req.body, ['token', 'callback_query_id']);
    if (missing.length > 0) {
      return res.status(400).json(createResponse(false, null, `Missing required fields: ${missing.join(', ')}`));
    }
    
    const { token, callback_query_id, ...options } = req.body;
    
    if (!validateBotToken(token)) {
      return res.status(400).json(createResponse(false, null, 'Invalid bot token format'));
    }
    
    const result = await answerCallbackQuery(token, callback_query_id, options);
    
    if (result.success) {
      res.status(200).json(createResponse(true, result.data, 'Callback query answered successfully'));
    } else {
      res.status(400).json(createResponse(false, null, result.error || 'Failed to answer callback query'));
    }
    
  } catch (error) {
    handleApiError(res, error);
  }
}
