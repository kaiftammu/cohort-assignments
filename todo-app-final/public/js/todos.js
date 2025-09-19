const token = localStorage.getItem('token');
if (!token) {
  window.location = '/';
}

const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
const todosList = document.getElementById('todosList');
const createForm = document.getElementById('createForm');
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location = '/';
});

createForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('desc').value.trim();
  if (!title) return alert('Title required');

  try {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, description })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create');
    document.getElementById('title').value = '';
    document.getElementById('desc').value = '';
    loadTodos();
  } catch (err) {
    alert(err.message);
  }
});

async function loadTodos() {
  todosList.innerHTML = 'Loading...';
  try {
    const res = await fetch('/api/todos', { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load');
    if (data.length === 0) {
      todosList.innerHTML = '<p>No todos yet.</p>';
      return;
    }
    todosList.innerHTML = '';
    data.forEach(todo => {
      const el = document.createElement('div');
      el.className = 'todo' + (todo.completed ? ' done' : '');
      el.innerHTML = `
        <div class="left">
          <input type="checkbox" class="toggle" ${todo.completed ? 'checked' : ''} data-id="${todo._id}" />
          <div class="meta">
            <strong class="title">${escapeHtml(todo.title)}</strong>
            <div class="desc">${escapeHtml(todo.description || '')}</div>
            <small>${new Date(todo.createdAt).toLocaleString()}</small>
          </div>
        </div>
        <div class="actions">
          <button class="edit" data-id="${todo._id}">Edit</button>
          <button class="delete" data-id="${todo._id}">Delete</button>
        </div>
      `;
      todosList.appendChild(el);
    });

    // attach handlers
    document.querySelectorAll('.toggle').forEach(cb => {
      cb.addEventListener('change', async (e) => {
        const id = e.target.dataset.id;
        await fetch(`/api/todos/${id}/toggle`, { method: 'PATCH', headers }).then(loadTodos);
      });
    });

    document.querySelectorAll('.delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (!confirm('Delete this todo?')) return;
        const id = e.target.dataset.id;
        await fetch(`/api/todos/${id}`, { method: 'DELETE', headers }).then(loadTodos);
      });
    });

    document.querySelectorAll('.edit').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const currentTitle = e.target.closest('.todo').querySelector('.title').textContent;
        const currentDesc = e.target.closest('.todo').querySelector('.desc').textContent;
        const newTitle = prompt('Edit title', currentTitle);
        if (newTitle === null) return;
        const newDesc = prompt('Edit description', currentDesc);
        await fetch(`/api/todos/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ title: newTitle, description: newDesc })
        }).then(loadTodos);
      });
    });

  } catch (err) {
    todosList.innerHTML = '<p>Error loading todos</p>';
    console.error(err);
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

loadTodos();
