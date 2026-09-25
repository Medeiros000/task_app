import { Link } from "react-router-dom";

function NavBar(props) {
	const token = props.token;

	return (
		<nav className="navbar">
			<h1>Task Manager</h1>
			<ul className="nav-links">
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/tasks">Tasks</Link>
				</li>
				{token ? (
					<li  onClick={props.signOut}>
						<Link to="/sign-in">
							Sign Out
						</Link>
					</li>
				) : (
					<li>
						<Link to="/sign-in">Sign In</Link>
					</li>
				)}
			</ul>
		</nav>
	);
}

export default NavBar;
