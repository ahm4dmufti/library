// Simple client-side auth using localStorage (for demo only)
// Emails must end with @limu.edu.ly domain
// WARNING: This is a demo implementation. Passwords are stored in plain text.
// For production use, implement proper server-side authentication with password hashing.

const ALLOWED_EMAIL_DOMAIN = '@limu.edu.ly';

/**
 * Creates a debounced function that delays invoking the callback.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} - The debounced function.
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

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
    return { valid: false, message: 'Email must end with ' + ALLOWED_EMAIL_DOMAIN };
  }
  
  return { valid: true, message: '' };
}

/**
 * Displays an error message for an email field.
 * @param {string} errorElementId - The ID of the error display element.
 * @param {string} message - The error message to display.
 */
function showEmailError(errorElementId, message) {
  const errorElement = document.getElementById(errorElementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = message ? 'block' : 'none';
  }
}

/**
 * Clears the error message for an email field.
 * @param {string} errorElementId - The ID of the error display element.
 */
function clearEmailError(errorElementId) {
  showEmailError(errorElementId, '');
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem('users') || '{}'); } catch (e) { return {}; }
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function setCurrentUser(email) {
  localStorage.setItem('currentUser', email);
}

function getCurrentUser() {
  return localStorage.getItem('currentUser');
}

function logout() {
  localStorage.removeItem('currentUser');
  renderState();
}

function renderState() {
  const state = document.getElementById('auth-state');
  const user = getCurrentUser();
  if (!state) return;
  if (user) {
    state.innerHTML = `<div class="alert alert-success">Signed in as <strong>${user}</strong> <button id="logout-btn" class="btn btn-sm btn-link">Logout</button></div>`;
    const btn = document.getElementById('logout-btn');
    if (btn) btn.onclick = logout;
  } else {
    state.innerHTML = `<div class="alert alert-info">Not signed in</div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderState();

  const regForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  
  // Debounced email validation handler to improve performance
  const validateEmailField = debounce((inputElement, errorElementId) => {
    const validation = validateEmail(inputElement.value);
    if (inputElement.value.trim() && !validation.valid) {
      showEmailError(errorElementId, validation.message);
    } else {
      clearEmailError(errorElementId);
    }
  }, 300);
  
  // Add real-time email validation for registration form
  const regEmailInput = document.getElementById('reg-email');
  if (regEmailInput) {
    regEmailInput.addEventListener('input', () => {
      validateEmailField(regEmailInput, 'reg-email-error');
    });
  }
  
  // Add real-time email validation for login form
  const loginEmailInput = document.getElementById('login-email');
  if (loginEmailInput) {
    loginEmailInput.addEventListener('input', () => {
      validateEmailField(loginEmailInput, 'login-email-error');
    });
  }

  regForm && regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('reg-email');
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const p = document.getElementById('reg-password').value;
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      showEmailError('reg-email-error', emailValidation.message);
      return;
    }
    clearEmailError('reg-email-error');
    
    if (!p) {
      alert('Password is required.');
      return;
    }

    const users = getUsers();
    if (users[email]) {
      showEmailError('reg-email-error', 'An account with this email already exists.');
      return;
    }
    
    users[email] = { password: p };
    saveUsers(users);
    setCurrentUser(email);
    renderState();
    alert('Registered and signed in as ' + email);
  });

  loginForm && loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const p = document.getElementById('login-password').value;
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      showEmailError('login-email-error', emailValidation.message);
      return;
    }
    clearEmailError('login-email-error');
    
    const users = getUsers();
    if (!users[email] || users[email].password !== p) {
      alert('Invalid credentials. Please check your email and password.');
      return;
    }
    
    setCurrentUser(email);
    renderState();
    alert('Signed in as ' + email);
  });
});
