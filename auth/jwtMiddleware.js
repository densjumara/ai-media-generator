// JWT Middleware - Verify authentication tokens

import { verifyToken, isTokenInvalidated } from './authService.js';

/**
 * Middleware to verify JWT token
 */
export function authenticateToken(req, res, next) {
  try {
    // Get token from headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Check if token is invalidated
    if (isTokenInvalidated(token)) {
      return res.status(401).json({
        success: false,
        error: 'Token has been revoked'
      });
    }

    // Verify token
    const verification = verifyToken(token);

    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Attach user to request
    req.user = verification.user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
}

/**
 * Optional authentication middleware
 * Doesn't fail if no token, but attaches user if valid token provided
 */
export function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token && !isTokenInvalidated(token)) {
      const verification = verifyToken(token);
      if (verification.valid) {
        req.user = verification.user;
        req.token = token;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}
