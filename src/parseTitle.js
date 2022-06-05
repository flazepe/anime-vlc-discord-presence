function matchTitleAndEpisode(details) {
	// Episode 1, Ep.1, EP1, E1
	let match = details.match(/\b(episode\s?|ep?\.?\s?|e)(\d+)\b/i);
	if (!isNaN(match?.[2])) return [details.replace(match[0], ""), match[2]];

	// 5x3 (Season 5 Episode 3)
	match = details.match(/\b\d+x(\d+)\b/i);
	if (!isNaN(match?.[1])) return [details.replace(match[0], ""), match[1]];

	// 1v3 (Episode 1 Season 3)
	match = details.match(/\b(\d+)v\d+\b/i);
	if (!isNaN(match?.[1])) return [details.replace(match[0], ""), match[1]];

	// 1 (just the number, at the end)
	match = details.match(/\b\d+$/);
	if (!isNaN(match?.[0])) return [details.slice(0, -match[0].length), match[0]];

	/* This is usually unreliable, let's not get desperate
	// 1 (just the number, anywhere)
	match = details.match(/\d+/);
	if (!isNaN(match?.[0])) return [details.replace(match[0], ""), match[0]];
	*/

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
			// Trim "-" at the end for some reason
			.replace(/\s*-\s*$/g, "")
			// Delimiters + omit more than one space
			.split(/\s+|[._]/)
			.join(" "),
		episode: Number(episode)
	};
};
