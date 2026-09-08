import { describe, it, expect } from 'vitest'
import {
  PRIORITIES,
  PRIORITY_DEFAULT,
  priorityRank,
  priorityLabel,
} from './priorities.js'

describe('priorityRank', () => {
  it('coloca alta antes de média, e média antes de baixa', () => {
    expect(priorityRank('alta')).toBeLessThan(priorityRank('media'))
    expect(priorityRank('media')).toBeLessThan(priorityRank('baixa'))
  })

  it('trata tarefa antiga sem prioridade como média', () => {
    expect(priorityRank(undefined)).toBe(priorityRank(PRIORITY_DEFAULT))
  })

  it('trata valor desconhecido como média', () => {
    expect(priorityRank('urgentissimo')).toBe(priorityRank(PRIORITY_DEFAULT))
  })
})

describe('priorityLabel', () => {
  it('devolve o rótulo de cada prioridade', () => {
    expect(priorityLabel('alta')).toBe('Alta')
    expect(priorityLabel('media')).toBe('Média')
    expect(priorityLabel('baixa')).toBe('Baixa')
  })

  it('cai no rótulo padrão para valor inválido', () => {
    expect(priorityLabel(undefined)).toBe('Média')
  })
})

describe('PRIORITIES', () => {
  it('inclui o valor padrão', () => {
    expect(PRIORITIES.map((p) => p.value)).toContain(PRIORITY_DEFAULT)
  })
})
