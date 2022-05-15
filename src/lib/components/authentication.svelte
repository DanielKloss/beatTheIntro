<script>
    function generateRandomString(length) {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-recently-played playlist-read-collaborative user-top-read user-follow-read user-library-read playlist-read-private user-read-currently-playing user-read-playback-position user-modify-playback-state streaming';
    var url = "https://accounts.spotify.com/authorize?";

    $: loginLink = url + new URLSearchParams({
        response_type: 'code',
        client_id: import.meta.env.VITE_CLIENT_ID,
        scope: scope,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        state: state
    });
</script>

<a href={loginLink}>
    <button class="login-btn">Connect to Spotify</button>
</a>