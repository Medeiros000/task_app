# Task API - Complete Documentation

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [API Routes](#api-routes)
- [Authentication](#authentication)
- [Code Patterns & Conventions](#code-patterns--conventions)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Error Handling](#error-handling)

---

## Project Overview

This is a **REST API built with Express.js, TypeScript, and Prisma ORM** for managing tasks with user authentication. The API provides endpoints for user sign-up, sign-in, and complete task management (CRUD operations).

**Tech Stack:**
- **Framework:** Express 5.1.0
- **Language:** TypeScript 5.8.2
- **ORM:** Prisma 7.8.0
- **Database:** PostgreSQL (via Prisma Adapter)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs 3.0.3
- **Runtime:** tsx 4.21.0

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database

### Installation Steps

1. **Clone/Navigate to the project:**
   ```bash
  cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/task_db"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   ```

4. **Setup the database (if needed):**
   ```bash
   npx prisma migrate deploy
   ```

5. **Seed the database:**
   ```bash
   npx prisma db seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start at **http://localhost:3000**

---

## ⚠️ Route Protection & Bearer Token

### Important: Protected Routes Require Authentication

Most API routes require **Bearer Token authentication**. Here's what you need to know:

### Which Routes Need Bearer Token?

| Route | Method | Needs Token? |
|-------|--------|-------------|
| `/api/sign-up` | POST | ❌ No |
| `/api/sign-in` | POST | ❌ No |
| `/` | GET | ❌ No |
| `/api/tasks` | POST | ✅ **Yes** |
| `/api/tasks` | GET | ✅ **Yes** |
| `/api/tasks/:id` | GET | ✅ **Yes** |
| `/api/tasks/:id` | PUT | ✅ **Yes** |
| `/api/tasks/:id` | DELETE | ✅ **Yes** |

### How to Use Bearer Token

1. **Get a token:** First, sign in to receive a JWT token
   ```bash
   curl -X POST http://localhost:3000/api/sign-in \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password123"}'
   ```
   Response:
   ```json
   {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

2. **Include token in Authorization header:** Add `Authorization: Bearer <token>` to all protected requests
   ```bash
   curl -X GET http://localhost:3000/api/tasks \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

3. **Common mistakes:**
   - ❌ Missing the `Authorization` header entirely
   - ❌ Using `Token` instead of `Bearer`
   - ❌ Forgetting the space between `Bearer` and the token
   - ❌ Using an expired token (expires after 1 hour)

### Error Responses for Missing/Invalid Tokens

If you forget the token or it's invalid, you'll get **401 Unauthorized**:

```json
{
  "error": "Access denied. Token not provided."
}
```

Or if the format is wrong:

```json
{
  "error": "Malformatted token."
}
```

Or if the token is expired:

```json
{
  "error": "Token invalid or expired."
}
```

---

## API Routes

### Authentication Routes

#### 1. **Sign Up** (User Registration)

- **Endpoint:** `POST /api/sign-up`
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response:** (201 Created)
  ```json
  {
    "user created"
  }
  ```
- **Example with cURL:**
  ```bash
  curl -X POST http://localhost:3000/api/sign-up \
    -H "Content-Type: application/json" \
    -d '{"name":"John Doe","email":"john@example.com","password":"securePassword123"}'
  ```

---

#### 2. **Sign In** (User Login)

- **Endpoint:** `POST /api/sign-in`
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response:** (200 OK)
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses:**
  - **401 Unauthorized:** `{ "error": "Invalid email or password" }`
- **Example with cURL:**
  ```bash
  curl -X POST http://localhost:3000/api/sign-in \
    -H "Content-Type: application/json" \
    -d '{"email":"john@example.com","password":"securePassword123"}'
  ```

---

### Task Management Routes

#### 3. **Get Welcome Page**

- **Endpoint:** `GET /`
- **Authentication:** Not required
- **Response:** HTML page with welcome message
- **Example:**
  ```bash
  curl http://localhost:3000/
  ```

---

#### 4. **Create a Task**

- **Endpoint:** `POST /api/tasks`
- **Authentication:** Required (Bearer Token)
- **Request Headers:**
  ```
  Authorization: Bearer <jwt_token>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": false
  }
  ```
- **Success Response:** (200 OK)
  ```json
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": false,
    "authorId": 1,
    "created_at": "2026-05-12T10:30:00Z",
    "updated_at": "2026-05-12T10:30:00Z"
  }
  ```
- **Error Responses:**
  - **401 Unauthorized:** `{ "error": "Acesso negado. Token não fornecido." }`
  - **401 Unauthorized:** `{ "error": "Token malformatado." }`
  - **401 Unauthorized:** `{ "error": "Token inválido ou expirado." }`
- **Example with cURL:**
  ```bash
  curl -X POST http://localhost:3000/api/tasks \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"My Task","description":"Task description","status":false}'
  ```

---

#### 5. **Get All Tasks**

- **Endpoint:** `GET /api/tasks`
- **Authentication:** Required (Bearer Token)
- **Request Headers:**
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Query Parameters (Optional):**
  - `title` - Filter tasks by title (case-insensitive, partial match)
  - `status` - Filter by status (`"true"` or `"false"`)
  - `authorId` - Filter by author ID
- **Success Response:** (200 OK)
  ```json
  [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": false,
      "authorId": 1,
      "created_at": "2026-05-12T10:30:00Z",
      "updated_at": "2026-05-12T10:30:00Z"
    }
  ]
  ```
- **Example with cURL:**
  ```bash
  # Get all tasks
  curl http://localhost:3000/api/tasks \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  
  # Filter by title
  curl "http://localhost:3000/api/tasks?title=documentation" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  
  # Filter by status
  curl "http://localhost:3000/api/tasks?status=true" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```

---

#### 6. **Get Task by ID**

- **Endpoint:** `GET /api/tasks/:id`
- **Authentication:** Required (Bearer Token)
- **Request Headers:**
  ```
  Authorization: Bearer <jwt_token>
  ```
- **URL Parameters:**
  - `id` - Task ID (integer)
- **Success Response:** (200 OK)
  ```json
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": false,
    "authorId": 1,
    "created_at": "2026-05-12T10:30:00Z",
    "updated_at": "2026-05-12T10:30:00Z"
  }
  ```
- **Error Response:** (404 Not Found)
  ```json
  { "error": "Task with ID 999 not found" }
  ```
- **Example with cURL:**
  ```bash
  curl http://localhost:3000/api/tasks/1 \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```

