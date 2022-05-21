<script>
  import Authentication from '$lib/components/authentication.svelte';
  import SpotifyPlayer from "$lib/components/spotifyPlayer.svelte";
  import ArtistAnswers from "$lib/components/artistAnswers.svelte";
  import { token } from "$lib/stores/authenication.js";
  import { getAllFollowedArtists, getAllArtistsTracks } from "$lib/spotifyApi/requests";

  async function load(){
    let tracks = [];

    if (!localStorage.getItem('artists')){
      let artists = await getAllFollowedArtists("https://api.spotify.com/v1/me/following?type=artist&limit=50", $token)

      localStorage.setItem('artists', JSON.stringify(artists));
      console.log("Saved artists in local storage");
    }
    
    if (!localStorage.getItem('tracks')){
      for (const artist of artists) {
        let artistTracks = await getAllArtistsTracks("https://api.spotify.com/v1/artists/" + artist.id + "/top-tracks?market=gb", $token)

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

      localStorage.setItem('tracks', JSON.stringify(tracks));

      console.log("Saved tracks in local storage");
    }
  }
</script>

{#if $token == null}
<Authentication/>
{:else}
<p>Connected To Spotify</p>
<button on:click="{() => load()}">Load</button>
<SpotifyPlayer/>
<ArtistAnswers/>
{/if}