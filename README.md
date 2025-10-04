# Telegram Bot Backend

A Vercel-hosted backend for Telegram bot operations.

## Features

- Get bot information (`getMe`)
- Set/delete webhooks (`setWebhook`)
- Send messages (`sendMessage`)
- Edit messages (`editMessage`)
- Delete messages (`deleteMessage`)
- Answer callback queries (`answerCallbackQuery`)
- Get updates (`getUpdates`)
- Get webhook info (`getWebhookInfo`)

## API Endpoints

All endpoints are POST requests and require a bot token.

### GET /api/telegram/getMe
Get bot information.

**Request:**
```json
{
  "token": "your_bot_token"
}