---

#### 7. **Update a Task**

- **Endpoint:** `PUT /api/tasks/:id`
- **Authentication:** Required (Bearer Token)
- **Authorization:** Only the task author can update it
- **Request Headers:**
  ```
  Authorization: Bearer <jwt_token>
  Content-Type: application/json
  ```
- **URL Parameters:**
  - `id` - Task ID (integer)
- **Request Body (all fields optional):**
  ```json
  {
    "title": "Updated task title",
    "description": "Updated description",
    "status": true
  }
  ```
- **Success Response:** (200 OK)
  ```json
  {
    "id": 1,
    "title": "Updated task title",
    "description": "Updated description",
    "status": true,
    "authorId": 1,
    "created_at": "2026-05-12T10:30:00Z",
    "updated_at": "2026-05-12T11:45:00Z"
  }
  ```
- **Error Responses:**
  - **404 Not Found:** `{ "error": "Task with ID 999 not found" }`
  - **403 Forbidden:** `{ "error": "You can only update your own tasks" }`
  - **500 Error:** `{ "error": "Task with ID X presents an update error" }`
- **Example with cURL:**
  ```bash
  curl -X PUT http://localhost:3000/api/tasks/1 \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Updated Task","status":true}'
  ```

---

#### 8. **Delete a Task**

- **Endpoint:** `DELETE /api/tasks/:id`
- **Authentication:** Required (Bearer Token)
- **Authorization:** Only the task author can delete it
- **Request Headers:**
  ```
  Authorization: Bearer <jwt_token>
  ```
- **URL Parameters:**
  - `id` - Task ID (integer)
- **Success Response:** (200 OK)
  ```json
  { "result": "deleted" }
  ```
- **Error Responses:**
  - **404 Not Found:** `{ "error": "Task with ID 999 not found" }`
  - **403 Forbidden:** `{ "error": "You can only delete your own tasks" }`
- **Example with cURL:**
  ```bash
  curl -X DELETE http://localhost:3000/api/tasks/1 \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```

---

## Authentication

### JWT (JSON Web Token) Flow

1. **User Sign Up:** Create an account with email and password
2. **User Sign In:** Send email and password to get a JWT token
3. **Include Token:** Add the JWT token in the `Authorization` header for protected routes
4. **Token Format:** `Authorization: Bearer <your_jwt_token>`

### Token Details

- **Expiration:** 1 hour (`expiresIn: "1h"`)
- **Secret Key:** Stored in `JWT_SECRET` environment variable
- **Payload:** Contains `userId` for user identification

### Middleware: verifyToken

The `verifyToken` middleware is applied to all protected routes and:
1. Extracts the JWT from the `Authorization` header
2. Verifies the token signature using the JWT secret
3. Checks if the user exists in the database
4. Injects the `userId` into the request object for use in route handlers
5. Returns error responses for invalid or missing tokens

---

## Code Patterns & Conventions

### Route Definition Pattern

All routes follow this standard pattern:

```typescript
app.post("/api/endpoint", [middleware], async (req, res) => {
  try {
    // Logic here
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error message" });
  }
});
```

### Response Format Convention

**Success Response:**
```json
{
  "id": 1,
  "title": "Task",
  "status": false,
  ...
}
```

