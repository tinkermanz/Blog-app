import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";

const HomePage = () => {
	let [blogs, setBlogs] = useState(null);

	const fetchLatestBlog = () => {
		axios
			.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
			.then(({ data }) => {
				setBlogs(data.blogs);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		fetchLatestBlog();
	}, []);

	return (
		<AnimationWrapper>
			<section className="h-cover flex justify-center gap-10">
				{/* Latest Blog */}
				<div className="w-full">
					<InPageNavigation
						routes={["home", "trending blogs"]}
						defaultHidden={["trending blogs"]}
					>
						<>
							{blogs == null ? (
								<Loader />
							) : (
								blogs.map((blog, i) => <h1 key={i}>{blog.title}</h1>)
							)}
						</>
						<h1>Trending Blogs</h1>
					</InPageNavigation>
				</div>
				{/* Filters treanding blog */}
				<div></div>
			</section>
		</AnimationWrapper>
	);
};

export default HomePage;
