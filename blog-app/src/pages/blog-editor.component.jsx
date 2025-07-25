import { Link, useNavigate } from "react-router";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import axios from "axios";
import { useContext, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "./editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../common/editorjs-tools";
import defaultBanner from "../imgs/blog banner.png";
import { UserContext } from "../App";

const BlogEditor = () => {
	let navigate = useNavigate();

	const isReady = useRef(false);
	let { userAuth } = useContext(UserContext);

	console.log(userAuth);

	let {
		blog,
		blog: { title, banner, content, tags, des },
		setBlog,
		textEditor,
		setEditorState,
		setTextEditor,
	} = useContext(EditorContext);

	useEffect(() => {
		if (!isReady.current)
			setTextEditor(
				new EditorJS({
					holder: "textEditor",
					data: content,
					tools,
					placeholder: "Let's write an awesome story",
				})
			);
		isReady.current = true;
	}, [setTextEditor, content]);

	console.log(textEditor);

	const handleBannerUpload = (e) => {
		console.log(e);

		let img = e.target.files[0];

		if (img) {
			let loadingToast = toast.loading("Uploading...");

			const formData = new FormData();
			formData.append("banner", img);

			axios
				.post(import.meta.env.VITE_SERVER_DOMAIN + "/upload-banner", formData)
				.then((res) => {
					toast.dismiss(loadingToast);
					toast.success("Uploaded 👍");

					setBlog({
						...blog,
						banner: res.data.bannerUrl,
					});
				})
				.catch((err) => {
					toast.dismiss(loadingToast);
					return toast.error(err);
				});
		}
	};

	const handleTitleKeydown = (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
		}
	};

	const handleTitleChange = (e) => {
		let input = e.target;

		input.style.height = "auto";
		input.style.height = input.scrollHeight + "px";

		setBlog({
			...blog,
			title: input.value,
		});
	};

	const handlePublishEvent = () => {
		if (banner === defaultBanner)
			return toast.error("Upload a blog banner to puslish it");

		if (!title.length) return toast.error("Write blog title to publish it");

		if (textEditor.isReady) {
			textEditor
				.save()
				.then((data) => {
					if (data.blocks.length) {
						setBlog({
							...blog,
							content: data,
						});
						setEditorState("publish");
					} else
						return toast.error("Write Something in your blog to publish it");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const handleSaveDraft = (e) => {
		if (e.target.classList.contains("disable")) {
			return;
		}

		if (!title.length)
			return toast.error("Write blog title before saving it as a draft");

		let loadingToast = toast.loading("Publishing...");

		e.target.classList.add("disable");

		if (textEditor.isReady) {
			textEditor.save().then((content) => {
				const blogObj = {
					title,
					banner,
					des,
					content,
					tags,
					draft: true,
				};

				axios
					.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
						headers: {
							Authroization: `Bearer ${userAuth?.access_token}`,
						},
					})
					.then(() => {
						e.target.classList.remove("disable");
						toast.dismiss(loadingToast);
						toast.success("Saved 👍");

						setTimeout(() => {
							navigate("/");
						}, 500);
					})
					.catch(({ response }) => {
						e.target.classList.remove("disable");
						toast.dismiss(loadingToast);
						return toast.error(response.data.error);
					});
			});
		}
	};

	return (
		<>
			<nav className="navbar">
				<Link to="/" className="flex-none w-10">
					<img src={logo} alt="" />
				</Link>
				<p className="max-md:hidden text-black line-clamp-1 w-full">
					{title.length ? title : "New Blog"}
				</p>
				<div className="flex gap-4 ml-auto">
					<button className="btn-dark py-2" onClick={handlePublishEvent}>
						Publish
					</button>
					<button className="btn-light py-2" onClick={handleSaveDraft}>
						Save Draft
					</button>
				</div>
			</nav>
			<Toaster />
			<AnimationWrapper>
				<section>
					<div className="mx-auto max-w-[900px] w-full">
						<div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
							<label htmlFor="uploadBanner">
								<img src={banner} alt="" className="z-20" />
								<input
									id="uploadBanner"
									type="file"
									accept=".png, .jpg, .jpeg"
									hidden
									onChange={handleBannerUpload}
								/>
							</label>
						</div>

						<textarea
							defaultValue={title}
							placeholder="Blog title"
							className="text-4xl font-medium w-full outline-none h-20 resize-none mt-10 leading-tight placeholder:opacity-40"
							onKeyDown={handleTitleKeydown}
							onChange={handleTitleChange}
						></textarea>

						<hr className="w-full opacity-10 my-5" />

						<div id="textEditor" className="font-gelasio"></div>
					</div>
				</section>
			</AnimationWrapper>
		</>
	);
};

export default BlogEditor;
