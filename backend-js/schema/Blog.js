import mongoose, { Schema } from "mongoose";

const blogSchema = Schema(
	{
		blog_id: {
			type: String,
			required: true,
			unique: true,
		},
		title: {
			type: String,
			required: true,
		},
		banner: {
			type: String,
			// required: true
		},
		des: {
			type: String,
			maxLength: 200,
		},
		content: {
			type: [],
			// required: true,
		},
		tags: {
			type: [String],
		},
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "user",
		},
		activity: {
			total_likes: {
				type: Number,
				default: 0,
			},
			total_comments: {
				type: Number,
				default: 0,
			},
			total_reads: {
				type: Number,
				default: 0,
			},
			total_parent_comments: {
				type: Number,
				default: 0,
			},
		},
		comments: {
			type: [Schema.Types.ObjectId],
			ref: "comment",
		},
		draft: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: {
			createdAt: "publishedAt",
		},
	}
);

export default mongoose.model("blog", blogSchema);
