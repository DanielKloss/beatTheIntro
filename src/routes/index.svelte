<script>
  import Authentication from '$lib/components/authentication.svelte';
  import { token } from "$lib/stores/authenication.js";
  import { getAllFollowedArtists, getAllArtistsTracks } from '$lib/spotifyApi/requests';

  async function play(){
    let tracks = [];

    let artists = await getAllFollowedArtists("https://api.spotify.com/v1/me/following?type=artist&limit=50", token)
    
    for (const artist of artists) {
      let artistTracks = await getAllArtistsTracks("https://api.spotify.com/v1/artists/" + artist.id + "/top-tracks?market=gb", token)

      for (const track of artistTracks) {
        track.artist = {
          name: artist.name,
          href: artist.href,
          id: artist.id,
          uri: artist.uri
        };
        tracks.push(track);
      }
    }
  }

</script>

{#if token == null}
<Authentication/>
{:else}
<p>Connected To Spotify</p>
<button on:click="{() => play()}">Play</button>
{/if}