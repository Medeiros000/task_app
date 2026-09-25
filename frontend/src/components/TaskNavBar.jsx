import { Link } from "react-router-dom";

function NavBar() {
	return (
		<nav className="task-navbar">			
			<ul className="nav-links">
				<li>
					<Link to="new">Add</Link>
				</li>
				<li>
					<Link to="">Tasks</Link>
				</li>				
			</ul>
		</nav>
	);
}

export default NavBar;
