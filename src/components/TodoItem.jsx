export default function TodoItem({ todo, onToggle, onRemove }) {
  return (
    <li className={todo.done ? 'item done' : 'item'}>
      <label>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <span>{todo.text}</span>
      </label>
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
