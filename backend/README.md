# Task API

Backend REST API for authentication and task management. It uses Express, TypeScript, Prisma and PostgreSQL.

## Run With Docker

From the project root:

```bash
docker compose up -d --build
```

The Compose setup starts PostgreSQL, applies migrations, seeds the test data and starts the API at `http://localhost:3000`. The frontend is available at `http://localhost:8080`.

The development seed creates the mock account `jr@example.com` with password `password123`. It preserves an existing user and does not duplicate sample tasks.

## Run Locally

From `backend/`:

```bash
npm ci
```

Set the following variables in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_db
JWT_SECRET=development-secret
```

Then apply the database setup and start the API:

```bash
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

The API runs at `http://localhost:3000`.

## API Routes

Public routes:

- `GET /`
- `POST /api/sign-up` with `{ name, email, password }`
- `POST /api/sign-in` with `{ email, password }`

Protected routes require `Authorization: Bearer <token>`:

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

The sign-in response contains `{ "token": "..." }`. Tokens expire after one hour.
