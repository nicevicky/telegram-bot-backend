/**
 * Set webhook endpoint
 */

import { handleCors, createResponse, handleApiError, logRequest, validateRequiredFields } from '../../lib/utils.js';
import { verifyApiKey, validateBotToken, checkRateLimit } from '../../lib/auth.js';
import { setWebhook } from '../../lib/telegram.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json(createResponse(false, null, 'Method not allowed'));
  }
  
  try {
    // Log request
    logRequest(req, { endpoint: 'setWebhook' });
    
    // Verify API key
    if (!verifyApiKey(req)) {
      return res.status(401).json(createResponse(false, null, 'Unauthorized'));
    }
    
    // Rate limiting
    const clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    if (!checkRateLimit(clientIp, 30, 60000)) { // 30 requests per minute
      return res.status(429).json(createResponse(false, null, 'Rate limit exceeded'));
    }
    
    // Validate required fields
    const missing = validateRequiredFields(req.body, ['token', 'webhook_url']);
    if (missing.length > 0) {
      return res.status(400).json(createResponse(false, null, `Missing required fields: ${missing.join(', ')}`));
    }
    
    const { token, webhook_url, max_connections, allowed_updates, secret_token } = req.body;
    
    // Validate token
    if (!validateBotToken(token)) {
      return res.status(400).json(createResponse(false, null, 'Invalid bot token format'));
    }
    
    // Validate webhook URL
    if (webhook_url && !webhook_url.startsWith('https://')) {
      return res.status(400).json(createResponse(false, null, 'Webhook URL must use HTTPS'));
    }
    
    // Set webhook
    const options = {
      max_connections,
      allowed_updates,
      secret_token
    };
    
    const result = await setWebhook(token, webhook_url, options);
    
    if (result.success) {
      res.status(200).json(createResponse(true, result.data, 'Webhook set successfully'));
    } else {
      res.status(400).json(createResponse(false, null, result.error || 'Failed to set webhook'));
    }
    
  } catch (error) {
    handleApiError(res, error);
  }
}
