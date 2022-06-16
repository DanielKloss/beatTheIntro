<script>
    import { token } from "$lib/stores/authenication.js";
    import { track, questionNumber, score } from "$lib/stores/gameVars.js";
    import { onMount } from 'svelte';

    let player;
    let playerReady = false;
    $: $questionNumber, getButtonText();
    let action = "START";

	onMount(async () => {
        let script = document.createElement('script')

        script.id = 'spotify-player';
        script.type = 'text/javascript';
        script.async = false;
        script.defer = true;
        script.src = 'https://sdk.scdn.co/spotify-player.js';

        document.head.appendChild(script);

        window.onSpotifyPlayerAPIReady = () => {
            player = new Spotify.Player({
                name: 'Beat The Intro',
                getOAuthToken: cb => { cb($token); }
            });

            player.addListener('ready', ({ device_id }) => {
                player._options.id = device_id;
                playerReady = true;
            });

            player.connect();
        }
    });

    function getButtonText(){
        if ($questionNumber == 0){
            action = "START";
        }
        else if ($questionNumber == 11){
            action = "PLAY AGAIN";
        } else if ($questionNumber == 10){
            action = "FINISH";
        } else {
            action = "NEXT SONG";
        }
    }

    function playSong(){
        $questionNumber++; 
        if ($questionNumber == 11){
            player.pause();
            $track = null;
        } else if ($questionNumber == 12){
            $questionNumber = 0;
            $score = 0;
        } else {
            let tracks = JSON.parse(localStorage.getItem('tracks'));
            let randomSong = tracks[Math.floor(Math.random()*(tracks.length))];
            let songUri = randomSong.uri;

            track.set(randomSong);

            const play = ({
                spotify_uri,
                playerInstance: {
                    _options: {
                        getOAuthToken,
                        id
                    }
                }
                }) => {
                    getOAuthToken(access_token => {
                        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
                            method: 'PUT',
                            body: JSON.stringify({ uris: [spotify_uri] }),
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${access_token}`
                            },
                        });
                    });
                };

            play({
                playerInstance: player,
                spotify_uri: songUri,
            });
        }
    }
</script>

{#if playerReady}
    <button class="btn btn-outline" on:click="{playSong}">{action}</button>
{:else}
    <div class="flex justify-center">
        <progress class="progress w-56"></progress>
    </div>
{/if}