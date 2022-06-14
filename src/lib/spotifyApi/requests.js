async function api(url, token) {
	const response = await fetch(url, {
		headers: { Authorization: 'Bearer ' + token }
	});
	return await response.json();
}

export async function getAllFollowedArtists(url, token) {
	let artists = [];
	
	let response = await api(url, token);

	for (const artist of response['artists']['items']) {
		artists.push({
			href: artist['href'],
			id: artist['id'],
			name: artist['name'],
			uri: artist['uri']
		});
	}

	let nextPage = response['artists']['next'];

	if (nextPage != null) {
		const response = await getAllFollowedArtists(nextPage, token);
		artists = artists.concat(response);
	}

	return artists;
}

export async function getAllArtistsTracks(url, token) {
	let tracks = [];

	let response = await api(url, token);

	for (const track of response['tracks']) {
		tracks.push({
			album: track['album']['name'],
			name: track['name'],
			uri: track['uri'],
			duration: track['duration_ms']
		});
	}

	return tracks;
}