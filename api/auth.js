/**
 * Backend Authentication Module for Library System
 * 
 * This module provides server-side validation for login and registration.
 * Emails must end with '@limu.edu.ly' domain.
 * 
 * Usage (Node.js):
 *   const auth = require('./auth');
 *   
 *   // Validate email
 *   const result = auth.validateEmail('user@limu.edu.ly');
 *   // Returns: { valid: true, message: '' }
 *   
 *   // Process registration
 *   const regResult = auth.processRegistration('user@limu.edu.ly', 'password123');
 *   // Returns: { success: true, message: 'Registration successful' }
 *   
 *   // Process login
 *   const loginResult = auth.processLogin('user@limu.edu.ly', 'password123');
 *   // Returns: { success: true, message: 'Login successful', user: {...} }
 */

const ALLOWED_EMAIL_DOMAIN = '@limu.edu.ly';

// In-memory user store (for demo purposes - replace with database in production)
const users = {};

/**
 * Validates that an email address ends with the allowed domain.
 * @param {string} email - The email address to validate.
 * @returns {{valid: boolean, message: string}} - Validation result with message.
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required.' };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }

  // Check if email ends with allowed domain
  if (!trimmedEmail.endsWith(ALLOWED_EMAIL_DOMAIN)) {
    return {
      valid: false,
      message: 'Email must end with ' + ALLOWED_EMAIL_DOMAIN
    };
  }

  return { valid: true, message: '' };
}

/**
 * Validates password meets minimum requirements.
 * @param {string} password - The password to validate.
 * @returns {{valid: boolean, message: string}} - Validation result with message.
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }

  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }

  return { valid: true, message: '' };
}

/**
 * Process a registration request with server-side validation.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {{success: boolean, message: string}} - Registration result.
 */
function processRegistration(email, password) {
  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return { success: false, message: emailValidation.message };
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { success: false, message: passwordValidation.message };
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if user already exists
  if (users[normalizedEmail]) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  // Create new user (in production, hash the password)
  users[normalizedEmail] = {
    email: normalizedEmail,
    password: password, // In production: use bcrypt or similar
    createdAt: new Date().toISOString()
  };

  return { success: true, message: 'Registration successful.' };
}

/**
 * Process a login request with server-side validation.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {{success: boolean, message: string, user?: object}} - Login result.
 */
function processLogin(email, password) {
  // Validate email format and domain
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return { success: false, message: emailValidation.message };
  }

  if (!password) {
    return { success: false, message: 'Password is required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if user exists
  const user = users[normalizedEmail];
  if (!user) {
    return { success: false, message: 'Invalid email or password.' };
  }

  // Verify password (in production, compare hashed passwords)
  if (user.password !== password) {
    return { success: false, message: 'Invalid email or password.' };
  }

  return {
    success: true,
    message: 'Login successful.',
    user: {
      email: user.email,
      createdAt: user.createdAt
    }
  };
}

/**
 * Get allowed email domain.
 * @returns {string} - The allowed email domain.
 */
function getAllowedDomain() {
  return ALLOWED_EMAIL_DOMAIN;
}

// Export functions for use in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateEmail,
    validatePassword,
    processRegistration,
    processLogin,
    getAllowedDomain,
    ALLOWED_EMAIL_DOMAIN
  };
}
