const fetch = require('node-fetch');

const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

class TelegramAPI {
  constructor(token) {
    this.token = token;
    this.baseURL = `${TELEGRAM_API_BASE}${token}`;
  }

  async makeRequest(method, data = {}) {
    try {
      const url = `${this.baseURL}/${method}`;
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      };

      const response = await fetch(url, options);
      const result = await response.json();

      return {
        success: result.ok || false,
        data: result.result || null,
        error: result.description || null,
        error_code: result.error_code || null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message,
        error_code: 500
      };
    }
  }

  async getMe() {
    return await this.makeRequest('getMe');
  }

  async setWebhook(webhookUrl, options = {}) {
    const data = {
      url: webhookUrl,
      max_connections: options.max_connections || 40,
      allowed_updates: options.allowed_updates || ['message', 'callback_query']
    };
    return await this.makeRequest('setWebhook', data);
  }

  async deleteWebhook() {
    return await this.makeRequest('deleteWebhook');
  }

  async getWebhookInfo() {
    return await this.makeRequest('getWebhookInfo');
  }

  async sendMessage(chatId, text, options = {}) {
    const data = {
      chat_id: chatId,
      text: text,
      parse_mode: options.parse_mode || 'HTML',
      reply_markup: options.reply_markup || null,
      disable_web_page_preview: options.disable_web_page_preview || false,
      disable_notification: options.disable_notification || false,
      reply_to_message_id: options.reply_to_message_id || null
    };
    return await this.makeRequest('sendMessage', data);
  }

  async editMessageText(chatId, messageId, text, options = {}) {
    const data = {
      chat_id: chatId,
      message_id: messageId,
      text: text,
      parse_mode: options.parse_mode || 'HTML',
      reply_markup: options.reply_markup || null,
      disable_web_page_preview: options.disable_web_page_preview || false
    };
    return await this.makeRequest('editMessageText', data);
  }

  async deleteMessage(chatId, messageId) {
    const data = {
      chat_id: chatId,
      message_id: messageId
    };
    return await this.makeRequest('deleteMessage', data);
  }

  async answerCallbackQuery(callbackQueryId, options = {}) {
    const data = {
      callback_query_id: callbackQueryId,
      text: options.text || '',
      show_alert: options.show_alert || false,
      url: options.url || null,
      cache_time: options.cache_time || 0
    };
    return await this.makeRequest('answerCallbackQuery', data);
  }

  async getUpdates(options = {}) {
    const data = {
      offset: options.offset || null,
      limit: options.limit || 100,
      timeout: options.timeout || 0,
      allowed_updates: options.allowed_updates || null
    };
    return await this.makeRequest('getUpdates', data);
  }

  async sendPhoto(chatId, photo, options = {}) {
    const data = {
      chat_id: chatId,
      photo: photo,
      caption: options.caption || '',
      parse_mode: options.parse_mode || 'HTML',
      reply_markup: options.reply_markup || null,
      disable_notification: options.disable_notification || false,
      reply_to_message_id: options.reply_to_message_id || null
    };
    return await this.makeRequest('sendPhoto', data);
  }

  async sendDocument(chatId, document, options = {}) {
    const data = {
      chat_id: chatId,
      document: document,
      caption: options.caption || '',
      parse_mode: options.parse_mode || 'HTML',
      reply_markup: options.reply_markup || null,
      disable_notification: options.disable_notification || false,
      reply_to_message_id: options.reply_to_message_id || null
    };
    return await this.makeRequest('sendDocument', data);
  }
}

module.exports = TelegramAPI;
