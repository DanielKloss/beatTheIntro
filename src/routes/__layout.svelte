<script context="module">
    import {Buffer} from 'buffer';

	export async function load ({ fetch, url }){
        let code = url.searchParams.get("code");
        let state = url.searchParams.get("state");
        let accessToken;

        let clientId = import.meta.env.VITE_CLIENT_ID;
        let clientSecret = import.meta.env.VITE_CLIENT_SECRET;
        let redirect = import.meta.env.VITE_REDIRECT_URI;

        let body = {
                    redirect_uri: redirect,
                    grant_type: 'authorization_code',
                    code: code
                };

        var formBody = [];
        for (var property in body) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(body[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        
        let Authorisation = 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'));

        if (code != null && state != null){
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: "POST",
                body: formBody,
                headers: {
                    'Authorization': Authorisation,
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                json: true
            });

            accessToken = await response.json();
            accessToken = accessToken.access_token;
        } else {
            //get access token from storage if possible
            accessToken = null;
        }

        return {
            props: {
                accessToken
            }
        };
    }
</script>

<script>
    import "../app.css";
    import { token } from "$lib/stores/authenication.js";
    
    export let accessToken;

    token.set(accessToken);
</script>

<main>
    <slot></slot>
</main>