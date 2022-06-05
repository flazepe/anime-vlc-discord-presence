function getEpisode(details) {
	let parts = [details];

	for (const part of parts) {
		// ep1, episode 1, e1
		let match = part.match(/(episode\s?|ep|e)(\d+)/i);
		if (!isNaN(match?.[2])) return [part.replace(match[0], ""), match[2]];

		// 5x3 (season 5 ep 3)
		match = part.match(/\b\d+x(\d+)\b/i);
		if (!isNaN(match?.[1])) return [part.replace(match[0], ""), match[1]];

		// 1v3 (episode 1 season 3)
		match = part.match(/\b(\d+)v\d+\b/i);
		if (!isNaN(match?.[1])) return [part.replace(match[0], ""), match[1]];

		// 1 (just the number, at the end)
		match = part.match(/\b\d+$/);
		if (!isNaN(match?.[0])) return [part.replace(/\b\d+$/, ""), match[0]];

		// 1 (just the number, anywhere)
		match = part.match(/(\d+)/i);
		if (!isNaN(match?.[1])) return [part.replace(match[0], ""), match[1]];
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
		title: parsed[0],
		episode: parsed[1]
	};
};
