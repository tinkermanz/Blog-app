import { Link } from "react-router";
import { getDay } from "../common/date";

const MinimalBlogPost = ({ blog, index }) => {
	let {
		title,
		blog_id: id,
		author: {
			personal_info: { fullname, username, profile_img },
		},
		publishedAt,
	} = blog;

	return (
		<Link to={`/blogs/${id}`} className="flex gap-5 mb-4">
			<h1 className="blog-index">
				{index < 10 ? `0` + (index + 1) : index + 1}
			</h1>

			<div>
				<div className="flex gap-2 items-center mb-7">
					<img src={profile_img} alt="" className="w-6 h-6 rounded-full" />
					<p className="line-clamp-1">
						{fullname} @{username}
					</p>
					<p className="min-w-fit">{getDay(publishedAt)}</p>
				</div>

				<h1 className="blog-title">{title}</h1>
			</div>
		</Link>
	);
};

export default MinimalBlogPost;
