const TelegramAPI = require('../../lib/telegram');

module.exports = async (req, res) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { 
      token, 
      callback_query_id, 
      text, 
      show_alert, 
      url, 
      cache_time 
    } = req.body;

    if (!token || !callback_query_id) {
      return res.status(400).json({
        success: false,
        error: 'Token and callback_query_id are required'
      });
    }

    // Validate token format
    if (!/^\d+:[A-Za-z0-9_-]{35}$/.test(token)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bot token format'
      });
    }

    const telegram = new TelegramAPI(token);
    const result = await telegram.answerCallbackQuery(callback_query_id, {
      text,
      show_alert,
      url,
      cache_time
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        result: result.data
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
        error_code: result.error_code
      });
    }
  } catch (error) {
    console.error('answerCallbackQuery error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
