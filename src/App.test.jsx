import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

async function adicionarTarefa(user, texto) {
  await user.type(screen.getByLabelText('Nova tarefa'), texto)
  await user.click(screen.getByRole('button', { name: 'Adicionar' }))
}

describe('App', () => {
  it('mostra o estado vazio no primeiro acesso', () => {
    render(<App />)
    expect(screen.getByText('Nada por aqui.')).toBeInTheDocument()
  })

  it('adiciona uma tarefa e limpa o campo', async () => {
    const user = userEvent.setup()
    render(<App />)

    await adicionarTarefa(user, 'Estudar Docker')

    expect(screen.getByText('Estudar Docker')).toBeInTheDocument()
    expect(screen.getByLabelText('Nova tarefa')).toHaveValue('')
    expect(screen.getByText('1 tarefa pendente')).toBeInTheDocument()
  })

  it('ignora tarefa em branco', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(screen.getByText('Nada por aqui.')).toBeInTheDocument()
  })

  it('marca uma tarefa como concluída', async () => {
    const user = userEvent.setup()
    render(<App />)

    await adicionarTarefa(user, 'Configurar CI')
    await user.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(screen.getByText('0 tarefas pendentes')).toBeInTheDocument()
  })

  it('remove uma tarefa', async () => {
    const user = userEvent.setup()
    render(<App />)

    await adicionarTarefa(user, 'Tarefa descartável')
    await user.click(screen.getByRole('button', { name: 'Remover Tarefa descartável' }))

    expect(screen.queryByText('Tarefa descartável')).not.toBeInTheDocument()
  })

  it('filtra entre pendentes e concluídas', async () => {
    const user = userEvent.setup()
    render(<App />)

    await adicionarTarefa(user, 'Pendente')
    await adicionarTarefa(user, 'Concluída')
    await user.click(screen.getByRole('checkbox', { name: /Concluída/ }))

    await user.click(screen.getByRole('button', { name: 'Pendentes' }))
    expect(screen.getByText('Pendente')).toBeInTheDocument()
    expect(screen.queryByText('Concluída')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Concluídas' }))
    expect(screen.getByText('Concluída')).toBeInTheDocument()
    expect(screen.queryByText('Pendente')).not.toBeInTheDocument()
  })

  it('limpa as tarefas concluídas', async () => {
    const user = userEvent.setup()
    render(<App />)

    await adicionarTarefa(user, 'Fica')
    await adicionarTarefa(user, 'Sai')
    await user.click(screen.getByRole('checkbox', { name: /Sai/ }))
    await user.click(screen.getByRole('button', { name: 'Limpar concluídas' }))

    expect(screen.getByText('Fica')).toBeInTheDocument()
    expect(screen.queryByText('Sai')).not.toBeInTheDocument()
  })

  it('mantém as tarefas depois de recarregar a página', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await adicionarTarefa(user, 'Sobrevive ao reload')
    unmount()

    render(<App />)
    expect(screen.getByText('Sobrevive ao reload')).toBeInTheDocument()
  })
})
