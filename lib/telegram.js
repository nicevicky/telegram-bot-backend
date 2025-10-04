/**
 * Telegram API utilities
 */

import axios from 'axios';

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

/**
 * Make Telegram API request
 */
export async function telegramRequest(token, method, data = {}) {
  try {
    const url = `${TELEGRAM_API_BASE}${token}/${method}`;
    
    const config = {
      method: 'POST',
      url: url,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BotHost-Backend/1.0'
      },
      timeout: 30000,
      validateStatus: (status) => status < 500 // Don't throw on 4xx errors
    };
    
    const response = await axios(config);
    
    return {
      success: response.data?.ok || false,
      data: response.data?.result || null,
      error: response.data?.description || null,
      error_code: response.data?.error_code || null,
      status: response.status
    };
  } catch (error) {
    console.error('Telegram API Error:', error.message);
    
    return {
      success: false,
      data: null,
      error: error.response?.data?.description || error.message,
      error_code: error.response?.data?.error_code || 500,
      status: error.response?.status || 500
    };
  }
}

/**
 * Get bot information
 */
export async function getBotInfo(token) {
  return await telegramRequest(token, 'getMe');
}

/**
 * Set webhook
 */
export async function setWebhook(token, webhookUrl, options = {}) {
  const data = {
    url: webhookUrl,
    max_connections: options.max_connections || 40,
    allowed_updates: options.allowed_updates || ['message', 'callback_query', 'inline_query'],
    drop_pending_updates: options.drop_pending_updates || false
  };
  
  if (options.secret_token) {
    data.secret_token = options.secret_token;
  }
  
  return await telegramRequest(token, 'setWebhook', data);
}

/**
 * Get webhook info
 */
export async function getWebhookInfo(token) {
  return await telegramRequest(token, 'getWebhookInfo');
}

/**
 * Send message
 */
export async function sendMessage(token, chatId, text, options = {}) {
  const data = {
    chat_id: chatId,
    text: text,
    parse_mode: options.parse_mode || 'HTML',
    disable_web_page_preview: options.disable_web_page_preview || false,
    disable_notification: options.disable_notification || false,
    reply_to_message_id: options.reply_to_message_id || null,
    reply_markup: options.reply_markup || null
  };
  
  return await telegramRequest(token, 'sendMessage', data);
}

/**
 * Edit message
 */
export async function editMessage(token, chatId, messageId, text, options = {}) {
  const data = {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    parse_mode: options.parse_mode || 'HTML',
    disable_web_page_preview: options.disable_web_page_preview || false,
    reply_markup: options.reply_markup || null
  };
  
  return await telegramRequest(token, 'editMessageText', data);
}

/**
 * Delete message
 */
export async function deleteMessage(token, chatId, messageId) {
  const data = {
    chat_id: chatId,
    message_id: messageId
  };
  
  return await telegramRequest(token, 'deleteMessage', data);
}

/**
 * Answer callback query
 */
export async function answerCallbackQuery(token, callbackQueryId, options = {}) {
  const data = {
    callback_query_id: callbackQueryId,
    text: options.text || '',
    show_alert: options.show_alert || false,
    url: options.url || null,
    cache_time: options.cache_time || 0
  };
  
  return await telegramRequest(token, 'answerCallbackQuery', data);
}

/**
 * Get updates (for polling)
 */
export async function getUpdates(token, options = {}) {
  const data = {
    offset: options.offset || null,
    limit: options.limit || 100,
    timeout: options.timeout || 0,
    allowed_updates: options.allowed_updates || ['message', 'callback_query']
  };
  
  return await telegramRequest(token, 'getUpdates', data);
}
