/**
 * Execute bot command endpoint
 * This will be used for command handling from your hosting platform
 */

import { handleCors, createResponse, handleApiError, logRequest, validateRequiredFields } from '../../lib/utils.js';
import { verifyApiKey, validateBotToken, checkRateLimit } from '../../lib/auth.js';
import { sendMessage, editMessage, deleteMessage, answerCallbackQuery } from '../../lib/telegram.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;
  
  if (req.method !== 'POST') {
        return res.status(405).json(createResponse(false, null, 'Method not allowed'));
  }
  
  try {
    logRequest(req, { endpoint: 'execute' });
    
    if (!verifyApiKey(req)) {
      return res.status(401).json(createResponse(false, null, 'Unauthorized'));
    }
    
    const clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    if (!checkRateLimit(clientIp, 200, 60000)) {
      return res.status(429).json(createResponse(false, null, 'Rate limit exceeded'));
    }
    
    const missing = validateRequiredFields(req.body, ['token', 'action']);
    if (missing.length > 0) {
      return res.status(400).json(createResponse(false, null, `Missing required fields: ${missing.join(', ')}`));
    }
    
    const { token, action, ...params } = req.body;
    
    if (!validateBotToken(token)) {
      return res.status(400).json(createResponse(false, null, 'Invalid bot token format'));
    }
    
    let result;
    
    switch (action) {
      case 'sendMessage':
        if (!params.chat_id || !params.text) {
          return res.status(400).json(createResponse(false, null, 'Missing chat_id or text'));
        }
        result = await sendMessage(token, params.chat_id, params.text, params);
        break;
        
      case 'editMessage':
        if (!params.chat_id || !params.message_id || !params.text) {
          return res.status(400).json(createResponse(false, null, 'Missing chat_id, message_id, or text'));
        }
        result = await editMessage(token, params.chat_id, params.message_id, params.text, params);
        break;
        
      case 'deleteMessage':
        if (!params.chat_id || !params.message_id) {
          return res.status(400).json(createResponse(false, null, 'Missing chat_id or message_id'));
        }
        result = await deleteMessage(token, params.chat_id, params.message_id);
        break;
        
      case 'answerCallbackQuery':
        if (!params.callback_query_id) {
          return res.status(400).json(createResponse(false, null, 'Missing callback_query_id'));
        }
        result = await answerCallbackQuery(token, params.callback_query_id, params);
        break;
        
      default:
        return res.status(400).json(createResponse(false, null, 'Invalid action'));
    }
    
    if (result.success) {
      res.status(200).json(createResponse(true, result.data, `${action} executed successfully`));
    } else {
      res.status(400).json(createResponse(false, null, result.error || `Failed to execute ${action}`));
    }
    
  } catch (error) {
    handleApiError(res, error);
  }
}
