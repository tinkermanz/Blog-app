import { createContext, useContext, useState } from "react";
import { Navigate } from "react-router";
import { UserContext } from "../App";
import BlogEditor from "./blog-editor.component";
import PublishForm from "./publish-form.component";
import defaultBanner from "../imgs/blog banner.png";

const blogStructure = {
	title: "",
	banner: defaultBanner,
	content: [],
	tags: [],
	des: "",
	author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
	const [blog, setBlog] = useState(blogStructure);
	const [editorState, setEditorState] = useState("editor");

	const { userAuth, setUserAuth } = useContext(UserContext);

	return (
		<EditorContext.Provider
			value={{
				blog,
				setBlog,
				editorState,
				setEditorState,
			}}
		>
			{userAuth?.access_token === null ? (
				<Navigate to="/signin" />
			) : editorState === "editor" ? (
				<BlogEditor />
			) : (
				<PublishForm />
			)}
		</EditorContext.Provider>
	);
};

export default Editor;
