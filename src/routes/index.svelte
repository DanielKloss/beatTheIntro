<script>
  import Authentication from '$lib/components/authentication.svelte';
  import SpotifyPlayer from "$lib/components/spotifyPlayer.svelte";
  import ArtistAnswers from "$lib/components/artistAnswers.svelte";
  import { token } from "$lib/stores/authenication.js";
  import { getAllFollowedArtists, getAllArtistsTracks } from "$lib/spotifyApi/requests";
  import { score } from "$lib/stores/score.js";

  async function load(){
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
            uri: artist.uri
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

{#if $token == null}
<Authentication/>
{:else}
<p>Connected To Spotify</p>
<button on:click="{() => load()}">Load</button>
<SpotifyPlayer/>
<br>
{$score}
<br>
<ArtistAnswers/>
{/if}