import { useContext, useState } from "react";
import { Navigate } from "react-router";
import { UserContext } from "../App";
import BlogEditor from "./blog-editor.component";
import PublishForm from "./publish-form.component";

const Editor = () => {
	const [editorState, setEditorState] = useState("editor");

	const { userAuth, setUserAuth } = useContext(UserContext);

	return userAuth?.access_token === null ? (
		<Navigate to="/signin" />
	) : editorState === "editor" ? (
		<BlogEditor />
	) : (
		<PublishForm />
	);
};

export default Editor;
