import "dotenv/config";
import { PrismaClient } from "../prisma/generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { verifyToken, AuthRequest } from "./middlewares/auth.js";
// With AuthRequest, we can now access req.userId in our route handlers,
// which is set by the verifyToken middleware after validating the JWT
// and checking the user in the database.

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

app.post("/api/sign-up", async (req, res) => {
	const { name, email, password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: { name, email, password: hashedPassword },
	});

	res.status(201).send("user created");
});

app.post("/api/sign-in", async (req, res) => {
	const { email, password } = req.body;
	const user = await prisma.user.findUnique({
		where: { email },
	});
	if (!user) {
		return res.status(401).json({ error: "Invalid email or password" });
	}
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return res.status(401).json({ error: "Invalid email or password" });
	}
	const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
	res.status(200).json({ token: token });
});

app.get("/", (req, res) => {
	res.send(`
    <html>
			<head>
				<title>Task API Documentation</title>
			</head>
			<body style="font-family: sans-serif; background: #f8fafc; margin: 0; padding: 40px; color: #0f172a;">
				<div style="max-width: 980px; margin: 0 auto;">
					<h1 style="margin-bottom: 8px;">🚀 Task API Documentation</h1>

					<div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
						<h2 style="margin-top: 0;">Auth</h2>
						<div style="margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px;">
							<code>POST /api/sign-up</code>
							<p style="margin: 8px 0 0;">Creates a new user.</p>
							<p style="margin: 8px 0 0;"><strong>Body:</strong> { name, email, password }</p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">*not implemented*</p>
						</div>
						<div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
							<code>POST /api/sign-in</code>
							<p style="margin: 8px 0 0;">Authenticates a user and returns a JWT token.</p>
							<p style="margin: 8px 0 0;"><strong>Body:</strong> { email, password }</p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">*mock implementation*</p>
						</div>
					</div>

					<div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
						<h2 style="margin-top: 0;">Tasks</h2>
						<div style="margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px;">
							<code>GET /api/tasks</code>
							<p style="margin: 8px 0 0;">Lists tasks.</p>
							<p style="margin: 8px 0 0;"><strong>Query:</strong> title, status, authorId</p>
							<p style="margin: 8px 0 0;"><strong>Auth:</strong> Bearer token required</p>
						</div>
						<div style="margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px;">
							<code>GET /api/tasks/:id</code>
							<p style="margin: 8px 0 0;">Returns a task by ID.</p>
							<p style="margin: 8px 0 0;"><strong>Auth:</strong> Bearer token required</p>
						</div>
						<div style="margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px;">
							<code>POST /api/tasks</code>
							<p style="margin: 8px 0 0;">Creates a task for the authenticated user.</p>
							<p style="margin: 8px 0 0;"><strong>Body:</strong> { title, description, status }</p>
							<p style="margin: 8px 0 0;"><strong>Auth:</strong> Bearer token required</p>
						</div>
						<div style="margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px;">
							<code>PUT /api/tasks/:id</code>
							<p style="margin: 8px 0 0;">Updates a task owned by the authenticated user.</p>
							<p style="margin: 8px 0 0;"><strong>Body:</strong> any task fields</p>
							<p style="margin: 8px 0 0;"><strong>Auth:</strong> Bearer token required</p>
						</div>
						<div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
							<code>DELETE /api/tasks/:id</code>
							<p style="margin: 8px 0 0;">Deletes a task owned by the authenticated user.</p>
							<p style="margin: 8px 0 0;"><strong>Auth:</strong> Bearer token required</p>
						</div>
					</div>
      </body>
    </html>
  `);
});

app.post("/api/tasks", verifyToken(prisma), async (req: AuthRequest, res) => {
	const { title, description, status } = req.body;
	const resultTask = await prisma.task.create({
		data: {
			title,
			description,
			status,
			authorId: req.userId!,
		},
	});
	res.json(resultTask);
});

app.put("/api/tasks/:id", verifyToken(prisma), async (req: AuthRequest, res) => {
	const userId = req.userId;
	const { id } = req.params;
	const existingTask = await prisma.task.findUnique({
		where: { id: Number(id) },
	});

	if (!existingTask) {
		return res.status(404).json({ error: `Task with ID ${id} not found` });
	}

	if (existingTask.authorId !== userId) {
		return res.status(403).json({ error: "You can only update your own tasks" });
	}

	try {
		const updatedTask = await prisma.task.update({
			where: { id: Number(id) },
			data: req.body,
		});
		res.json(updatedTask);
	} catch (error) {
		res.json({ error: `Task with ID ${id} presents an update error` });
	}
});

app.delete(`/api/tasks/:id`, verifyToken(prisma), async (req: AuthRequest, res) => {
	const userId = req.userId;
	const { id } = req.params;

	const existingTask = await prisma.task.findUnique({
		where: { id: Number(id) },
	});

	if (!existingTask) {
		return res.status(404).json({ error: `Task with ID ${id} not found` });
	}

	if (existingTask.authorId !== userId) {
		return res.status(403).json({ error: "You can only delete your own tasks" });
	}

	const deletedTask = await prisma.task.delete({
		where: {
			id: Number(id),
		},
	});
	res.json({ result: "deleted" });
});

app.get("/api/tasks", verifyToken(prisma), async (req: AuthRequest, res) => {
	// const userId = req.userId;
	const { title, status, authorId } = req.query;
	const existingTasks = await prisma.task.findMany({
		where: {
			title: title
				? {
						contains: String(title),
						mode: "insensitive",
					}
				: undefined,
			status: status !== undefined ? status === "true" : undefined,
			authorId: authorId !== undefined ? Number(authorId) : undefined,
		},
		include: {
			author: true,
		},
	});
	res.json(existingTasks);
});

app.get("/api/tasks/:id", verifyToken(prisma), async (req: AuthRequest, res) => {
	const userId = req.userId;
	const { id } = req.params;

	const existingTask = await prisma.task.findUnique({
		where: { id: Number(id) },
		include: {
			author: true,
		},
	});

	if (!existingTask) {
		return res.status(404).json({ error: `Task with ID ${id} not found` });
	}

	res.json(existingTask);
});

const server = app.listen(3000, () =>
	console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`),
);
