import { useOutletContext, Link } from "react-router-dom";

function TaskList() {
  const { tasks } = useOutletContext();
  
	return (
		<>
			{tasks.map((task) => (
				<Link to={`${task.id}`} key={task.id} className="task-card-link">
					<div className="task-card">
						<h3>{task.title}</h3>
						<p className="task-description">{task.description}</p>
						<div className="task-meta">
							<span className={`task-status ${task.status ? "completed" : "pending"}`}>
								{task.status ? "Completed" : "Pending"}
							</span>
							<span className="task-author">Author: {task.author.name}</span>
						</div>
					</div>
				</Link>
			))}
		</>
	);
}

export default TaskList;
