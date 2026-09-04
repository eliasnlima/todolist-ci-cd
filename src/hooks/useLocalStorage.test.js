import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage.js'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('usa o valor inicial quando não há nada salvo', () => {
    const { result } = renderHook(() => useLocalStorage('todos', []))
    expect(result.current[0]).toEqual([])
  })

  it('grava no localStorage quando o valor muda', () => {
    const { result } = renderHook(() => useLocalStorage('todos', []))

    act(() => {
      result.current[1]([{ id: '1', text: 'Comprar pão', done: false }])
    })

    expect(JSON.parse(window.localStorage.getItem('todos'))).toEqual([
      { id: '1', text: 'Comprar pão', done: false },
    ])
  })

  it('lê o valor já existente no localStorage', () => {
    window.localStorage.setItem('todos', JSON.stringify([{ id: '9', text: 'Antigo', done: true }]))

    const { result } = renderHook(() => useLocalStorage('todos', []))

    expect(result.current[0]).toEqual([{ id: '9', text: 'Antigo', done: true }])
  })

  it('cai no valor inicial quando o conteúdo salvo está corrompido', () => {
    window.localStorage.setItem('todos', 'isso não é json')

    const { result } = renderHook(() => useLocalStorage('todos', []))

    expect(result.current[0]).toEqual([])
  })
})
