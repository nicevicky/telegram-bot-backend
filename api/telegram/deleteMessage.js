/**
 * Delete message endpoint
 */

import { handleCors, createResponse, handleApiError, logRequest, validateRequiredFields } from '../../lib/utils.js';
import { verifyApiKey, validateBotToken, checkRateLimit } from '../../lib/auth.js';
import { deleteMessage } from '../../lib/telegram.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;
  
  if (req.method !== 'POST') {
    return res.status(405).json(createResponse(false, null, 'Method not allowed'));
  }
  
  try {
    logRequest(req, { endpoint: 'deleteMessage' });
    
    if (!verifyApiKey(req)) {
      return res.status(401).json(createResponse(false, null, 'Unauthorized'));
    }
    
    const clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    if (!checkRateLimit(clientIp, 100, 60000)) {
      return res.status(429).json(createResponse(false, null, 'Rate limit exceeded'));
    }
    
    const missing = validateRequiredFields(req.body, ['token', 'chat_id', 'message_id']);
    if (missing.length > 0) {
      return res.status(400).json(createResponse(false, null, `Missing required fields: ${missing.join(', ')}`));
    }
    
    const { token, chat_id, message_id } = req.body;
    
    if (!validateBotToken(token)) {
      return res.status(400).json(createResponse(false, null, 'Invalid bot token format'));
    }
    
    const result = await deleteMessage(token, chat_id, message_id);
    
    if (result.success) {
      res.status(200).json(createResponse(true, result.data, 'Message deleted successfully'));
    } else {
      res.status(400).json(createResponse(false, null, result.error || 'Failed to delete message'));
    }
    
  } catch (error) {
    handleApiError(res, error);
  }
}
