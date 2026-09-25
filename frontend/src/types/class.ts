// Este arquivo define o "formato" dos dados que vêm do seu banco via API
export interface Task {
	id: number;
	title: string;
	description: string | null; // Pode ser null conforme seu schema Prisma
	status: boolean;
	authorId: number;
	created_at: string; // Datas costumam vir como string (ISO) no JSON
	updated_at: string;
}

export interface User {
	id: number;
	name: string;
	email: string;
}
