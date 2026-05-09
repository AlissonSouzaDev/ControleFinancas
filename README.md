# Controle de Finanças

Aplicativo desktop de controle financeiro pessoal construído com Tauri v2 + React + TypeScript. Permite gerenciar pagamentos e recebimentos mensais, além de planejar projetos e objetivos futuros — com dados armazenados no Supabase (PostgreSQL na nuvem).

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

## Stack

| Camada | Tecnologia |
|---|---|
| Interface | React 19 + TypeScript |
| Estilo | Tailwind CSS 3 |
| Desktop | Tauri v2 |
| Banco de dados | Supabase (PostgreSQL) |
| Cliente DB | @supabase/supabase-js |
| Formulários | react-hook-form + Zod |
| Roteamento | react-router-dom |
| Build | Vite |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install) (stable)
- [Tauri CLI v2](https://tauri.app/start/prerequisites/)
- Projeto no [Supabase](https://supabase.com/) com as tabelas criadas

## Instalação e Uso

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Crie um arquivo .env na raiz com:
# VITE_SUPABASE_URL=https://<projeto>.supabase.co
# VITE_SUPABASE_ANON_KEY=<anon-key>

# Rodar em modo desenvolvimento
npm run tauri dev

# Gerar build de produção
npm run tauri build
```

## Estrutura do Projeto

```
├── src/                        # Frontend React
│   ├── components/             # Componentes reutilizáveis e de UI
│   ├── lib/                    # Cliente Supabase
│   ├── pages/                  # Páginas da aplicação
│   ├── schemas/                # Schemas de validação Zod
│   ├── types/                  # Interfaces e tipos TypeScript
│   └── utils/                  # Funções utilitárias
├── src-tauri/                  # Shell desktop Tauri (Rust)
└── public/
    └── icons/                  # Ícones SVG da interface
```

## Licença

Uso pessoal.
