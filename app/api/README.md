# API Routes

Esta pasta contém as rotas da API do sistema de Gestão Financeira. As rotas são organizadas por recurso e seguem as convenções RESTful.

## Estrutura

- `_lib/` - Utilitários e funções compartilhadas
- `transactions/` - Gerenciamento de transações financeiras
- `profile/` - Gerenciamento de perfil do usuário
- `categories/` - Gerenciamento de categorias de transações

## Rotas Disponíveis

### Transações

- `GET /api/transactions` - Lista todas as transações do usuário
  - Parâmetros opcionais:
    - `limit` - Limite de transações retornadas (padrão: 10)

- `POST /api/transactions` - Cria uma nova transação
  - Corpo da requisição (JSON):
    ```json
    {
      "amount": 100.50,
      "description": "Compra no mercado",
      "type": "expense",
      "category": "alimentacao",
      "date": "2023-10-01T12:00:00.000Z"
    }
    ```

### Perfil

- `GET /api/profile` - Retorna os dados do perfil do usuário

- `PATCH /api/profile` - Atualiza os dados do perfil
  - Corpo da requisição (JSON):
    ```json
    {
      "full_name": "Nome do Usuário",
      "avatar_url": "https://...",
      "currency": "BRL"
    }
    ```

### Categorias

- `GET /api/categories` - Lista todas as categorias do usuário

- `POST /api/categories` - Cria uma nova categoria
  - Corpo da requisição (JSON):
    ```json
    {
      "name": "Alimentação",
      "type": "expense",
      "color": "#FF5733",
      "icon": "utensils"
    }
    ```

## Autenticação

Todas as rotas (exceto OPTIONS) requerem autenticação via token JWT no header `Authorization`.

## CORS

A API está configurada para aceitar requisições de qualquer origem (`*`). Em produção, recomenda-se restringir as origens permitidas.

## Tratamento de Erros

A API retorna códigos de status HTTP apropriados e mensagens de erro em formato JSON quando algo dá errado.

Exemplo de resposta de erro:
```json
{
  "error": "Mensagem de erro descritiva"
}
```

## Próximos Passos

1. Implementar validação de entrada mais robusta
2. Adicionar paginação nas listagens
3. Implementar filtros avançados
4. Adicionar documentação com Swagger/OpenAPI
