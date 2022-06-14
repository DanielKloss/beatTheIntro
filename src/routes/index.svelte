<script>
  import { onMount } from 'svelte';
  import Authentication from '$lib/components/authentication.svelte';
  import SpotifyPlayer from "$lib/components/spotifyPlayer.svelte";
  import ArtistAnswers from "$lib/components/artistAnswers.svelte";
  import LoadTracks from "$lib/components/loadTracks.svelte";
  import { score, questionNumber } from "$lib/stores/gameVars.js";
  import { token } from "$lib/stores/authenication.js";

  let tracksLoaded;

  function checkTracksLoaded(){
    tracksLoaded = localStorage.getItem('tracks') == undefined;
  }

  onMount(async () => {
    checkTracksLoaded();
  });

// IMPROVMENTS
// 1 - include all favourite songs, albums, artists and playlists
// 2 - database leaderboard
// 3 - guess artists and song mode
// 4 - 

</script>

{#if $token == null}
  <Authentication/>
{:else}
  {#if tracksLoaded}
    <LoadTracks on:tracksSaved={checkTracksLoaded}/>
  {:else}
    <div class="container mx-auto px-16 text-center flex flex-col gap-4 mt-8">
      {#if $questionNumber > 10}
        <p>Well done! You scored {$score} points!</p>
        <p class="font-bold">Thanks for playing</p>
        <p class="font-bold">What improvements/ additions would you like to see in future Beat the Intro versions?</p>
      {/if}
      <SpotifyPlayer/>
      <div class="flex flex-col">
        <p>Track Number: {$questionNumber}</p>
        <p>Score: {$score}</p>
      </div>
      <ArtistAnswers/>
    </div>
  {/if}
{/if}