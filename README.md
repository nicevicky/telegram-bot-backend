# Telegram Bot Backend for Vercel

This is a serverless backend for handling Telegram bot operations, designed to be deployed on Vercel.

## Features

- ✅ Complete Telegram Bot API wrapper
- ✅ Authentication and rate limiting
- ✅ CORS support
- ✅ Error handling and logging
- ✅ Webhook support
- ✅ Health check endpoint
- ✅ Serverless architecture

## API Endpoints

### Health Check
- `GET /api/health` - Service health check

### Telegram API
- `POST /api/telegram/getMe` - Get bot information
- `POST /api/telegram/setWebhook` - Set webhook URL
- `POST /api/telegram/getWebhookInfo` - Get webhook information
- `POST /api/telegram/sendMessage` - Send message
- `POST /api/telegram/editMessage` - Edit message
- `POST /api/telegram/deleteMessage` - Delete message
- `POST /api/telegram/answerCallbackQuery` - Answer callback query
- `POST /api/telegram/getUpdates` - Get updates (polling)

### Bot Operations
- `POST /api/bot/execute` - Execute bot commands
- `POST /api/bot/webhook` - Webhook handler

## Environment Variables

Set these in your Vercel dashboard:

```bash
API_SECRET_KEY=your-secret-api-key-here
ALLOWED_ORIGINS=https://yourdomain.com,https://anotherdomain.com
WEBHOOK_SECRET=your-webhook-secret-token
