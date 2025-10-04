module.exports = (req, res) => {
  res.json({
    message: "Telegram Bot Backend API",
    endpoints: [
      "/api/telegram/getMe",
      "/api/telegram/setWebhook", 
      "/api/telegram/sendMessage",
      "/api/telegram/editMessage",
      "/api/telegram/deleteMessage",
      "/api/telegram/answerCallbackQuery",
      "/api/telegram/getUpdates",
      "/api/telegram/getWebhookInfo"
    ]
  });
};
