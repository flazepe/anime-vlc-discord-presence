const config = require("./config"),
	rpc = new (require("discord-rpc").Client)({ transport: "ipc" });

let previousState = "";

async function setActivity() {
	const vlcStatus = await require("./getVLCStatus")();
	if (!vlcStatus) return rpc.clearActivity();

	// Parse title
	const parsedTitle = require("./parseTitle")(vlcStatus.title);

	// Capitalize state
	vlcStatus.state = vlcStatus.state[0].toUpperCase() + vlcStatus.state.slice(1);

	// Activity
	const activity = {
		details: parsedTitle.title,
		largeImageKey: config.LIST_SERVICE,
		largeImageText: config.LIST_USERNAME,
		smallImageKey: vlcStatus.state.toLowerCase(),
		smallImageText: vlcStatus.state
	};

	// Set episode
	if (parsedTitle.episode) activity.state = `Episode ${parsedTitle.episode}`;

	// Set time remaining
	if (vlcStatus.state == "Playing") activity.endTimestamp = Math.round(Date.now() / 1000 + (vlcStatus.length - vlcStatus.time));

	// Log state change
	if (vlcStatus.state !== previousState) {
		console.info(`${vlcStatus.state} "${parsedTitle.title}" - Episode ${parsedTitle.episode}`);
		previousState = vlcStatus.state;
	}

	// Set activity
	rpc.setActivity(activity);
}

rpc.on("ready", () => {
	console.info(`Logged in as ${rpc.user.username}`);
	setActivity();
	setInterval(() => setActivity(), 10000);
});

rpc.login({ clientId: "675539512910151691" }).catch(console.error);
