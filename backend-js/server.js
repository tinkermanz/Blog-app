import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";

const PORT = 3000 || process.env.PORT;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_URL, {
	autoIndex: true,
});

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

	bcrypt.hash(password, 10, (err, hashedPassword) => {
		console.log(hashedPassword);
	});
	res.json(req.body);
});

server.listen(process.env.PORT || PORT, () => {
	console.log(`Server is listening on PORT ${PORT}`);
});
