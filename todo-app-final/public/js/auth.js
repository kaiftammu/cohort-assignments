const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const msg = document.getElementById('msg');

showRegister && showRegister.addEventListener('click', e => {
  e.preventDefault();
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});
showLogin && showLogin.addEventListener('click', e => {
  e.preventDefault();
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  msg.textContent = '';
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('token', data.token);
    window.location = '/todos.html';
  } catch (err) {
    msg.textContent = err.message;
  }
});

registerForm.addEventListener('submit', async e => {
  e.preventDefault();
  msg.textContent = '';
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    localStorage.setItem('token', data.token);
    window.location = '/todos.html';
  } catch (err) {
    msg.textContent = err.message;
  }
});
