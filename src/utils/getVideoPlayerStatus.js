import { config, parseTitle } from "./index.js";

export const VIDEO_PLAYERS = {
	vlc: {
		title: ["<info name='filename'>", value => parseTitle(value)],
		length: ["<length>", value => value * 1000],
		time: ["<time>", value => value * 1000],
		state: ["<state>", value => value[0].toUpperCase() + value.slice(1)]
	},
	"mpc-hc": {
		title: ['<p id="file">', value => parseTitle(value)],
		length: ['<p id="duration">', value => value],
		time: ['<p id="position">', position => position],
		state: ['<p id="state">', state => ["Stopped", "Paused", "Playing"][state]]
	}
};

class XML {
	constructor(xml) {
		this.xml = xml;
	}

	getTagValue(tag) {
		const tagIndex = this.xml.indexOf(tag);
		if (tagIndex === -1) return null;

		const closingTagIndex = this.xml.indexOf(`</${tag.split(" ")[0].slice(1)}${tag.includes(" ") ? ">" : ""}`, tagIndex);
		return closingTagIndex === -1 ? null : this.xml.slice(tagIndex + tag.length, closingTagIndex);
	}
}

export default async function () {
	try {
		let url = `http://127.0.0.1:${config.VLC_HTTP_PORT}/requests/status.xml`,
			headers = { authorization: `Basic ${Buffer.from(`:${config.VLC_HTTP_PASSWORD}`).toString("base64")}` };

		if (config.VIDEO_PLAYER === "mpc-hc") (url = `http://127.0.0.1:${config.MPC_HC_HTTP_PORT}/variables.html`), (headers = {});

		const xml = new XML(await (await fetch(url, { headers })).text()),
			status = Object.fromEntries(
				Object.entries(VIDEO_PLAYERS[config.VIDEO_PLAYER]).map(([key, [tag, fn]]) => [key, fn(xml.getTagValue(tag) ?? "")])
			);

		return Object.values(status).every(Boolean) && ["Playing", "Paused"].includes(status.state) ? status : null;
	} catch {
		return null;
	}
}
