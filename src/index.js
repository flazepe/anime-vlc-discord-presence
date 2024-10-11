import DiscordRPC from "discord-rpc";
import { pid } from "discord-rpc/src/util.js";
import { config, getVLCStatus, parseTitle } from "./utils/index.js";

const rpc = new DiscordRPC.Client({ transport: "ipc" });

let previousState = "";

async function setActivity() {
	const vlcStatus = await getVLCStatus();
	if (!vlcStatus) return rpc.clearActivity();

	// Parse title
	const parsedTitle = parseTitle(vlcStatus.title);

	// Capitalize state
	vlcStatus.state = vlcStatus.state[0].toUpperCase() + vlcStatus.state.slice(1);

	// Activity
	const activity = {
		type: 3,
		details: parsedTitle.title,
		assets: {
			large_image: config.LIST_SERVICE,
			large_text: config.LIST_USERNAME,
			small_image: vlcStatus.state.toLowerCase(),
			small_text: vlcStatus.state,
		},
	};

	// Set episode
	if (parsedTitle.episode) activity.state = parsedTitle.episode;

	// Set time remaining
	if (vlcStatus.state == "Playing") {
		const start = Date.now() - Math.round(vlcStatus.time * 1000),
			end = start + Math.round(vlcStatus.length * 1000);

		activity.timestamps = { start, end };
	}

	// Log state change
	if (vlcStatus.state !== previousState) {
		console.info(`${vlcStatus.state} "${parsedTitle.title}" - ${parsedTitle.episode}`);
		previousState = vlcStatus.state;
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
