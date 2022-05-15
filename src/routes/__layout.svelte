<script context="module">
	export async function load ({ fetch, url }){
        let code = url.searchParams.get("code");
        let state = url.searchParams.get("state");
        let accessToken;

        if (code != null && state != null){
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                redirect_uri: import.meta.env.VITE_REDIRECT_URI,
                grant_type: 'refresh_token',
                refresh_token: import.meta.env.VITE_REFRESH_TOKEN,
                client_id: import.meta.env.VITE_CLIENT_ID,
                client_secret: import.meta.env.VITE_CLIENT_SECRET
                })
            });

            accessToken = await response.json();
        } else {
            //get access token from storage if possible
            accessToken = null;
        }

        return {
            props: {
                accessToken : accessToken.access_token
            }
        };
    }
</script>

<script>
    import { token } from "$lib/stores/authenication.js";
    
    export let accessToken;

    token.set(accessToken);
</script>

<main>
    <slot></slot>
</main>