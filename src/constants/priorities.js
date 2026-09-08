export const PRIORITY_DEFAULT = 'media'

export const PRIORITIES = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
]

// Peso usado para ordenar a lista: quanto menor, mais no topo.
const ORDER = { alta: 0, media: 1, baixa: 2 }

// Tarefas criadas antes desta feature não têm o campo "priority",
// e valores desconhecidos não podem derrubar a ordenação.
export function priorityRank(priority) {
  return ORDER[priority] ?? ORDER[PRIORITY_DEFAULT]
}

export function priorityLabel(priority) {
  const found = PRIORITIES.find((item) => item.value === priority)
  return (found ?? PRIORITIES.find((item) => item.value === PRIORITY_DEFAULT)).label
}
