import { describe, it, expect, afterEach, vi } from 'vitest'
import { gerarId } from './id.js'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('gerarId', () => {
  it('usa crypto.randomUUID quando disponível', () => {
    expect(gerarId()).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('funciona sem crypto.randomUUID (acesso por IP, sem HTTPS)', () => {
    vi.stubGlobal('crypto', { getRandomValues: globalThis.crypto.getRandomValues.bind(globalThis.crypto) })

    const id = gerarId()

    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('funciona mesmo sem nenhuma API de crypto', () => {
    vi.stubGlobal('crypto', undefined)

    const id = gerarId()

    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('nunca repete o mesmo id', () => {
    const ids = new Set(Array.from({ length: 500 }, () => gerarId()))
    expect(ids.size).toBe(500)
  })
})
