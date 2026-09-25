import { signIn as authSignIn } from "../api/authService";
import { useNavigate } from "react-router-dom";

function SignIn(props) {
	const { setToken } = props;
	const navigate = useNavigate();

	const handleSignIn = async () => {
		try {
			const token = await authSignIn("jr@example.com", "password123");
			setToken(token);
			localStorage.setItem("token", token);
			navigate("/tasks");
		} catch (error) {
			console.error("Sign in failed:", error);
		}
	};

	return (
		<div id="center" className="tasks-page">
			<h1>Sign In</h1>
			{/* <p>This is the sign-in page.</p> */}
			<form className="form-signin">
				<input type="email" placeholder="jr@example.com" />
				<input type="password" placeholder="password123" />
				<p style={{ fontSize: "10px" }}>* mock credentials</p>
			</form>
				<button onClick={handleSignIn}>Sign In</button>
		</div>
	);
}

export default SignIn;