**Error Response:**
```json
{
  "error": "Description of what went wrong"
}
```

**Standard Response:**
```json
{
  "result": "Action completed"
}
```

### HTTP Status Codes Used

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 401 | Unauthorized | Missing/invalid token or auth failed |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected server error |

### Authentication Pattern

Protected routes use the `verifyToken(prisma)` middleware:

```typescript
app.post(
  "/api/tasks",
  verifyToken(prisma),  // Middleware
  async (req: AuthRequest, res) => {
    // req.userId is now available
  }
);
```

### Extended Request Interface

The `AuthRequest` interface extends Express `Request` to include `userId`:

```typescript
export interface AuthRequest extends Request {
  userId?: number;
}
```

### Database Query Patterns

**Find Unique:**
```typescript
const user = await prisma.user.findUnique({
  where: { email },
});
```

**Create:**
```typescript
const task = await prisma.task.create({
  data: { title, description, status, authorId },
});
```

**Find Many with Filters:**
```typescript
const tasks = await prisma.task.findMany({
  where: {
    title: title ? { contains: String(title), mode: "insensitive" } : undefined,
    status: status !== undefined ? status === "true" : undefined,
    authorId: authorId !== undefined ? Number(authorId) : undefined,
  },
});
```

**Update:**
```typescript
const updated = await prisma.task.update({
  where: { id: Number(id) },
  data: req.body,
});
```

**Delete:**
```typescript
await prisma.task.delete({
  where: { id: Number(id) },
});
```

### Authorization Pattern

Routes check if the user owns the resource before allowing modifications:

```typescript
if (existingTask.authorId !== userId) {
  return res.status(403).json({ error: "You can only update your own tasks" });
}
```

### Password Security

- Passwords are hashed using **bcryptjs** with 10 salt rounds
- Raw passwords are never stored or returned
- Hashed passwords are compared during sign-in

```typescript
const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, user.password);
```

---

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main Express app & routes
│   └── middlewares/
│       └── auth.ts           # JWT verification middleware
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   ├── seed.ts               # Database seeding script
│   ├── migrations/           # Database migrations
│   └── generated/            # Generated Prisma Client types
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── prisma.config.ts          # Prisma configuration
└── DOCUMENTATION.md          # This file
```

### File Responsibilities

| File | Purpose |
|------|---------|
| `src/index.ts` | Define all API routes and main Express app setup |
| `src/middlewares/auth.ts` | JWT token verification logic |
| `prisma/schema.prisma` | Database models (User, Task) |
| `package.json` | Project metadata and dependencies |
| `tsconfig.json` | TypeScript compiler options |

---

## Environment Configuration

Create a `.env` file in the project root with:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_db"

# JWT Secret (use a strong, random string in production)
JWT_SECRET="development-secret"
```

### Important Security Notes

- **Never commit `.env` to version control** - Add it to `.gitignore`
- **Use strong JWT_SECRET** - Should be at least 32 characters
- **Change JWT_SECRET in production** - Use environment-specific values
- **Always use HTTPS in production** - Protect tokens in transit

---

## Error Handling

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `"Acesso negado. Token não fornecido."` | No Authorization header | Include `Authorization: Bearer <token>` |
| `"Token malformatado."` | Wrong token format | Use `Bearer <token>` format |
| `"Token inválido ou expirado."` | Invalid/expired token | Get a new token from sign-in |
| `"Usuário inexistente ou desativado."` | User not found in DB | Sign up first or verify email |
| `"Task with ID X not found"` | Task doesn't exist | Check the task ID |
| `"You can only update your own tasks"` | Authorization check failed | Only task author can update |
| `"Task with ID X presents an update error"` | Update failed | Check request body format |

### Debugging Tips

1. **Check token expiration:** Tokens expire after 1 hour
2. **Verify user exists:** Make sure the user is in the database
3. **Check task ownership:** Only the author can modify tasks
4. **Validate request format:** Ensure JSON is properly formatted
5. **Test with cURL:** Use the provided cURL examples to isolate issues

---

## Quick Reference - Complete Request Flow

### 1. New User Journey

```bash
# Step 1: Sign up
curl -X POST http://localhost:3000/api/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"pass123"}'

# Step 2: Sign in (get token)
curl -X POST http://localhost:3000/api/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"pass123"}'

# Response: { "token": "YOUR_TOKEN_HERE" }
```

### 2. Create and Manage Tasks

```bash
# Step 3: Create a task
TOKEN="YOUR_TOKEN_HERE"
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Do something","status":false}'

# Step 4: Get all tasks
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# Step 5: Get specific task
curl http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN"

# Step 6: Update task
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":true}'

# Step 7: Delete task
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma ORM Documentation](https://www.prisma.io/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated:** May 12, 2026  
**Version:** 1.0.0
