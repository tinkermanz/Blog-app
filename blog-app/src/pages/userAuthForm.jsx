import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router";
import { toast, Toaster } from "react-hot-toast";
import { useContext, useRef } from "react";
import axios from "axios";
import { storeInsession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
	const authForm = useRef();

	let { userAuth, setUserAuth } = useContext(UserContext);

	const userAuthThroughServer = (serverRoute, formData) => {
		axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
			.then(({ data }) => {
				storeInsession("user", JSON.stringify(data));

				setUserAuth(data);
			})
			.catch(({ response }) => {
				console.log(response);
				toast.error(response.data.error);
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		let serverRoute = type === "sign-in" ? "/signin" : "/signup";

		const form = new FormData(e.currentTarget);

		let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/; // regex for email
		let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

		const formData = {};

		for (let [key, value] of form.entries()) formData[key] = value;

		let { fullname, email, password } = formData;

		if (fullname && fullname.length < 3)
			return toast.error("Fullname must be atleast 3 letters long");
		if (!email.length) return toast.error("Enter Email");
		if (!emailRegex.test(email)) return toast.error("Email is invalid");
		if (!passwordRegex.test(password))
			return toast.error(
				"Password should be 6 to 20 characters long with a numeric, 1 lowercase adn 1 uppercase letters"
			);

		userAuthThroughServer(serverRoute, formData);
	};

	const handleGoogleAuth = (e) => {
		e.preventDefault();
		authWithGoogle()
			.then((user) => {
				let serverRoute = "/google-auth";

				let formData = {
					access_token: user.accessToken,
				};
				userAuthThroughServer(serverRoute, formData);
			})
			.catch((err) => {
				toast.error("Trouble with login through Google");
				return console.log(err);
			});
	};

	return userAuth?.access_token ? (
		<Navigate to="/" />
	) : (
		<AnimationWrapper keyValue={type}>
			<section className="h-cover flex items-center justify-center">
				<Toaster />
				<form
					ref={authForm}
					id="authForm"
					className="w-[80%] max-w-[400px]"
					onSubmit={handleSubmit}
				>
					<h1 className="text-4xl font-gelasio capitalize text-center mb-24">
						{type === "sign-in" ? "Welcome back" : "Join us Today"}
					</h1>
					{type != "sign-in" ? (
						<InputBox
							name="fullname"
							type="text"
							placeholder="Full-name"
							icon="fi-rr-user"
						/>
					) : (
						""
					)}
					<InputBox
						name="email"
						type="email"
						placeholder="Email"
						icon="fi-rr-envelope"
					/>
					<InputBox
						name="password"
						type="password"
						placeholder="Password"
						icon="fi-rr-key"
					/>

					<button className="btn-dark center mt-14" type="submit">
						{type.replace("-", " ")}
					</button>

					<div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
						<hr className="w-1/2 border-black" />
						<p>or</p>
						<hr className="w-1/2 border-black" />
					</div>

					<button
						className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
						onClick={handleGoogleAuth}
					>
						<img src={googleIcon} alt="" className="w-5 " />
						Continue with Google
					</button>

					{type === "sign-in" ? (
						<p className="mt-6 text-dark-grey text-xl text-center">
							Don't have an Account
							<Link to="/signup" className="underline  text-black text-xl ml-1">
								Join us Today
							</Link>
						</p>
					) : (
						<p className="mt-6 text-dark-grey text-xl text-center">
							Already a member?
							<Link to="/signin" className="underline  text-black text-xl ml-1">
								Sign in here
							</Link>
						</p>
					)}
				</form>
			</section>
		</AnimationWrapper>
	);
};

export default UserAuthForm;
