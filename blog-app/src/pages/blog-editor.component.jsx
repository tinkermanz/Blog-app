import { Link } from "react-router";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import axios from "axios";
import { useRef } from "react";

const BlogEditor = () => {
	let blogBannerRef = useRef(null);

	const handleBannerUpload = (e) => {
		console.log(e);

		let img = e.target.files[0];
		console.log(img);
		if (img) {
			const formData = new FormData();
			formData.append("banner", img);
			console.log(formData.entries());
			axios
				.post(import.meta.env.VITE_SERVER_DOMAIN + "/upload-banner", formData)
				.then((res) => {
					console.log(res.data.uploadUrl);
					blogBannerRef.current.src = res.data.uploadUrl;
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	return (
		<>
			<nav className="navbar">
				<Link to="/" className="flex-none w-10">
					<img src={logo} alt="" />
				</Link>
				<p className="max-md:hidden text-black line-clamp-1 w-full">NEw blog</p>
				<div className="flex gap-4 ml-auto">
					<button className="btn-dark py-2">Publish</button>
					<button className="btn-light py-2">Save Draft</button>
				</div>
			</nav>

			<AnimationWrapper>
				<section>
					<div className="mx-auto max-w-[900px] w-full">
						<div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
							<label htmlFor="uploadBanner">
								<img
									ref={blogBannerRef}
									src={defaultBanner}
									alt=""
									className="z-20"
								/>
								<input
									id="uploadBanner"
									type="file"
									accept=".png, .jpg, .jpeg"
									hidden
									onChange={handleBannerUpload}
								/>
							</label>
						</div>
					</div>
				</section>
			</AnimationWrapper>
		</>
	);
};

export default BlogEditor;
