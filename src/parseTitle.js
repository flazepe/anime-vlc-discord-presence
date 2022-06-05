function getTitleAndEpisode(details) {
	let parts = [details];

	for (const part of parts) {
		// Episode 1, Ep.1, EP1, E1
		let match = part.match(/(episode\s?|ep?\.?\s?|e)(\d+)/i);
		if (!isNaN(match?.[2])) return [part.replace(match[0], ""), match[2]];

		// 5x3 (Season 5 Episode 3)
		match = part.match(/\b\d+x(\d+)\b/i);
		if (!isNaN(match?.[1])) return [part.replace(match[0], ""), match[1]];

		// 1v3 (Episode 1 Season 3)
		match = part.match(/\b(\d+)v\d+\b/i);
		if (!isNaN(match?.[1])) return [part.replace(match[0], ""), match[1]];

		// 1 (just the number, at the end)
		match = part.match(/\b\d+$/);
		if (!isNaN(match?.[0])) return [part.replace(/\b\d+$/, ""), match[0]];

		/* This is usually unreliable, let's not get desperate
		// 1 (just the number, anywhere)
		match = part.match(/\d+/);
		if (!isNaN(match?.[0])) return [part.replace(match[0], ""), match[0]];
		*/
	}

	return [parts[0].trim(), ""];
}

module.exports = function (originalTitle) {
	// Stupid HTML entities
	originalTitle = originalTitle.trim().replace(/&amp;#\d{1,4};/g, _match => String.fromCharCode(_match.slice(6, -1)));

	// Video extensions
	if (originalTitle.endsWith(".mkv") || originalTitle.endsWith(".mp4")) originalTitle = originalTitle.slice(0, -4);

	// Brackets
	if (originalTitle.includes("]")) originalTitle = originalTitle.replace(/[\s_.]*\[[^\]]*\][\s_.]*/g, "");

	// Parentheses
	if (originalTitle.includes(")")) originalTitle = originalTitle.replace(/ *\([^)]*\) */g, "");

	// Delimiters
	if (!originalTitle.includes(" ")) originalTitle = originalTitle.split(/[._]/).join(" ");

	const [title, episode] = getTitleAndEpisode(originalTitle);
	return { title, episode };
};
