import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { taskService } from "../../api/taskService";

function TaskForm() {
	const [task, setTask] = useState({ title: "", description: "", status: false });
	const taskId = useParams().id;
	const navigate = useNavigate();
	const context = useOutletContext() || {};
	const refetch = context?.refetch;
	const [msg, setMsg] = useState("");

	useEffect(() => {
		if (!taskId) return;
		taskService.getById(taskId).then((task) => {
			setTask(task);
		});
	}, [taskId]);

	useEffect(() => {
		if (msg) {
			const timer = setTimeout(() => {
				setMsg("");
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [msg]);

	function handleUpdateTask(event) {
		event.preventDefault();
		
		if (!task.authorId) {
			taskService
				.create(task)
				.then(() => {
					if (refetch) refetch();
					navigate(`/tasks`);
				})
				.catch(() => {
					setMsg("Error creating task. Please try again.");
				});
			return;
		}

		const updatedTask = { title: task.title, description: task.description, status: task.status };
		taskService
			.update(task.id, updatedTask)
			.then(() => {
				if (refetch) refetch();
				navigate(`/tasks`);
			})
			.catch((error) => {
				if (error.status === 403) {
					setMsg("You can only update your own tasks");
				}
			});
	}

	function handleChangeCheckbox(event) {
		setTask((prevTask) => ({
			...prevTask,
			status: event.target.checked,
		}));
	}

	function handleChangeTitle(event) {
		const newTitle = event.target.value;
		setTask((prevTask) => ({
			...prevTask,
			title: newTitle,
		}));
	}

	function handleChangeDescription(event) {
		const newDescription = event.target.value;
		setTask((prevTask) => ({
			...prevTask,
			description: newDescription,
		}));
	}

	return (
		<div className="form-wrapper">
			<h2>{task.authorId ? "Update Task" : "Create Task"}</h2>
			<form className="form-task-edit" onSubmit={handleUpdateTask}>
				<div>
					<label htmlFor="title">Title</label>
					<input type="text" id="title" placeholder="Title" value={task.title} onChange={handleChangeTitle} />
				</div>
				<div>
					<label htmlFor="description">Description</label>
					<textarea
						id="description"
						placeholder="Description"
						value={task.description}
						onChange={handleChangeDescription}
					></textarea>
				</div>
				<div>
					<label htmlFor="status">Status</label>
					<div className="form-task-edit-div" style={{ padding: 0 }}>
						<input type="checkbox" id="status" name="status" checked={task.status} onChange={handleChangeCheckbox} />
						completed?
					</div>
				</div>
				<button type="submit">{task.authorId ? "Update Task" : "Create Task"}</button>
			</form>
			{msg && <p className="error">{msg}</p>}
		</div>
	);
}

export default TaskForm;
