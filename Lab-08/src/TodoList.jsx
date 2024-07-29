import { useState } from "react";
import './TodoList.css'

function TodoList({ todos, toggleItem, deleteItem, editItem }) {
  const [editMode, setEditMode] = useState({});
  const [tempTitle, setTempTitle] = useState({});

  const handleEditClickEvent = (id) => {
    // toggle the edit mode when user clicks the edit button
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
    // set the temporary title so when user click edit the current title is shown in the input field
    if (!editMode[id]) {
      setTempTitle((prev) => ({ ...prev, [id]: todos.find(todo => todo.id === id).title }));
    }
  };

  const handleTitleChange = (id) => {
    // Save the new title
    editItem(id, tempTitle[id]);
    setEditMode((prev) => ({ ...prev, [id]: false }));
  };

  const handleInputChange = (id, newTitle) => {
    // set the temporary title for change
    setTempTitle((prev) => ({ ...prev, [id]: newTitle }));
  };

  return (
    <ul className="list">
      {todos.map((todo) => (
        <li key={todo.id}>
          <label>
            <input
              checked={todo.completed}
              type="checkbox"
              onChange={(e) => toggleItem(todo.id, e.target.checked)}
            />
            {editMode[todo.id] ? (
              <input
                type="text"
                value={tempTitle[todo.id]}
                onChange={(e) => handleInputChange(todo.id, e.target.value)}
                autoFocus
              />
            ) : (
              <span>{todo.title}</span>
            )}
          </label>
          <button id='edit-save' onClick={() => (editMode[todo.id] ? handleTitleChange(todo.id) : handleEditClickEvent(todo.id))}>
                 {editMode[todo.id] ? 'Save' : 'Edit'}
          </button>
          <button id='delete' onClick={() => deleteItem(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
