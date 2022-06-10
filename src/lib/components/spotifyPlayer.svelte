<script>
    import { token } from "$lib/stores/authenication.js";
    import { track } from "$lib/stores/track.js";
    import { onMount } from 'svelte';

    let player;

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
                console.log("player ready", device_id)
                player._options.id = device_id;
            });

            player.connect();
        }
    });

    function playSong(){
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
</script>

<button class="btn btn-outline" on:click="{() => playSong()}">Play Next Song</button>