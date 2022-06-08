<script>
    import { track } from "$lib/stores/track.js";
    import { score } from "$lib/stores/score.js";
    import { getScore } from "$lib/spotifyApi/requests";
    import { token } from "$lib/stores/authenication.js";
    $: $track, getAnswers();

    let answers = [];
    let correctAnswer;

    function getAnswers(){
        if ($track != null){
            correctAnswer = $track.artist.name;
            answers.push(correctAnswer);

            let artists = JSON.parse(localStorage.getItem('artists'));

            artists.splice(artists.findIndex(a => a.name == correctAnswer), 1)
            
            for (let i = 0; i < 3; i++) {
                answers.push(artists.splice(Math.floor(Math.random() * artists.length), 1)[0].name);
            }
            
            answers = shuffleAnswers(answers);
        }
    }

    function shuffleAnswers(answers) {
        let current = answers.length;
        while (0 !== current) {
            let randomIndex = Math.floor(Math.random() * current);
            current -= 1;
            let temp = answers[current];
            answers[current] = answers[randomIndex];
            answers[randomIndex] = temp;
        }
        return answers;
    }

    async function submitAnswer(answer){
        let scoretoAdd = await getScore("https://api.spotify.com/v1/me/player", $token);
        if (answer == correctAnswer){
            console.log("Correct!")
            $score += (100 - scoretoAdd);
            answers = [];
        } else {
            console.log("Incorrect!")
            $score -= (scoretoAdd * 10);
            answers.splice(answers.indexOf(answer), 1);

            if(answers.length == 1){
                answers = [];
            } else {
                answers = answers;
            }
        }
    }
</script>

{#each answers as answer}
    <button on:click="{() => submitAnswer(answer)}">{answer}</button>
{/each}