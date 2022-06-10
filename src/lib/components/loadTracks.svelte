<script>
    import { getAllFollowedArtists, getAllArtistsTracks } from "$lib/spotifyApi/requests";
    import { token } from "$lib/stores/authenication.js";

    async function loadTracks(){
        let artists = JSON.parse(localStorage.getItem('artists'));

        if (artists == null){
            artists = await getAllFollowedArtists("https://api.spotify.com/v1/me/following?type=artist&limit=50", $token)

            localStorage.setItem('artists', JSON.stringify(artists));
            console.log("Saved artists in local storage");
        } else {
            console.log("artists loaded from local storage")
        }

        let tracks = localStorage.getItem('tracks');
        
        if (tracks == null){
            tracks = [];
            for (const artist of artists) {
                let artistTracks = await getAllArtistsTracks("https://api.spotify.com/v1/artists/" + artist.id + "/top-tracks?market=gb", $token)

                for (const track of artistTracks) {
                    track.artist = {
                        name: artist.name,
                        href: artist.href,
                        id: artist.id,
                        duration: artist.uri
                    };
                    tracks.push(track);
                }
            }

            localStorage.setItem('tracks', JSON.stringify(tracks));

            console.log("Saved tracks in local storage");
        } else {
            console.log("tracks loaded from local storage")
        }
    }
</script>

<div class="container mx-auto px-12 text-center flex flex-col gap-4">
    <p class="font-bold">Connected to your Spotify account.</p>
    <p>Beat the Intro currently only uses artist's you have 'favourited' with a green heart. If you have not favourited any (or many) artists, go into your spotify and add a few now.</p>
    <p>When you're done. Click the button below to sync your tracks with Beat the Intro.</p>
    <button class="btn" on:click="{() => loadTracks()}">Load Tracks</button>
</div>