import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import axios from "axios";

const uploadImageByUrl = (e) => {
	let link = new Promise((resolve, reject) => {
		try {
			resolve(e);
		} catch (err) {
			reject(err);
		}
	});

	return link.then((url) => {
		return {
			success: 1,
			file: { url },
		};
	});
};

const uploadImageByFile = (e) => {
	const formData = new FormData();
	formData.append("img", e);

	return axios
		.post(import.meta.env.VITE_SERVER_DOMAIN + "/upload-img", formData)
		.then((res) => {
			if (res) {
				return {
					success: 1,
					file: {
						url: res.data.imgUrl,
					},
				};
			}
		});
};

export const tools = {
	embed: Embed,
	list: {
		class: List,
		inlineToolbar: true,
	},
	image: {
		class: Image,
		config: {
			uploader: {
				uploadByUrl: uploadImageByUrl,
				uploadByFile: uploadImageByFile,
			},
		},
	},
	header: {
		class: Header,
		config: {
			placeholder: "Type Heading...",
			levels: [2, 3],
			defaultLevels: 2,
		},
	},
	quote: {
		class: Quote,
		intlieToolbar: true,
	},
	marker: Marker,
	inlineCode: InlineCode,
};
