import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";
import User from "./schema/user.js";
import { nanoid } from "nanoid";
import cors from "cors";
import jwt from "jsonwebtoken";
import serviceAccountKey from "./blog-app-demo-1c186-firebase-adminsdk-fbsvc-b338714ab5.json" with {type: 'json'}
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import multer  from "multer";
import {uploadOnCloudinary} from './cloudinary.js'


const PORT = 3000 || process.env.PORT;

const server = express();

admin.initializeApp({
	credential: admin.credential.cert(serviceAccountKey),
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors({ origin: true, credentials: true }));


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, './tmp')
	},
	filename: function (req, file, cb) {
	  
	  cb(null, file.originalname)
	}
  })
const upload = multer({
	storage: storage
})

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.DB_URL, {
	autoIndex: true,
});

const formatDataToSend = (user) => {
	const access_token = jwt.sign(
		{
			id: user._id,
		},
		process.env.JWT_SECRET
	);

	return {
		access_token,
		profile_img: user.personal_info.profile_img,
		username: user.personal_info.username,
		password: user.personal_info.password,
	};
};

const generateUserName = async (email) => {
	let username = email.split("@")[0];

	let isUsernameNotUnique = await User.exists({
		"personal_info.username": username,
	}).then((result) => result);

	isUsernameNotUnique ? (username += nanoid().substring(0, 5)) : "";

	return username;
};


server.post('/upload-banner', upload.single('banner'),async (req, res, next) => {
	const bannerPath = req.file?.path;

	if(bannerPath){
		const banner = await uploadOnCloudinary(bannerPath)
		res.status(200).json({
			uploadUrl : banner.secure_url
		})
	}

} )


server.post("/signup", (req, res, next) => {
	const { fullname, email, password } = req.body;

	if (fullname.length < 3)
		return res.status(403).json({
			error: "fullname must be atleast 3 letters long",
		});
	if (!email.length) return res.status(403).json({ error: "Enter Email" });
	if (!emailRegex.test(email))
		return res.status(403).json({
			error: "Email is invalid",
		});
	if (!passwordRegex.test(password))
		return res.status(403).json({
			error:
				"Password should be 6 to 20 characters long with a numeric, 1 lowercase adn 1 uppercase letters",
		});

	bcrypt.hash(password, 10, async (err, hashedPassword) => {
		let username = await generateUserName(email);

		let user = new User({
			personal_info: { fullname, email, password: hashedPassword, username },
		});

		user
			.save()
			.then((usr) => {
				return res.status(200).json(formatDataToSend(usr));
			})
			.catch((err) => {
				if (err.code === 11000)
					return res.status(500).json({ error: "Email already exists" });
			});
	});
});

server.post("/signin", (req, res, next) => {
	let { email, password } = req.body;

	User.findOne({
		"personal_info.email": email,
	})
		.then((user) => {
			if (!user) {
				return res.status(403).json({
					error: "Email is not found",
				});
			}

			if(!user.google_auth){
				bcrypt.compare(password, user.personal_info.password, (err, result) => {
					if (err)
						return res.status(403).json({
							error: "Error occured while login, Please try again",
						});
					if (!result) {
						return res.status(403).json({
							error: "Incorrect password",
						});
					} else return res.status(200).json(formatDataToSend(user));
				});
			}
			else {
				return res.status(403).json({
					error: 'Account was created using google. Try logging in with Google'
				})
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: err.message,
			});
		});
});

server.post("/google-auth", async (req, res, next) => {
	let { access_token } = req.body;

	getAuth()
		.verifyIdToken(access_token)
		.then(async (decodeUser) => {
			let { email, name, picture } = decodeUser;

			picture = picture.replace("s96-c", "s384-c");

			let user = await User.findOne({ "personal_info.email": email })
				.select(
					"personal_info.fullname personal_info.username personal_info.profile_img google_auth"
				)
				.then((u) => {
					return u || null;
				})
				.catch((err) => {
					return res.status(500).json({
						error: err.message,
					});
				});

			if (user) {
				if (!user.google_auth) {
					return res.status(403).json({
						error:
							"This email was signed up without google. Please log in with a password to access the account",
					});
				}
			} else {
				let username = await generateUserName(email);
				user = new User({
					personal_info: {
						fullname: name,
						email,
						profile_img: picture,
						username,
					},
					google_auth: true,

				});

				await user.save().then((u)=> {
					user = u
				}).catch((err)=> {
					return res.status(500).json({
						error: err.message
					})
				})
			}

			return res.status(200).json(formatDataToSend(user))


		}).catch(err => {
			return res.status(500).json({
				error: 'Failed to authenicate you with google. Try with some other google account'
			})
		});
});

server.listen(process.env.PORT || PORT, () => {
	console.log(`Server is listening on PORT ${PORT}`);
});
