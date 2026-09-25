import "dotenv/config";
import { PrismaClient, Prisma } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

const userData: Prisma.UserCreateInput[] = [
	{
		name: "jr",
		email: "jr@example.com",
		password: bcrypt.hashSync("password123", 10),
	},
];

async function main() {
	console.log(`Start seeding ...`);

	const mainUserData = userData[0];
	const existingUser = await prisma.user.findUnique({
		where: { email: mainUserData.email },
	});
	const mainUser = existingUser ?? (await prisma.user.create({ data: mainUserData }));

	if (existingUser) {
		console.log(`User ${mainUser.email} already exists; keeping existing data.`);
	}

	console.log(`Using user with id: ${mainUser.id}`);

	const taskCount = await prisma.task.count({ where: { authorId: mainUser.id } });
	const taskData: Prisma.TaskUncheckedCreateInput[] = taskCount === 0 ? [
		{
			title: "Update documentation",
			description: "Update the Prisma documentation to include new features and improvements.",
			authorId: mainUser.id,
			status: true,
		},
		{
			title: "Set up CI/CD pipeline",
			description: "Set up a continuous integration and deployment pipeline for the Prisma project.",
			authorId: mainUser.id,
			status: false,
		},
		{
			title: "Fix bugs in the query engine",
			description: "Fix critical bugs in the Prisma query engine.",
			authorId: mainUser.id,
			status: true,
		},
	] : [];

	// Create tasks
	for (const t of taskData) {
		const task = await prisma.task.create({
			data: t,
		});
		console.log(`Created task with id: ${task.id}`);
	}
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
