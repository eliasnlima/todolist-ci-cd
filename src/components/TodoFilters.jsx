const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Pendentes' },
  { value: 'done', label: 'Concluídas' },
]

export default function TodoFilters({ current, onChange }) {
  return (
    <div className="filters">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={current === filter.value ? 'active' : ''}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
