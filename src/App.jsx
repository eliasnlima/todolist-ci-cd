import { useMemo, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { gerarId } from './utils/id.js'
import { PRIORITY_DEFAULT, priorityRank } from './constants/priorities.js'
import TodoForm from './components/TodoForm.jsx'
import TodoList from './components/TodoList.jsx'
import TodoFilters from './components/TodoFilters.jsx'

const STORAGE_KEY = 'todos'

export default function App() {
  const [todos, setTodos] = useLocalStorage(STORAGE_KEY, [])
  const [filter, setFilter] = useState('all')

  function addTodo(text, priority = PRIORITY_DEFAULT) {
    setTodos((current) => [
      ...current,
      { id: gerarId(), text, done: false, priority },
    ])
  }

  function toggleTodo(id) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    )
  }

  function editTodo(id, text) {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
    )
  }

  function changePriority(id, priority) {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, priority } : todo)),
    )
  }

  function removeTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  function clearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.done))
  }

  const visibleTodos = useMemo(() => {
    const filtered =
      filter === 'active'
        ? todos.filter((todo) => !todo.done)
        : filter === 'done'
          ? todos.filter((todo) => todo.done)
          : todos

    // Ordena por prioridade. O sort do JS é estável, então tarefas de
    // mesma prioridade mantêm a ordem em que foram criadas.
    return [...filtered].sort(
      (a, b) => priorityRank(a.priority) - priorityRank(b.priority),
    )
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
        onEdit={editTodo}
        onChangePriority={changePriority}
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
