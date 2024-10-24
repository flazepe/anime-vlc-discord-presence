import "dotenv/config";
import { VIDEO_PLAYERS } from "./getVideoPlayerStatus.js";

const VIDEO_PLAYER = process.env.VIDEO_PLAYER?.toLowerCase(),
	LIST_SERVICE = process.env.LIST_SERVICE?.toLowerCase();

export default {
	VIDEO_PLAYER: Object.keys(VIDEO_PLAYERS).includes(VIDEO_PLAYER) ? VIDEO_PLAYER : "vlc",
	VLC_HTTP_PASSWORD: process.env.VLC_HTTP_PASSWORD,
	VLC_HTTP_PORT: process.env.VLC_HTTP_PORT || 8080,
	MPC_HC_HTTP_PORT: process.env.MPC_HC_HTTP_PORT || 13579,
	LIST_SERVICE: ["anilist", "myanimelist", "kitsu"].includes(LIST_SERVICE) ? LIST_SERVICE : "anilist",
	LIST_USERNAME: process.env.LIST_USERNAME || "No username set",
};
