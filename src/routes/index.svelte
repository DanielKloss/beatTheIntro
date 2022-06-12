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
</script>

{#if $token == null}
  <Authentication/>
{:else}
  {#if tracksLoaded}
    <LoadTracks on:tracksSaved={checkTracksLoaded}/>
  {:else if $questionNumber > 10}
    <div class="container mx-auto px-16 text-center flex flex-col gap-4 mt-8">
      Well done! You scored {$score} points!
    </div>
  {:else}
    <div class="container mx-auto px-16 text-center flex flex-col gap-4 mt-8">
      <SpotifyPlayer/>
      Score: {$score}
      <ArtistAnswers/>
    </div>
  {/if}
{/if}