# 📋 Guia de Configuração - API

## Visão Geral

O Task Manager precisa de um backend para funcionar. Este guia explica como configurar a integração com a API.

## 🔌 Estrutura de Comunicação

```
Frontend (React - localhost:8080 via Docker ou localhost:5173 localmente)
    ↓
    ↓ HTTP Requests (Axios)
    ↓
Backend API (Node/Express - localhost:3000)
    ↓
    ↓ Database
    ↓
Database (PostgreSQL - localhost:5432)
```

## 🚀 Configuração Local (Desenvolvimento)

### 1. Subir o ambiente com Docker

Na raiz do projeto:

```bash
docker compose up -d --build
```

O Compose inicia o PostgreSQL, aplica as migrations e executa o seed de testes antes de iniciar o backend em `http://localhost:3000`.

### 2. Backend rodando localmente

Se você tem o backend em um projeto separado:

```bash
# No diretório do backend
npm install
npm run dev

# Backend deve rodar em: http://localhost:3000
```

### 3. Configurar URL da API no Frontend

Crie/edite o arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Testar a conexão

No console do navegador (F12):

```javascript
// Testar se a API é acessível
fetch('http://localhost:3000/')
  .then(res => res.text())
  .then(data => console.log('API OK:', data))
  .catch(err => console.error('API erro:', err))
```

## 🌐 Configuração em Produção (Deploy)

### Para Vercel/Heroku/outro host

1. **Backend deve estar publicado em:**
   - Exemplo: `https://my-task-api.vercel.app`

2. **Configurar variável no Vercel:**
   - Vá para Project Settings → Environment Variables
   - Adicione:
     ```
     VITE_API_URL=https://my-task-api.vercel.app/api
     ```

3. **Redeploy:**
   ```bash
   git push origin main
   ```

## 📡 Endpoints esperados da API

Seu backend deve implementar estes endpoints:

### Autenticação

```
POST /api/sign-in
  Body: { email, password }
  Response: { token, user }

POST /api/sign-up
  Body: { name, email, password }
  Response: { token, user }

```

### Tarefas (requer autenticação)

```
GET /api/tasks
  Query: { title? }
  Headers: { Authorization: Bearer <token> }
  Response: Task[]

GET /api/tasks/:id
  Headers: { Authorization: Bearer <token> }
  Response: Task

POST /api/tasks
  Body: { title, description }
  Headers: { Authorization: Bearer <token> }
  Response: Task

PUT /api/tasks/:id
  Body: { title, description, status }
  Headers: { Authorization: Bearer <token> }
  Response: Task

DELETE /api/tasks/:id
  Headers: { Authorization: Bearer <token> }
  Response: { success: true }
```

## 🔐 Estrutura do Token JWT

O token retornado deve conter:

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "iat": 1234567890,
    "exp": 1234571490
  }
}
```

## 🆘 Troubleshooting

### Erro 404 em /api/sign-in

**Possível causa:** Endpoint não existe no backend.

**Verificar:**
```bash
# Teste a URL
curl -X POST http://localhost:3000/api/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123"}'
```

### Erro CORS

**Possível causa:** Backend não permite requisições do frontend.

**Solução no Backend:**
```javascript
// Express
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'https://seu-frontend.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Timeout na requisição

**Possível causa:** Backend não responde rápido ou está desligado.

**Verificar:**
```bash
# Ping no servidor
ping localhost:3000
# ou
curl http://localhost:3000
```

## 📚 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_API_URL` | URL base da API | `http://localhost:3000/api` |

## 🔄 Fluxo de Autenticação

1. Usuário entra email/senha na página de login
2. Frontend envia `POST /api/sign-in`
3. Backend valida e retorna JWT token
4. Frontend armazena token em `localStorage`
5. Frontend adiciona header em todas as requisições: `Authorization: Bearer <token>`
6. Backend valida token antes de processar requisição
7. Se token expirar, frontend remove token e redireciona para login

## 📝 Exemplos de Requisição

### Sign In

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

const response = await api.post('/sign-in', {
  email: 'user@example.com',
  password: 'password123'
});

const token = response.data.token;
localStorage.setItem('token', token);
```

### Buscar Tarefas

```javascript
const response = await api.get('/tasks', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const tasks = response.data;
```

## 🎯 Próximos Passos

1. Verifique se o backend está implementado
2. Configure a URL da API em `.env.local`
3. Teste login e verificação de autenticação
4. Teste operações CRUD de tarefas
5. Configure deploy em produção
