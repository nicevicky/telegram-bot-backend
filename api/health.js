/**
 * Health check endpoint
 */

import { handleCors, createResponse } from '../lib/utils.js';

export default function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;
  
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'production'
  };
  
  res.status(200).json(createResponse(true, healthData, 'Service is healthy'));
}
