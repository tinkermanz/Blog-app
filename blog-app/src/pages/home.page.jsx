import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation, {
	activeTabRef,
} from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../common/blog-post.component";
import MinimalBlogPost from "../components/minimal-blog-post.component";
import NoDataMessage from "../components/nodata.component";

const HomePage = () => {
	let [blogs, setBlogs] = useState(null);
	let [trendingBlogs, setTrendingBlogs] = useState(null);
	let [pageState, setPageState] = useState("home");

	let categories = [
		"programming",
		"hollywood",
		"film making",
		"social media",
		"cooking",
		"tech",
		"finance",
		"travel",
	];

	const fetchLatestBlogs = () => {
		axios
			.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
			.then(({ data }) => {
				setBlogs(data.blogs);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const fetchBlogsByCategory = () => {
		axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
				tag: pageState,
			})
			.then(({ data }) => {
				console.log(data);
				setBlogs(data.blogs);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const fetchTrendingBlogs = () => {
		axios
			.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
			.then(({ data }) => {
				setTrendingBlogs(data.blogs);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const loadBlogByCategory = (e) => {
		let category = e.target.innerText.toLowerCase();

		setBlogs(null);

		if (pageState === category) {
			setPageState("home");
			return;
		}

		setPageState(category);
	};

	useEffect(() => {
		activeTabRef.current.click();

		if (pageState === "home") fetchLatestBlogs();
		else fetchBlogsByCategory();

		if (!trendingBlogs) fetchTrendingBlogs();
	}, [pageState]);

	return (
		<AnimationWrapper>
			<section className="h-cover flex justify-center gap-10">
				{/* Latest Blog */}
				<div className="w-full">
					<InPageNavigation
						routes={[pageState, "trending blogs"]}
						defaultHidden={["trending blogs"]}
					>
						<>
							{blogs === null ? (
								<Loader />
							) : blogs.length ? (
								blogs.map((blog, i) => (
									<AnimationWrapper
										transition={{ duration: 1, delay: i * 0.1 }}
										key={i}
									>
										<BlogPostCard
											content={blog}
											author={blog.author.personal_info}
										/>
									</AnimationWrapper>
								))
							) : (
								<NoDataMessage message="No Blogs published" />
							)}
						</>

						{trendingBlogs === null ? (
							<Loader />
						) : trendingBlogs.length ? (
							trendingBlogs.map((blog, i) => (
								<AnimationWrapper
									transition={{ duration: 1, delay: i * 0.1 }}
									key={i}
								>
									<MinimalBlogPost blog={blog} index={i} />
								</AnimationWrapper>
							))
						) : (
							<NoDataMessage message="No Trending Blogs" />
						)}
					</InPageNavigation>
				</div>
				{/* Filters treanding blog */}
				<div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
					<div className="flex flex-col gap-10">
						<div>
							<h1 className="font-medium text-xl mb-8">
								Stories from all interests
							</h1>

							<div className="flex gap-3 flex-wrap">
								{categories.map((c, i) => (
									<button
										onClick={loadBlogByCategory}
										className={`tag ${
											pageState === c ? "bg-black text-white" : ""
										}`}
										key={i}
									>
										{c}
									</button>
								))}
							</div>
						</div>

						<div>
							<h1 className="font-medium text-xl mb-8">
								Trending <i className="fi fi-rr-arrow-trend-up"></i>
							</h1>
							{trendingBlogs === null ? (
								<Loader />
							) : trendingBlogs.length ? (
								trendingBlogs.map((blog, i) => (
									<AnimationWrapper
										transition={{ duration: 1, delay: i * 0.1 }}
										key={i}
									>
										<MinimalBlogPost blog={blog} index={i} />
									</AnimationWrapper>
								))
							) : (
								<NoDataMessage message="No Trending Blog" />
							)}
						</div>
					</div>
				</div>
			</section>
		</AnimationWrapper>
	);
};

export default HomePage;
