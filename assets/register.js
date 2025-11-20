// Simple client-side auth using localStorage (for demo only)

function getUsers() {
  try { return JSON.parse(localStorage.getItem('users') || '{}'); } catch (e) { return {}; }
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function setCurrentUser(username) {
  localStorage.setItem('currentUser', username);
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

  regForm && regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('reg-username').value.trim();
    const p = document.getElementById('reg-password').value;
    if (!u || !p) return alert('Enter username and password');

    const users = getUsers();
    if (users[u]) return alert('Username already exists');
    users[u] = { password: p };
    saveUsers(users);
    setCurrentUser(u);
    renderState();
    alert('Registered and signed in as ' + u);
  });

  loginForm && loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value;
    const users = getUsers();
    if (!users[u] || users[u].password !== p) return alert('Invalid credentials');
    setCurrentUser(u);
    renderState();
    alert('Signed in as ' + u);
  });
});
