import TodoItem from './TodoItem.jsx'

export default function TodoList({ todos, onToggle, onRemove }) {
  if (todos.length === 0) {
    return <p className="empty">Nada por aqui.</p>
  }

  return (
    <ul className="list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </ul>
  )
}
