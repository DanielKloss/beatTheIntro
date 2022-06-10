<script>
    import { track } from "$lib/stores/track.js";
    import { score } from "$lib/stores/score.js";
    $: $track, getAnswers();

    let answers = [];
    let correctAnswer;
    let points = 50;
    let timeout;

    function decrementTimer(delay){
        points--;
        
        if(points > 0){
            timeout = setTimeout(() => decrementTimer(delay), delay);
        } else {
            answers = [];
            $score -= 100;
        }
    }

    async function getAnswers(){        
        if ($track != null){
            correctAnswer = $track.artist.name;
            answers.push(correctAnswer);

            let artists = JSON.parse(localStorage.getItem('artists'));

            artists.splice(artists.findIndex(a => a.name == correctAnswer), 1)
            
            for (let i = 0; i < 3; i++) {
                answers.push(artists.splice(Math.floor(Math.random() * artists.length), 1)[0].name);
            }
            
            answers = shuffleAnswers(answers);

            let delay = $track.duration / 50;

            timeout = setTimeout(() => decrementTimer(delay), delay)
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
        if (answer == correctAnswer){
            console.log("Correct!")
            $score += points;
            answers = [];
            clearTimeout(timeout);
        } else {
            console.log("Incorrect!")
            points -= 10;
            answers.splice(answers.indexOf(answer), 1);

            if(answers.length == 1){
                answers = [];
            } else {
                answers = answers;
            }
        }
    }
</script>

<div class="flex justify-center">
    <span class="countdown font-mono text-6xl">
    <span style="--value:{points};"></span>
    </span>
</div>
{#each answers as answer}
    <button class="btn" on:click="{() => submitAnswer(answer)}">{answer}</button>
{/each}