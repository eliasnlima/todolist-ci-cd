// crypto.randomUUID() só existe em contexto seguro (HTTPS ou localhost).
// Acessando por IP da rede — como acontece nos containers do Portainer —
// a função não está disponível, então precisamos de alternativas.
export function gerarId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  }

  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`
}
