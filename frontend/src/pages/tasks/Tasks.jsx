import { Outlet, useLocation } from "react-router-dom";
import { taskService } from "../../api/taskService";
import TaskNavBar from "../../components/TaskNavBar";
import { useCallback, useEffect, useState } from "react";

function Spinner() {
	return (
		<svg className="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
			<circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
		</svg>
	);
}

function Tasks(props) {
	const [tasks, setTasks] = useState([]);
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(true);
	const { token, isTokenExpired, signOut } = props;

	const fetchTasks = useCallback(async () => {
		if (!token) {
			return;
		}
		try {
			const data = await taskService.getAll();
			setTasks(data);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		} finally {
			setIsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		if (!token) return;
		if (isTokenExpired(token)) {
			signOut();
			return;
		}

		let active = true;
		taskService
			.getAll()
			.then((data) => {
				if (active) setTasks(data);
			})
			.catch((error) => {
				if (active) console.error("Error fetching tasks:", error);
			})
			.finally(() => {
				if (active) setIsLoading(false);
			});

		return () => {
			active = false;
		};
	}, [isTokenExpired, signOut, token]);

	return (
		<section id="center" className="tasks-page">
			
				{!token && <p>Please sign in to view, edit, delete or create new tasks.</p>}
				{token && <TaskNavBar token={token} />}
				{token && isLoading && <Spinner />}
			
			{token && (
				<div className={location.pathname === "/tasks" ? "tasks-container" : "task-container"}>
					<Outlet context={{ tasks, refetch: fetchTasks }} />
				</div>
			)}
		</section>
	);
}

export default Tasks;
