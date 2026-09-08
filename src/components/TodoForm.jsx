import { useState } from 'react'
import { PRIORITIES, PRIORITY_DEFAULT } from '../constants/priorities.js'

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState(PRIORITY_DEFAULT)

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, priority)
    setText('')
    setPriority(PRIORITY_DEFAULT)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="O que precisa ser feito?"
        aria-label="Nova tarefa"
      />
      <select
        className="priority-select"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
        aria-label="Prioridade da nova tarefa"
      >
        {PRIORITIES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <button type="submit">Adicionar</button>
    </form>
  )
}
