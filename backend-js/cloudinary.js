import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

console.log(process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
	try {
		if (!localFilePath) return null;

		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
		});

		console.log(response);

		fs.unlinkSync(localFilePath);

		console.log("file is uploaded on cloudinary");

		return response;
	} catch (error) {
		console.log(error);
		fs.unlinkSync(localFilePath);
	}
};

export { uploadOnCloudinary };
