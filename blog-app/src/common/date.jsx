let months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

let days = ["sunday", "monday", "tuesday", "thrusday", "friday", "saturday"];

export const getDay = (timestamp) => {
	let date = new Date(timestamp);

	return `${date.getDate()} ${months[date.getMonth()]}`;
};
