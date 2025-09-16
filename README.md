# Sistema de Gestão Financeira Pessoal

Aplicação web para gerenciamento financeiro pessoal com autenticação, dashboard e relatórios.

## 🚀 Funcionalidades

- ✅ Autenticação de usuários
- 📊 Dashboard financeiro com saldo atual
- 💰 CRUD de transações (entradas e saídas)
- 🏷️ Categorias personalizáveis
- 📈 Gráficos de entradas vs saídas
- 📤 Exportação de dados (CSV/Excel)

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 com App Router
- **Estilização**: Tailwind CSS + Shadcn/UI
- **Autenticação**: NextAuth.js
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Gráficos**: Recharts
- **Validação**: Zod + React Hook Form

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- pnpm (recomendado) ou npm/yarn

### Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   pnpm install
   # ou
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/finance_app?schema=public"
   NEXTAUTH_SECRET="seu-segredo-seguro-aqui"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### Configuração do Banco de Dados

1. Crie um banco de dados PostgreSQL chamado `finance_app`
2. Execute as migrações do Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```
3. (Opcional) Popule o banco com dados iniciais:
   ```bash
   npx prisma db seed
   ```

### Executando o Projeto

```bash
# Modo desenvolvimento
pnpm dev
# ou
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Estrutura do Projeto

```
my-app/
├── app/                    # Rotas da aplicação
├── components/             # Componentes reutilizáveis
│   └── ui/                 # Componentes Shadcn/UI
├── lib/                    # Utilitários e configurações
│   └── prisma.ts           # Cliente do Prisma
├── prisma/                 # Schema e migrações do Prisma
│   └── schema.prisma       # Modelos do banco de dados
└── public/                 # Arquivos estáticos
```

## 📦 Dependências Principais

- `next`: Framework React
- `@prisma/client`: ORM para banco de dados
- `@radix-ui/react-*`: Componentes UI acessíveis
- `class-variance-authority`: Gerenciamento de variantes de componentes
- `date-fns`: Manipulação de datas
- `lucide-react`: Ícones
- `next-auth`: Autenticação
- `react-hook-form`: Gerenciamento de formulários
- `recharts`: Gráficos interativos
- `sonner`: Notificações
- `tailwind-merge`: Utilitários para Tailwind CSS
- `zod`: Validação de esquemas

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙌 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.
# Saas-Gestao-Financeira
