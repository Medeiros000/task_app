# Task Manager - Frontend

[Frontend app url](https://front-task-api.vercel.app/) - [https://front-task-api.vercel.app/](https://front-task-api.vercel.app/)

[Backend Project URL](https://github.com/Medeiros000/task_api) - [https://github.com/Medeiros000/task_api](https://github.com/Medeiros000/task_api)

Aplicação web moderna para gerenciamento de tarefas. Uma interface intuitiva e responsiva construída com React, permitindo aos usuários criar, visualizar, atualizar e gerenciar suas tarefas de forma eficiente.

## 🎯 Features

- ✅ **Autenticação de Usuários** - Sign in e sign out com JWT
- 📝 **Gerenciamento de Tarefas** - Criar, ler, atualizar e deletar tarefas
- 🔍 **Visualização Detalhada** - Informações completas de cada tarefa
- 👤 **Perfil do Autor** - Veja quem criou cada tarefa
- ✨ **Interface Moderna** - Design responsivo e intuitivo
- 🌙 **Dark Mode** - Suporte para tema escuro
- 📱 **Mobile Friendly** - Totalmente responsivo

## 🛠️ Tecnologias Utilizadas

- **React** 19.2.6 - Library UI
- **Vite** 8.0.12 - Build tool e dev server
- **React Router DOM** 7.15.0 - Roteamento
- **Axios** 1.16.0 - HTTP client
- **JWT Decode** 4.0.0 - Decodificação de tokens
- **ESLint** - Code linting

## 📁 Estrutura do Projeto

```
src/
├── api/
│   ├── authService.ts          # Serviços de autenticação
│   ├── taskService.ts          # Serviços de tarefas
│   ├── axios.ts                # Configuração do Axios
│   └── ...
├── components/
│   ├── NavBar.jsx              # Barra de navegação
│   ├── TaskNavBar.jsx          # Navegação de tarefas
│   └── ...
├── pages/
│   ├── Home.jsx                # Página inicial
│   ├── SignIn.jsx              # Página de login
│   ├── tasks/
│   │   ├── Tasks.jsx           # Container de tarefas
│   │   ├── TaskList.jsx        # Lista de tarefas
│   │   ├── TaskDetails.jsx     # Detalhes da tarefa
│   │   ├── TaskInfo.jsx        # Informações da tarefa
│   │   └── TaskForm.jsx        # Formulário de tarefa
│   └── ...
├── types/
│   └── class.ts                # Tipos TypeScript
├── App.jsx                     # Componente raiz
├── App.css                     # Estilos globais
├── main.jsx                    # Entry point
└── index.css                   # Estilos base
```

## 🚀 Como Começar

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd react_front_api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e configure a URL da sua API:
```env
# Para desenvolvimento local
VITE_API_URL=http://localhost:3000/api

# Para produção no Vercel/outro host
VITE_API_URL=https://seu-backend-api.com/api
```

**Nota:** O arquivo `.env.local` é ignorado pelo git e não será commitado. Use `.env.example` como referência.

**ℹ️ Para mais detalhes sobre configuração da API, veja:** [API_SETUP.md](API_SETUP.md)

### Executar em Desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento será iniciado em `http://localhost:5173`

### Executar Desenvolvimento com Docker

Para montar a pasta atual no container e refletir alterações automaticamente:

From the project root (`task_app/`), run:

```bash
docker compose up -d --build
```

Abra `http://localhost:8080`. A API fica disponível em `http://localhost:3000` e o PostgreSQL em `localhost:5432`. O serviço usa o estágio `development` do [Dockerfile](Dockerfile), monta o projeto em `/app` e mantém `node_modules` dentro do container.

Para encerrar:

```bash
docker compose down
```

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

### Preview da Build

```bash
npm run preview
```

### Executar a Imagem de Produção

```bash
docker build -t front-task-api .
docker run --rm -p 8080:80 front-task-api
```

Abra `http://localhost:8080`.

## 📚 Rotas da Aplicação

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/sign-in` | Página de login |
| `/tasks` | Lista de tarefas |
| `/tasks/new` | Criar nova tarefa |
| `/tasks/:id/info` | Informações da tarefa |
| `/tasks/:id/update` | Editar tarefa |

## 🔐 Autenticação

A autenticação é feita via JWT (JSON Web Token):

- Token é armazenado em `localStorage`
- Token é validado automaticamente
- Token expirado é removido automaticamente
- É necessário estar autenticado para gerenciar tarefas

```javascript
// Exemplo de login
import { signIn } from './api/authService';

const handleLogin = async (email, password) => {
  try {
    const token = await signIn(email, password);
    localStorage.setItem('token', token);
    setToken(token);
  } catch (error) {
    console.error('Erro de login:', error);
  }
};
```

## 📡 API Integration

O projeto se integra com uma API backend. Os serviços estão em `src/api/`:

### Task Service
```javascript
import { taskService } from './api/taskService';

// Obter todas as tarefas
const tasks = await taskService.getAll();

// Obter tarefa por ID
const task = await taskService.getById(id);

// Criar tarefa
await taskService.create(taskData);

// Atualizar tarefa
await taskService.update(id, taskData);

// Deletar tarefa
await taskService.delete(id);
```

### Auth Service
```javascript
import { signIn, signUp, isTokenExpired } from './api/authService';

// Login
const token = await signIn(email, password);

// Registro
const user = await signUp(name, email, password);

// Validar token
const expired = isTokenExpired(token);
```

## 🎨 Styling

O projeto utiliza CSS customizado com:

- Variáveis CSS para cores e tipografia
- Design system consistente
- Temas light/dark automáticos
- Responsive design mobile-first
- Animações suaves

Principais cores:
- Primary: `#aa3bff` (Roxo)
- Background: `#ffffff` (Light) / `#16171d` (Dark)

## 🧩 Componentes Principais

### NavBar
Navegação principal com links para Home, Tasks e Sign In/Out.

### TaskList
Exibe todas as tarefas em cards com:
- Título e descrição
- Status (Completed/Pending)
- Autor da tarefa

### TaskDetails
Container para detalhes completos da tarefa com:
- Botões de navegação (Info, Update, Delete)
- Outlet para renderizar rotas aninhadas

### TaskForm
Formulário para criar/editar tarefas com:
- Campos: Título, Descrição, Status
- Validação de campos
- Submit automático

### TaskInfo
Exibição das informações da tarefa:
- Título, descrição e status
- Nome do autor

## 🔄 Fluxo de Dados

```
App.jsx (Estado de autenticação)
  ├── NavBar (Exibe perfil do usuário)
  ├── Routes
  │   ├── Home
  │   ├── SignIn
  │   └── Tasks (Estado de tarefas)
  │       ├── TaskList (Renderiza tarefas)
  │       ├── TaskForm (Cria/Edita)
  │       └── TaskDetails (Detalhes)
  │           ├── TaskInfo
  │           └── TaskForm (Nested)
```

## 📝 Notas de Desenvolvimento

- O projeto usa Vite para build rápido
- React Router v7 para roteamento
- Axios com interceptadores para autenticação
- State management com hooks (useState, useEffect)
- Context API para compartilhar dados entre rotas

## 🐛 Troubleshooting (Problemas Comuns)

### ❌ Erro: "Cannot find module 'src/middlewares/auth'"
Este erro é do **backend**, não do frontend. Certifique-se de que o backend está rodando corretamente.

### ❌ Erro: "Request failed with status code 404" no Sign In
**Causa:** A URL da API está incorreta ou o backend não responde.

**Solução:**
1. Verifique se o arquivo `.env.local` existe e contém a URL correta:
```bash
VITE_API_URL=http://localhost:3000/api
```

2. Certifique-se que o backend está rodando:
```bash
# No diretório do backend
npm run dev
```

3. Teste a URL manualmente:
```bash
curl http://localhost:3000/api/sign-in
```

### ❌ Erro: "No token provided. Cannot fetch tasks"
**Causa:** Você não está autenticado.

**Solução:**
1. Faça login usando credenciais válidas
2. O token será automaticamente armazenado em `localStorage`

### ❌ Tarefas não carregam
**Causa:** Backend não está disponível ou token expirou.

**Solução:**
1. Verifique se o backend está rodando
2. Faça login novamente
3. Verifique o console do navegador para mensagens de erro detalhadas

### ❌ Erro CORS
**Causa:** O backend não está configurado para aceitar requisições do frontend.

**Solução:**
Configure CORS no backend:
```javascript
// No backend (Express)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## 🤝 Contribuindo

Para contribuir:

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Commit suas mudanças: `git commit -m 'Add sua feature'`
3. Push para a branch: `git push origin feature/sua-feature`
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ por [jrmedeiros.dev@gmail.com](mailto:jrmedeiros.dev@gmail.com)

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
