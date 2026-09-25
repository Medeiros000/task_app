import { useOutletContext } from "react-router-dom";

function TaskInfo() {
	const { task } = useOutletContext();
	// const task = context?.task || context;

	if (!task) {
		return (
			<div>
				<p>Loading task information...</p>
			</div>
		);
	}

	return (
		<div className="task-info">
			<h1>{task.title}</h1>
			<h3>{task.description}</h3>
			<div>
				<span className={`task-status ${task.status ? "completed" : "pending"}`} style={{ borderRadius: "5px" }}>
					{task.status ? "✅ Completed" : "⏳ Pending"}
				</span>
				<span className="task-author">
					<strong>Author:</strong> {task.author?.name}
				</span>
			</div>
		</div>
	);
}

export default TaskInfo;
