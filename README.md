# Task App

Aplicação web para gerenciamento de tarefas, com autenticação de usuários e operações de criação, consulta, edição e exclusão de tarefas.

## Stack

- **Frontend:** React 19, Vite, React Router e Axios
- **Backend:** Node.js, Express 5 e TypeScript
- **Banco de dados:** PostgreSQL 16
- **ORM:** Prisma 7
- **Autenticação:** JWT
- **Ambiente:** Docker Compose

## Arquitetura

```text
Browser
  |
  | http://localhost:8080
  v
Frontend (Vite + React)
  |
  | http://localhost:3000/api
  v
Backend (Express + Prisma)
  |
  | PostgreSQL
  v
Database (localhost:5432)
```

## Pré-requisitos

- Docker Desktop com Docker Compose
- Git

Node.js e npm só são necessários para executar os serviços diretamente fora do Docker.

## Executar com Docker

Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

Acesse:

- **Aplicação:** http://localhost:8080
- **API:** http://localhost:3000
- **Documentação simples da API:** http://localhost:3000/
- **PostgreSQL:** `localhost:5432`

O Compose inicia automaticamente:

1. PostgreSQL com volume persistente;
2. migrations do Prisma;
3. seed dos dados de teste;
4. backend;
5. frontend em modo de desenvolvimento.

Para acompanhar os logs:

```bash
docker compose logs -f
```

Para parar os containers:

```bash
docker compose down
```

Para remover também os dados persistidos do banco:

```bash
docker compose down -v
```

## Usuário de teste

O seed cria o usuário mockado usado pelo frontend:

```text
Email: jr@example.com
Senha: password123
```

O seed verifica se o usuário já existe e não duplica a conta nem as tarefas de exemplo.

## API principal

### Autenticação

```text
POST /api/sign-up
POST /api/sign-in
```

O login retorna um token JWT:

```json
{
  "token": "..."
}
```

### Tarefas

As rotas de tarefas exigem o header `Authorization: Bearer <token>`:

```text
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Exemplo de login:

```bash
curl -X POST http://localhost:3000/api/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"jr@example.com","password":"password123"}'
```

## Variáveis de ambiente

O Compose possui valores padrão para desenvolvimento:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/task_db
JWT_SECRET=development-secret
```

Para sobrescrevê-los, crie um arquivo `.env` na raiz:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
JWT_SECRET=uma-chave-secreta
```

Arquivos `.env` não devem ser versionados.

## Estrutura do projeto

```text
task_app/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── middlewares/
│   │   └── index.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   └── pages/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Executar sem Docker

### Backend

Com PostgreSQL disponível em `localhost:5432`:

```bash
cd backend
npm ci
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm ci
npm run dev
```

Nesse modo, o frontend será servido por padrão em http://localhost:5173. Consulte também [`frontend/API_SETUP.md`](frontend/API_SETUP.md) e [`backend/DOCUMENTATION.md`](backend/DOCUMENTATION.md).

