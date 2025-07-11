import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "./editor.pages";
import Tag from "../components/tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router";

const PublishForm = () => {
	const characterLimit = 200;
	const tagLimit = 10;

	let navigate = useNavigate();

	let {
		blog,
		blog: { banner, title, des, tags, content },
		setEditorState,
		setBlog,
	} = useContext(EditorContext);

	let {
		userAuth: { access_token },
	} = useContext(UserContext);

	const handleCloseEvent = () => {
		setEditorState("editor");
	};

	const handleBlogTitleChange = (e) => {
		let input = e.target;

		setBlog({
			...blog,
			title: input.value,
		});
	};

	const handleBlogDesChange = (e) => {
		let input = e.target;

		setBlog({
			...blog,
			des: input.value,
		});
	};
	const handleKeyDown = (e) => {
		if (e.keyCode === 13) e.preventDefault();
	};

	const handleKeyDownTag = (e) => {
		if (e.keyCode === 13 || e.keyCode === 188) {
			e.preventDefault();

			let tag = e.target.value;

			if (tags.length < tagLimit) {
				if (!tags.includes(tag) && tag.length) {
					setBlog({
						...blog,
						tags: [...tags, tag],
					});
				}
			} else {
				toast.error(`You can add max ${tagLimit} Tags`);
			}

			e.target.value = "";
		}
	};

	const publishBlog = (e) => {
		if (e.target.classList.contains("disable")) {
			return;
		}

		if (!title.length) return toast.error("Write blog title before publishing");
		if (!des.length || des.length > characterLimit)
			return toast.error(
				`Write a description about your blog within ${characterLimit} character to publish`
			);
		if (!tags.length) return toast.error("Enter at least 1 tag to to publish");

		let loadingToast = toast.loading("Publishing...");

		e.target.classList.add("disable");

		const blogObj = {
			title,
			banner,
			des,
			content,
			tags,
			draft: false,
		};

		axios
			.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
				headers: {
					Authroization: `Bearer ${access_token}`,
				},
			})
			.then(() => {
				e.target.classList.remove("disable");
				toast.dismiss(loadingToast);
				toast.success("Published 👍");

				setTimeout(() => {
					navigate("/");
				}, 500);
			})
			.catch(({ response }) => {
				e.target.classList.remove("disable");
				toast.dismiss(loadingToast);
				return toast.error(response.data.error);
			});
	};

	return (
		<AnimationWrapper>
			<section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
				<Toaster />

				<button
					onClick={handleCloseEvent}
					className="w-12 h-12 absolute right-[5vw] z-10 top-[5%]"
				>
					<i className="fi fi-br-cross"></i>
				</button>

				<div className="max-w-[550px] center">
					<p className="text-dark-grey">Preview</p>
					<div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
						<img src={banner} alt="" />
					</div>

					<h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
						{title}
					</h1>
					<p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
						{des}
					</p>
					<div className="border-grey lg:border-1 lg:pl-8">
						<p className="text-dark-grey mb-2 mt-9">Blog Title</p>
						<input
							className="input-box pl-4"
							type="text"
							placeholder="Blog Title"
							defaultValue={title}
							onChange={handleBlogTitleChange}
						/>

						<p className="text-dark-grey mb-2 mt-9">
							Short Description about your blog
						</p>
						<textarea
							maxLength={characterLimit}
							className="h-40 resize-none leading-7 input-box pl-4"
							defaultValue={des}
							onChange={handleBlogDesChange}
							onKeyDown={handleKeyDown}
						/>

						<p className="mt-1 text-dark-grey text-sm text-right">
							{characterLimit - des.length} characters left
						</p>

						<p className="text-dark-grey mb-2 mt-9">
							Topics - (Helps in searching and ranking your blog post)
						</p>

						<div className="relative input-box pl-2 py-2 pb-4">
							<input
								type="text"
								placeholder="Topic"
								className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
								onKeyDown={handleKeyDownTag}
							/>
							{tags.map((tag, i) => (
								<Tag tag={tag} tagIndex={i} key={i} />
							))}
						</div>
						<p className="mt-1 mb-4 text-dark-grey text-right">
							{tagLimit - tags.length} Tags left
						</p>

						<button className="btn-dark px-8" onClick={publishBlog}>
							Publish
						</button>
					</div>
				</div>
			</section>
		</AnimationWrapper>
	);
};

export default PublishForm;
