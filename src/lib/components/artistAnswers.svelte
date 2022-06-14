<script>
    import { track, score } from "$lib/stores/gameVars.js";
    $: $track, getAnswers();

    let answers = [];
    let correctAnswer;
    let points;
    let timeout;
    let endOfQuestion;

    function reset(){
        clearTimeout(timeout);
        answers = [];
    }

    function decrementTimer(delay){
        points--;
        
        if(points > 0){
            timeout = setTimeout(() => decrementTimer(delay), delay);
        } else {
            $score -= 50;
            endOfQuestion = "Oh No! You lost 50 points!";
            reset()
        }
    }

    async function getAnswers(){   
        points = 50;
        endOfQuestion = "";
        
        if ($track != null){
            correctAnswer = $track.artist.name;
            answers.push(correctAnswer);

            let artists = JSON.parse(localStorage.getItem('artists'));

            artists.splice(artists.findIndex(a => a.name == correctAnswer), 1)
            
            for (let i = 0; i < 3; i++) {
                answers.push(artists.splice(Math.floor(Math.random() * artists.length), 1)[0].name);
            }
            
            answers = shuffleAnswers(answers);

            let delay = $track.duration / 150;

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
            $score += points;
            endOfQuestion = "Well done! You scored " + points + " points";
            reset();
        } else {
            points -= 10;
            answers.splice(answers.indexOf(answer), 1);

            if(answers.length == 1){
                $score -= 50;
                endOfQuestion = "Oh No! You lost 50 points!";
                reset();
            } else {
                answers = answers;
            }
        }
    }
</script>

{#if $track != null}
    {#if answers.length == 0}
        <p class="font-bold">{$track.name} - {$track.artist.name}</p>
        {endOfQuestion}
    {:else}
        <div class="flex justify-center">
            <span class="countdown font-mono text-6xl">
            <span style="--value:{points};"></span>
            </span>
        </div>
        {#each answers as answer}
            <button class="btn" on:click="{() => submitAnswer(answer)}">{answer}</button>
        {/each}
    {/if}
{/if}
