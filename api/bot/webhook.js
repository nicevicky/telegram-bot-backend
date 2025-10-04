/**
 * Generic webhook handler for bots
 * This endpoint will receive webhooks and forward them to your hosting platform
 */

import { handleCors, createResponse, handleApiError, logRequest } from '../../lib/utils.js';
import { checkRateLimit } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;
  
  if (req.method !== 'POST') {
    return res.status(405).json(createResponse(false, null, 'Method not allowed'));
  }
  
  try {
    logRequest(req, { endpoint: 'webhook', hasUpdate: !!req.body.update_id });
    
    // Rate limiting for webhooks
    const clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
    if (!checkRateLimit(clientIp, 1000, 60000)) { // 1000 requests per minute for webhooks
      return res.status(429).json(createResponse(false, null, 'Rate limit exceeded'));
    }
    
    // Extract bot token from URL path or headers
    const botToken = req.query.token || req.headers['x-telegram-bot-api-secret-token'];
    
    if (!botToken) {
      return res.status(400).json(createResponse(false, null, 'Bot token required'));
    }
    
    // Validate webhook secret if provided
    const webhookSecret = req.headers['x-telegram-bot-api-secret-token'];
    if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json(createResponse(false, null, 'Invalid webhook secret'));
    }
    
    // Process the update
    const update = req.body;
    
    if (!update || !update.update_id) {
      return res.status(400).json(createResponse(false, null, 'Invalid update format'));
    }
    
    // Here you would typically forward the update to your hosting platform
    // For now, we'll just log it and return success
    console.log('Webhook received:', {
      bot_token: botToken.substring(0, 10) + '...',
      update_id: update.update_id,
      message: update.message ? 'Yes' : 'No',
      callback_query: update.callback_query ? 'Yes' : 'No',
      inline_query: update.inline_query ? 'Yes' : 'No'
    });
    
    // You can add your custom webhook processing logic here
    // For example, forward to your hosting platform's webhook handler
    
    res.status(200).json(createResponse(true, { processed: true }, 'Webhook processed successfully'));
    
  } catch (error) {
    handleApiError(res, error);
  }
}
