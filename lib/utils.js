/**
 * Utility functions
 */

/**
 * Create standardized API response
 */
export function createResponse(success, data = null, message = '', error = null) {
  return {
    success,
    data,
    message,
    error,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handle API errors
 */
export function handleApiError(res, error, statusCode = 500) {
  console.error('API Error:', error);
  
  const response = createResponse(
    false,
    null,
    'An error occurred',
    typeof error === 'string' ? error : error.message
  );
  
  res.status(statusCode).json(response);
}

/**
 * Validate required fields
 */
export function validateRequiredFields(data, requiredFields) {
  const missing = [];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      missing.push(field);
    }
  }
  
  return missing;
}

/**
 * Sanitize input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Log request
 */
export function logRequest(req, additionalInfo = {}) {
  const logData = {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
    timestamp: new Date().toISOString(),
    ...additionalInfo
  };
  
  console.log('Request:', JSON.stringify(logData));
}
