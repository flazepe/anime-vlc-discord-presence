function matchTitleAndEpisode(details) {
	let season = "1",
		episode;

	// S5 E3, S5E3 (Season 5 Episode 3)
	let match = details.match(/\bs(\d+) ?e(\d+)\b/i);

	if (![match?.[1], match?.[2]].some(isNaN)) {
		details = details.replace(match[0], "");
		season = match[1];
		episode = match[2];
	}

	// 5x3, 3v5 (Season 5 Episode 3)
	match = details.match(/\b\d+(x|v)\d+\b/i)?.[0].toLowerCase();

	if (match) {
		const seasonFirst = match.includes("x"),
			split = match.split(seasonFirst ? "x" : "v");

		if (!split.some(isNaN)) {
			details = details.replace(match, "");
			season = seasonFirst ? split[0] : split[1];
			episode = seasonFirst ? split[1] : split[0];
		}
	}

	// Season 1, Season1, S1
	match = details.match(/\b(season ?|s) ?(\d+)\b/i);

	if (!isNaN(match?.[2])) {
		details = details.replace(match[0], "");
		season = match[2];
	}

	// Episode 1, Episode1, Ep.1, EP1, E1
	match = details.match(/\b(episode|ep?\.?) ?(\d+)\b/i);

	if (!isNaN(match?.[2])) {
		details = details.replace(match[0], "");
		episode = match[2];
	}

	// 1 (just the number, at the end)
	match = details.match(/\b\d+$/);
	if (!isNaN(match?.[0])) {
		details = details.slice(0, -match[0].length);
		episode = match[0];
	}

	return episode
		? [
				details
					.trim()
					.replace(/- *(?=-)| *-$/g, "")
					.trim(),
				`${Number(season) === 1 ? "" : `Season ${Number(season)} `}Episode ${Number(episode)}`
		  ]
		: [details, ""];
}

module.exports = function (originalTitle) {
	// Omit video extensions
	if (originalTitle.endsWith(".mkv") || originalTitle.endsWith(".mp4")) originalTitle = originalTitle.slice(0, -4);

	// Decode stupid HTML entities
	originalTitle = originalTitle.trim().replace(/&amp;#\d{1,4};/g, _match => String.fromCharCode(_match.slice(6, -1)));

	// Remove brackets and parentheses
	originalTitle = originalTitle.replace(/(\[|\()(.+?)(\]|\))/g, "");

	// Sanitize whitespaces
	originalTitle = originalTitle.split(/\s+|[._]/).join(" ");

	const [title, episode] = matchTitleAndEpisode(originalTitle.trim());
	return { title, episode };
};
