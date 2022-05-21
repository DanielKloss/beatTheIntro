<script>
    import { track } from "$lib/stores/track.js";
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
            answers = answers;
        }
    }

    function submitAnswer(answer){
        if (answer == correctAnswer){
            console.log("Correct!")
        } else {
            console.log("Incorrect!")
        }
    }
</script>

{#each answers as answer}
    <button on:click="{() => submitAnswer(answer)}">{answer}</button>
{/each}