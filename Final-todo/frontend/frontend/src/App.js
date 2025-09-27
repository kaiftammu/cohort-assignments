import React, { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");


  // 📌 Fetch items
  const fetchItems = async () => {
    const res = await fetch("http://localhost:5000/items");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 📌 Add
  const addItem = async () => {
    if (!newItem.trim()) return;
    await fetch("http://localhost:5000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItem }),
    });
    setNewItem("");
    fetchItems();
  };

  // 📌 Delete
  const deleteItem = async (id) => {
    await fetch(`http://localhost:5000/items/${id}`, {
      method: "DELETE",
    });
    fetchItems();
  };

  // 📌 Toggle Done
  const toggleDone = async (id, currentStatus) => {
    await fetch(`http://localhost:5000/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !currentStatus }),
    });
    fetchItems();
  };

  // 📌 Edit Name
  const editItem = async (id, newName) => {
    await fetch(`http://localhost:5000/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, done: false }),
    });
    fetchItems();
  };
  const saveEdit = async (id) => {
  if (!editingText.trim()) return;
  await editItem(id, editingText);
  setEditingId(null);
  setEditingText("");
};

return (
  <div className="container">
    <h1>✅ Todo App</h1>

    <div className="input-group">
      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add new todo"
      />
      <button onClick={addItem}>Add</button>
    </div>

    <ul>
      {items.map((item) => (
        <li key={item._id} className="todo-item">
          {editingId === item._id ? (
            <div className="edit-mode">
              <input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
              <button onClick={() => saveEdit(item._id)}>💾</button>
              <button onClick={() => setEditingId(null)}>❌</button>
            </div>
          ) : (
            <>
              <span
                className={item.done ? "done" : ""}
                onClick={() => toggleDone(item._id, item.done)}
              >
                {item.name}
              </span>
              <div className="actions">
                <button onClick={() => deleteItem(item._id)}>❌</button>
                <button
                  onClick={() => {
                    setEditingId(item._id);
                    setEditingText(item.name);
                  }}
                >
                  ✏️
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  </div>
);

}

export default App;
