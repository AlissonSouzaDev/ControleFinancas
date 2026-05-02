# Controle de Finanças

Aplicativo desktop de controle financeiro pessoal construído com Tauri v2 + React + TypeScript. Permite gerenciar pagamentos e recebimentos mensais, além de planejar projetos e objetivos futuros — tudo armazenado localmente via SQLite.

## Funcionalidades

### Orçamento Mensal
- Cadastro de registros financeiros separados por **A Pagar** e **A Receber**
- Navegação por período (mês/ano)
- Cards de resumo com total de saídas, entradas e diferença
- Controle de **status de pagamento** (Pendente, Pago Parcialmente, Quitado)
- Campo de **valor realizado** para acompanhamento do que foi efetivamente pago/recebido
- Marcação de **prioridade** por registro
- Campo de **observação** por registro
- Deleção individual ou de todos os registros do mês

### Projetos Futuros
- Cadastro de ideias e objetivos financeiros futuros
- Status de andamento: Ideia, Planejando, Em Andamento, Concluído
- Campos opcionais de período, duração estimada e valor de investimento

### Geral
- Tema **dark/light** com persistência em `localStorage`
- Interface totalmente em português
- Dados armazenados localmente — sem dependência de internet ou servidor externo

## Stack

| Camada | Tecnologia |
|---|---|
| Interface | React 19 + TypeScript |
| Estilo | Tailwind CSS 3 |
| Desktop | Tauri v2 |
| Backend | Rust |
| Banco de dados | SQLite (via rusqlite) |
| Formulários | react-hook-form + Zod |
| Roteamento | react-router-dom |
| Build | Vite |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install) (stable)
- [Tauri CLI v2](https://tauri.app/start/prerequisites/)

## Instalação e Uso

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run tauri dev

# Gerar build de produção
npm run tauri build
```

## Banco de Dados

O banco SQLite é criado automaticamente na primeira execução e fica armazenado em:

```
Windows: C:\Users\<usuário>\AppData\Local\controlefinancas\db.sqlite3
```

As migrações de schema são aplicadas automaticamente e de forma condicional a cada inicialização, preservando os dados existentes.

## Estrutura do Projeto

```
├── src/                        # Frontend React
│   ├── components/             # Componentes reutilizáveis e de UI
│   ├── pages/                  # Páginas da aplicação
│   ├── schemas/                # Schemas de validação Zod
│   ├── types/                  # Interfaces e tipos TypeScript
│   └── utils/                  # Funções utilitárias
├── src-tauri/                  # Backend Rust + configuração Tauri
│   └── src/
│       ├── orcamento_mensal/   # Commands e model do orçamento mensal
│       ├── planos_futuros/     # Commands e model dos projetos futuros
│       └── migrations.rs       # Migrações do banco de dados
└── public/
    └── icons/                  # Ícones SVG da interface
```

## Licença

Uso pessoal.
