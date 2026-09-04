import { useState } from 'react'

export default function TodoItem({ todo, onToggle, onRemove, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)

  function startEditing() {
    setDraft(todo.text)
    setEditing(true)
  }

  function save() {
    const trimmed = draft.trim()
    if (trimmed) onEdit(todo.id, trimmed)
    setEditing(false)
  }

  function cancel() {
    setEditing(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') save()
    if (event.key === 'Escape') cancel()
  }

  if (editing) {
    return (
      <li className="item editing">
        <input
          type="text"
          className="edit-input"
          value={draft}
          autoFocus
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Editar tarefa"
        />
        <button type="button" className="save" onClick={save}>
          Salvar
        </button>
        <button type="button" className="link" onClick={cancel}>
          Cancelar
        </button>
      </li>
    )
  }

  return (
    <li className={todo.done ? 'item done' : 'item'}>
      <label>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <span onDoubleClick={startEditing}>{todo.text}</span>
      </label>
      <button
        type="button"
        className="edit"
        onClick={startEditing}
        aria-label={`Editar ${todo.text}`}
      >
        ✎
      </button>
      <button
        type="button"
        className="remove"
        onClick={() => onRemove(todo.id)}
        aria-label={`Remover ${todo.text}`}
      >
        ×
      </button>
    </li>
  )
}
