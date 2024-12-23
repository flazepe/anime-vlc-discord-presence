import { Client } from "discord-rpc";
import { pid } from "discord-rpc/src/util.js";
import { config, getVideoPlayerStatus } from "./utils/index.js";

const client = new Client({ transport: "ipc" });

let previousState = "";

async function setActivity() {
	const status = await getVideoPlayerStatus();
	if (!status) return client.clearActivity();

	// Activity
	const activity = {
		type: 3,
		details: status.title.title,
		assets: {
			large_image: config.LIST_SERVICE,
			large_text: config.LIST_USERNAME,
			small_image: status.state.toLowerCase(),
			small_text: status.state
		}
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
	await client.request("SET_ACTIVITY", { pid: pid(), activity }).catch(console.error);
}

client.on("ready", () => {
	console.info(`Logged in as ${client.user.username}`);
	setActivity();
	setInterval(() => setActivity(), 10000);
});

client.login({ clientId: "675539512910151691" }).catch(console.error);
