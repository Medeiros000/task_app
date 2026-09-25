import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../prisma/generated/client";
import "dotenv/config";

// Extends the Express Request interface to include userId
export interface AuthRequest extends Request {
	userId?: number;
}

export const verifyToken = (prisma: PrismaClient) => {
	return async (req: AuthRequest, res: Response, next: NextFunction) => {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return res.status(401).json({ error: "Access denied. Token not provided." });
		}

		const parts = authHeader.split(" ");
		if (parts.length !== 2 || parts[0] !== "Bearer") {
			return res.status(401).json({ error: "Malformatted token." });
		}

		const token = parts[1];

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

			const user = await prisma.user.findUnique({
				where: { id: decoded.userId },
				select: { id: true },
			});

			if (!user) {
				return res.status(401).json({ error: "User does not exist or is deactivated." });
			}

			// Injects userID into the request object for use in subsequent handlers
			req.userId = user.id;

			next();
		} catch (error) {
			return res.status(401).json({ error: "Token invalid or expired." });
		}
	};
};
