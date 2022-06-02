require("dotenv").config();

const LIST_SERVICE = process.env.LIST_SERVICE?.toLowerCase();

module.exports = {
	VLC_PASSWORD: process.env.VLC_PASSWORD,
	VLC_PORT: process.env.VLC_PORT || 8080,
	LIST_SERVICE: ["anilist", "myanimelist", "kitsu"].includes(LIST_SERVICE) ? LIST_SERVICE : "anilist",
	LIST_USERNAME: process.env.LIST_USERNAME || "No username set"
};
