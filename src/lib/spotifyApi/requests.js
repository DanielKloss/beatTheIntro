export async function getAllFollowedArtists(url, token) {
	let artists = [];
	const response = await fetch(url, {
		headers: { Authorization: 'Bearer ' + token }
	});
	const formattedResponse = await response.json();

	for (const artist of formattedResponse['artists']['items']) {
		artists.push({
			href: artist['href'],
			id: artist['id'],
			name: artist['name'],
			uri: artist['uri']
		});
	}

	let nextPage = formattedResponse['artists']['next'];

	if (nextPage != null) {
		const response = await getAllFollowedArtists(nextPage, token);
		artists = artists.concat(response);
	}

	return artists;
}

export async function getAllArtistsTracks(url, token) {
	let tracks = [];

	const response = await fetch(url, {
		headers: { Authorization: 'Bearer ' + token }
	});
	const formattedResponse = await response.json();

	for (const track of formattedResponse['tracks']) {
		tracks.push({
			album: track['album']['name'],
			name: track['name'],
			uri: track['uri']
		});
	}

	return tracks;
}
