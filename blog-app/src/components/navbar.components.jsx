import { Link, Outlet } from "react-router";
import logo from "../imgs/logo.png";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";

const Navbar = () => {
	const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
	const timerRef = useRef(null);

	const [userNavPanel, setUserNavPanel] = useState(false);

	const {
		userAuth,
		// userAuth: { access_token, profile_img },
	} = useContext(UserContext);

	useEffect(() => {
		clearTimeout(timerRef);
	}, []);

	return (
		<>
			<nav className="navbar">
				<Link to="/" className="w-10 flex-none">
					<img src={logo} className="w-full" alt="" />
				</Link>

				<div
					className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${
						searchBoxVisibility ? "show" : "hide"
					}`}
				>
					<input
						type="text"
						placeholder="Search"
						className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%]
                    md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
					/>

					<i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
				</div>
				<div
					className="flex items-center gap-3 md:gap-6 ml-auto"
					onClick={() => setSearchBoxVisibility((currValue) => !currValue)}
				>
					<button className="md:hidden ">
						<i className="fi fi-rr-search text-xl bg-grey w-12 h-12 rounded-full flex items-center justify-center"></i>
					</button>

					<Link to="/editor" className="hidden md:flex gap-2 link">
						<i className="fi fi-rr-file-edit"></i>
						<p>Write</p>
					</Link>

					{userAuth?.access_token ? (
						<>
							<Link to="/dashboard/notification">
								<button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 ">
									<i className="fi fi-rr-bell text-2xl block mt-1"></i>
								</button>
							</Link>
							<div
								className="relative"
								onClick={() => setUserNavPanel((curS) => !curS)}
								onBlur={() => {
									clearTimeout(timerRef.current);

									timerRef.current = setTimeout(() => {
										setUserNavPanel(false);
									}, 200);
								}}
							>
								<button className="w-12 h-12 mt-1">
									<img
										src={userAuth?.profile_img}
										alt=""
										className="w-full h-full object-cover
									rounded-full"
									/>
								</button>
								{userNavPanel ? <UserNavigationPanel /> : ""}
							</div>
						</>
					) : (
						<>
							<Link to="/signin" className="btn-dark py-2">
								Sign In
							</Link>
							<Link to="/signup" className="btn-light py-2 hidden md:block">
								Sign Up
							</Link>
						</>
					)}
				</div>
			</nav>
			<Outlet />
		</>
	);
};

export default Navbar;
