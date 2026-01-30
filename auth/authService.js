// Authentication Service - Handles login, registration, and JWT

import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// In-memory user storage (use database in production)
const users = new Map();
const tokens = new Map();

/**
 * Register a new user with email
 */
export async function registerUser(email, password, name) {
  try {
    // Check if user exists
    if (users.has(email)) {
      throw new Error('User already exists');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user object
    const user = {
      id: generateUserId(),
      email,
      name: name || email.split('@')[0],
      password: hashedPassword,
      authMethod: 'email',
      createdAt: new Date(),
      lastLogin: new Date(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}`
    };

    // Store user
    users.set(email, user);

    // Generate JWT token
    const token = generateToken(user);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      },
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Login with email and password
 */
export async function loginWithEmail(email, password) {
  try {
    // Find user
    const user = users.get(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate JWT token
    const token = generateToken(user);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      },
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Login/Register with Google
 */
export async function loginWithGoogle(googleProfile) {
  try {
    const email = googleProfile.email;
    let user = users.get(email);

    if (!user) {
      // Create new user from Google profile
      user = {
        id: generateUserId(),
        email: email,
        name: googleProfile.name || 'Google User',
        password: null, // No password for OAuth users
        authMethod: 'google',
        googleId: googleProfile.id,
        createdAt: new Date(),
        lastLogin: new Date(),
        avatar: googleProfile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(googleProfile.name)}`
      };

      users.set(email, user);
    } else {
      // Update user if logging in with Google
      user.lastLogin = new Date();
      if (!user.googleId) {
        user.googleId = googleProfile.id;
        user.authMethod = 'both'; // Can login with both email and Google
      }
    }

    // Generate JWT token
    const token = generateToken(user);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        authMethod: user.authMethod
      },
      token
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return {
      valid: true,
      user: decoded
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

/**
 * Get user by email
 */
export function getUserByEmail(email) {
  return users.get(email) || null;
}

/**
 * Get user by ID
 */
export function getUserById(userId) {
  for (const user of users.values()) {
    if (user.id === userId) {
      return user;
    }
  }
  return null;
}

/**
 * Logout (invalidate token)
 */
export function logout(token) {
  tokens.set(token, { invalidated: true, timestamp: new Date() });
  return { success: true };
}

/**
 * Check if token is invalidated
 */
export function isTokenInvalidated(token) {
  const invalidation = tokens.get(token);
  return invalidation && invalidation.invalidated;
}

/**
 * Generate JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };

  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const expiry = process.env.JWT_EXPIRY || '24h';

  return jwt.sign(payload, secret, { expiresIn: expiry });
}

/**
 * Generate unique user ID
 */
function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get all users (for development only)
 */
export function getAllUsers() {
  const userList = [];
  for (const user of users.values()) {
    userList.push({
      id: user.id,
      email: user.email,
      name: user.name,
      authMethod: user.authMethod,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    });
  }
  return userList;
}

/**
 * Delete user (for development only)
 */
export function deleteUser(email) {
  return users.delete(email);
}
