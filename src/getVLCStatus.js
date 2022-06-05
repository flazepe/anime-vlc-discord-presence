const config = require("./config");

class XML {
	constructor(xml) {
		this.xml = xml;
	}

	getTagValue(tag) {
		const tagIndex = this.xml.indexOf(tag);
		if (tagIndex === -1) return null;

		const closingTagIndex = this.xml.indexOf(`</${tag.split(" ")[0].slice(1)}${tag.includes(" ") ? ">" : ""}`, tagIndex);
		if (closingTagIndex === -1) return null;

		return this.xml.slice(tagIndex + tag.length, closingTagIndex);
	}
}

module.exports = async function () {
	try {
		const xml = new XML(
			await (
				await require("node-fetch")(`http://localhost:${config.VLC_PORT}/requests/status.xml`, {
					headers: {
						authorization: `Basic ${Buffer.from(`:${config.VLC_PASSWORD}`).toString("base64")}`
					}
				})
			).text()
		);

		const status = {
			title: xml.getTagValue("<info name='filename'>"),
			length: xml.getTagValue("<length>"),
			time: xml.getTagValue("<time>"),
			state: xml.getTagValue("<state>")
		};

		return Object.values(status).every(Boolean) ? status : null;
	} catch {
		return null;
	}
};
