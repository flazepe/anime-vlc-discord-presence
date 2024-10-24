import DiscordRPC from "discord-rpc";
import { pid } from "discord-rpc/src/util.js";
import { config, getVideoPlayerStatus } from "./utils/index.js";

const rpc = new DiscordRPC.Client({ transport: "ipc" });

let previousState = "";

async function setActivity() {
	const status = await getVideoPlayerStatus();
	if (!status) return rpc.clearActivity();

	// Activity
	const activity = {
		type: 3,
		details: status.title.title,
		assets: {
			large_image: config.LIST_SERVICE,
			large_text: config.LIST_USERNAME,
			small_image: status.state.toLowerCase(),
			small_text: status.state,
		},
	};

	// Set episode
	if (status.title.episode) activity.state = status.title.episode;

	// Set time remaining
	if (status.state == "Playing") {
		const start = Date.now() - Math.round(status.time),
			end = start + Math.round(status.length);

		activity.timestamps = { start, end };
	}

	// Log state change
	if (status.state !== previousState) {
		console.info(`${status.state} "${status.title.title}" - ${status.title.episode}`);
		previousState = status.state;
	}

	// Set activity
	await rpc.request("SET_ACTIVITY", { pid: pid(), activity }).catch(console.error);
}

rpc.on("ready", () => {
	console.info(`Logged in as ${rpc.user.username}`);
	setActivity();
	setInterval(() => setActivity(), 10000);
});

rpc.login({ clientId: "675539512910151691" }).catch(console.error);
