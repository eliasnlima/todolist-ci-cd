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

  it('edita o texto de uma tarefa', async () => {
    const user = userEvent.setup()
    render(<App />)

    await adicionarTarefa(user, 'Comprar pao')
    await user.click(screen.getByRole('button', { name: 'Editar Comprar pao' }))

    const campo = screen.getByLabelText('Editar tarefa')
    await user.clear(campo)
    await user.type(campo, 'Comprar pão integral')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByText('Comprar pão integral')).toBeInTheDocument()
    expect(screen.queryByText('Comprar pao')).not.toBeInTheDocument()
  })

  it('salva a edição com Enter', async () => {
    const user = userEvent.setup()
    render(<App />)

    await adicionarTarefa(user, 'Versao antiga')
    await user.click(screen.getByRole('button', { name: 'Editar Versao antiga' }))

    const campo = screen.getByLabelText('Editar tarefa')
    await user.clear(campo)
    await user.type(campo, 'Versao nova{Enter}')

    expect(screen.getByText('Versao nova')).toBeInTheDocument()
  })

  it('cancela a edição sem alterar a tarefa', async () => {
    const user = userEvent.setup()
    render(<App />)

    await adicionarTarefa(user, 'Texto original')
    await user.click(screen.getByRole('button', { name: 'Editar Texto original' }))

    const campo = screen.getByLabelText('Editar tarefa')
    await user.clear(campo)
    await user.type(campo, 'Texto descartado')
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByText('Texto original')).toBeInTheDocument()
    expect(screen.queryByText('Texto descartado')).not.toBeInTheDocument()
  })

  it('cancela a edição com Escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    await adicionarTarefa(user, 'Continua igual')
    await user.click(screen.getByRole('button', { name: 'Editar Continua igual' }))

    await user.type(screen.getByLabelText('Editar tarefa'), '{Escape}')

    expect(screen.getByText('Continua igual')).toBeInTheDocument()
  })

  it('não permite salvar uma tarefa em branco', async () => {
    const user = userEvent.setup()
    render(<App />)

    await adicionarTarefa(user, 'Nao pode sumir')
    await user.click(screen.getByRole('button', { name: 'Editar Nao pode sumir' }))

    await user.clear(screen.getByLabelText('Editar tarefa'))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByText('Nao pode sumir')).toBeInTheDocument()
  })

  it('mantém a edição depois de recarregar a página', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await adicionarTarefa(user, 'Antes')
    await user.click(screen.getByRole('button', { name: 'Editar Antes' }))
    const campo = screen.getByLabelText('Editar tarefa')
    await user.clear(campo)
    await user.type(campo, 'Depois{Enter}')
    unmount()

    render(<App />)
    expect(screen.getByText('Depois')).toBeInTheDocument()
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
