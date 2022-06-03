function validEp(episode) {
	return episode && !isNaN(episode[1]);
}

function getEpisode(details) {
	let parts = [details];

	if (details.includes("-")) {
		parts = parts.concat(details.slice(0, details.indexOf("-")).trim());
		parts = parts.concat(details.slice(details.indexOf("-") + 1).trim());
	}

	for (const part of parts) {
		// ep1, episode 1, e1
		let match = part.match(/(episode\s?|ep|e)(\d+)/i);
		if (match && !isNaN(match[2])) return [part.replace(match[0], ""), match[2]];

		// 5x3 (season 5 ep 3)
		match = part.match(/\d+x(\d+)/i);
		if (validEp(match)) return [part.replace(match[0], ""), match[1]];

		// 1v3 (episode 1 season 3)
		match = part.match(/(\d+)v\d+/i);
		if (validEp(match)) return [part.replace(match[0], ""), match[1]];

		// 1 (just the number, at the end)
		match = part.match(/(\d+)$/i);
		if (validEp(match)) return [part.replace(match[0], ""), match[1]];

		// 1 (just the number, anywhere)
		match = part.match(/(\d+)/i);
		if (validEp(match)) return [part.replace(match[0], ""), match[1]];
	}

	return [parts[0].trim(), ""];
}

module.exports = function (originalTitle) {
	let title = originalTitle.trim().replace(/&amp;#\d{1,4};/g, _match => String.fromCharCode(_match.slice(6, -1)));

	// Video extensions
	if (originalTitle.includes(".mkv") || originalTitle.includes(".mp4")) title = title.slice(0, -4);

	// Brackets
	if (originalTitle.includes("]")) title = title.replace(/[\s_.]*\[[^\]]*\][\s_.]*/g, "");

	// Parentheses
	if (originalTitle.includes(")")) title = title.replace(/ *\([^)]*\) */g, "");

	// Delimiters
	if (!originalTitle.includes(" ")) title = title.split(/[._]/).join(" ");

	const parsed = getEpisode(title);

	return {
		title: parsed[0].split("-")[0].trim(),
		episode: parsed[1]
	};
};
