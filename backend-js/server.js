import express from "express";

const PORT = 3000 || process.env.PORT;

const server = express();

server.listen(process.env.PORT || PORT, () => {
	console.log(`Servre is listening on PORT ${PORT}`);
});
