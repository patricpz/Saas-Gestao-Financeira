# Configuração do Supabase

Este guia te ajudará a configurar o Supabase com o Prisma no seu projeto.

## 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização
5. Preencha os dados do projeto:
   - Nome: `saas-gestao-financeira`
   - Senha do banco: (escolha uma senha forte)
   - Região: escolha a mais próxima do Brasil
6. Clique em "Create new project"

## 2. Configurar variáveis de ambiente

1. Copie o arquivo `env.example` para `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. No painel do Supabase, vá em Settings > API
3. Copie as seguintes informações:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

4. Para a `DATABASE_URL`:
   - Vá em Settings > Database
   - Copie a "Connection string" e substitua `[YOUR-PASSWORD]` pela senha que você definiu

## 3. Configurar o banco de dados

1. Execute o comando para gerar o cliente Prisma:
   ```bash
   npm run db:generate
   ```

2. Faça push do schema para o Supabase:
   ```bash
   npm run db:push
   ```

3. (Opcional) Execute o seed para dados iniciais:
   ```bash
   npm run db:seed
   ```

## 4. Verificar a configuração

1. Inicie o Prisma Studio para visualizar os dados:
   ```bash
   npm run db:studio
   ```

2. Teste a conexão executando o projeto:
   ```bash
   npm run dev
   ```

## Scripts disponíveis

- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:push` - Sincroniza o schema com o banco
- `npm run db:migrate` - Cria e aplica migrações
- `npm run db:studio` - Abre o Prisma Studio
- `npm run db:seed` - Executa o seed do banco

## Estrutura do banco

O projeto inclui os seguintes modelos:

- **User**: Usuários do sistema
- **Account**: Contas OAuth (NextAuth)
- **Session**: Sessões de usuário
- **Transaction**: Transações financeiras
- **Category**: Categorias de receitas e despesas

## Próximos passos

1. Configure a autenticação com NextAuth
2. Implemente as funcionalidades de CRUD
3. Configure as políticas RLS (Row Level Security) no Supabase
