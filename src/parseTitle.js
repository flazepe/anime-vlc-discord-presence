function matchTitleAndEpisode(details) {
	// S5 E3, S5E3 (Season 5 Episode 3)
	let match = details.match(/\bs(\d+)\s?e(\d+)\b/i);
	if (!isNaN(match?.[1]) && !isNaN(match?.[2])) return [details.replace(match[0], ""), `Season ${Number(match[1])} Episode ${Number(match[2])}`];

	// 5x3, 3v5 (Season 5 Episode 3)
	match = details.match(/\b\d+(x|v)\d+\b/i)?.[0].toLowerCase();

	if (match) {
		const seasonFirst = match.includes("x"),
			split = match.split(seasonFirst ? "x" : "v").map(Number);

		if (split.every(_entry => !isNaN(_entry)))
			return [details.replace(match, ""), `Season ${seasonFirst ? split[0] : split[1]} Episode ${seasonFirst ? split[1] : split[0]}`];
	}

	// Episode 1, Ep.1, EP1, E1
	match = details.match(/\b(episode\s?|ep?\.?\s?|e)(\d+)\b/i);
	if (!isNaN(match?.[2])) return [details.replace(match[0], ""), `Episode ${Number(match[2])}`];

	// 1 (just the number, at the end)
	match = details.match(/\b\d+$/);
	if (!isNaN(match?.[0])) return [details.slice(0, -match[0].length), `Episode ${Number(match[0]).toString()}`];

	return [details, ""];
}

module.exports = function (originalTitle) {
	// Omit video extensions
	if (originalTitle.endsWith(".mkv") || originalTitle.endsWith(".mp4")) originalTitle = originalTitle.slice(0, -4);

	// Decode stupid HTML entities
	originalTitle = originalTitle.trim().replace(/&amp;#\d{1,4};/g, _match => String.fromCharCode(_match.slice(6, -1)));

	// Remove brackets and parentheses
	originalTitle = originalTitle.replace(/(\[|\()(.+?)(\]|\))/g, "");

	const [title, episode] = matchTitleAndEpisode(originalTitle.trim());

	return {
		title: title
			// Split by delimiters + omit more than one space
			.split(/\s+|[._]/)
			.join(" ")
			.trim()
			// Miscellaneous stuff
			.replace(/- -/g, "-")
			.replace(/\s*-$/, ""),
		episode
	};
};
