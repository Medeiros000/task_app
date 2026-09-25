import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { isTokenExpired } from "./api/authService";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Tasks from "./pages/tasks/Tasks";
import TaskList from "./pages/tasks/TaskList";
import TaskDetails from "./pages/tasks/TaskDetails";
import TaskInfo from "./pages/tasks/TaskInfo";
import TaskForm from "./pages/tasks/TaskForm";
import NavBar from "./components/NavBar";
import "./App.css";

function App() {
	const [token, setToken] = useState(localStorage.getItem("token") || "");

	useEffect(() => {
    if(isTokenExpired(token)) {
      signOut();      
    }
    
	}, [token]);

	function signOut() {
		localStorage.removeItem("token");
		setToken("");
	}

	return (
		<main>
			<NavBar token={token} signOut={signOut} />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/sign-in" element={<SignIn setToken={setToken} signOut={signOut} />} />
				<Route path="/tasks/" element={<Tasks token={token} isTokenExpired={isTokenExpired} signOut={signOut} />}>
					<Route path="" element={<TaskList />}></Route>
					<Route path="new" element={<TaskForm />}></Route>
					<Route path="edit" element={<TaskForm />}></Route>
					<Route path=":id/" element={<TaskDetails />}>
						<Route index element={<Navigate to="info" />} />
						<Route path="info" element={<TaskInfo />}></Route>
						<Route path="update" element={<TaskForm />}></Route>
					</Route>
				</Route>
			</Routes>
		</main>
	);
}

export default App;
