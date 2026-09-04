import { useMemo, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import TodoForm from './components/TodoForm.jsx'
import TodoList from './components/TodoList.jsx'
import TodoFilters from './components/TodoFilters.jsx'

const STORAGE_KEY = 'todos'

export default function App() {
  const [todos, setTodos] = useLocalStorage(STORAGE_KEY, [])
  const [filter, setFilter] = useState('all')

  function addTodo(text) {
    setTodos((current) => [
      ...current,
      { id: crypto.randomUUID(), text, done: false },
    ])
  }

  function toggleTodo(id) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    )
  }

  function removeTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  function clearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.done))
  }

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.done)
    if (filter === 'done') return todos.filter((todo) => todo.done)
    return todos
  }, [todos, filter])

  const remaining = todos.filter((todo) => !todo.done).length

  return (
    <main className="app">
      <h1>Minhas tarefas</h1>

      <TodoForm onAdd={addTodo} />

      <TodoFilters current={filter} onChange={setFilter} />

      <TodoList
        todos={visibleTodos}
        onToggle={toggleTodo}
        onRemove={removeTodo}
      />

      <footer className="footer">
        <span>
          {remaining} {remaining === 1 ? 'tarefa pendente' : 'tarefas pendentes'}
        </span>
        {todos.length > remaining && (
          <button type="button" className="link" onClick={clearCompleted}>
            Limpar concluídas
          </button>
        )}
      </footer>
    </main>
  )
}
