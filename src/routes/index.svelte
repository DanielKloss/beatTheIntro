<script>
  import { onMount } from 'svelte';
  import Authentication from '$lib/components/authentication.svelte';
  import SpotifyPlayer from "$lib/components/spotifyPlayer.svelte";
  import ArtistAnswers from "$lib/components/artistAnswers.svelte";
  import LoadTracks from "$lib/components/loadTracks.svelte";
  import { score } from "$lib/stores/score.js";
  import { token } from "$lib/stores/authenication.js";

  let tracksLoaded;

  onMount(async () => {
    tracksLoaded = localStorage.getItem('tracks') == undefined;
  });
</script>

{#if $token == null}
  <Authentication/>
{:else}
  {#if tracksLoaded}
    <LoadTracks/>
  {/if}
  <div class="container mx-auto px-16 text-center flex flex-col gap-4 mt-8">
    <SpotifyPlayer/>
    Score: {$score}
    <ArtistAnswers/>
  </div>
{/if}