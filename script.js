const getReadyText = document.getElementById("getReady");
const quizContainer = document.getElementById("quiz-container");
const startButton = document.getElementById("start-game");
const timer = document.getElementById("timer");
const blast = document.getElementById("blast");
const options = document.querySelectorAll("input[name='options']");
let CorrectAnswer;
let score = 0;
console.log(options);
const optionsLabels = document.querySelectorAll(".option-label");
const submitButton = document.getElementById("submit-answer");

startButton.addEventListener("click", function() {
    quizContainer.style.display = "block";
    getReadyText.style.display = "none";
    startButton.style.display = "none";

    const timerInterval = setInterval(() => {
    let time = parseInt(timer.innerHTML, 10);
    if (time > 0) {
        time -= 1;
        timer.innerHTML = time;
    }
    else {
        clearInterval(timerInterval);
        quizContainer.style.display = "none";
        blast.style.display = "block";
        console.log("Time's up! Your score is: " + score);

    }
}, 1000);
    loadNewQuestion();
});

async function loadNewQuestion() {
    

    async function getQuestion() {
        try {
            const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching question:", error);
        }
        
    }



    const questionData = await getQuestion();
    const Question = questionData.results[0].question;
    CorrectAnswer = questionData.results[0].correct_answer;
    const optionsarr = questionData.results[0].incorrect_answers;
    optionsarr.push(CorrectAnswer);
    console.log(optionsarr);

    const questionContainer = document.getElementById("Question");
    questionContainer.innerHTML = Question;



    for (let i = 0; i < 3; i++) {
        const rand1 = Math.floor(Math.random()*4);
        const rand2 = Math.floor(Math.random()*4);
        const temp = optionsarr[rand1];
        optionsarr[rand1] = optionsarr[rand2];
        optionsarr[rand2] = temp;
    }

    for (let i = 0; i < optionsLabels.length; i++) {
        optionsLabels[i].innerHTML = optionsarr[i];
    }

    console.log(optionsarr);
    for(const option of options) {
        option.checked = false;
    }
}

submitButton.addEventListener("click", function() {
    let selectedOption;
    for (const option of options) {
        if (option.checked) {
            selectedOption = document.querySelector(`label[for="${option.id}"]`).innerHTML;
            break;
        }
    }
    if (selectedOption === CorrectAnswer) {
        console.log("Correct Answer!");
        score += 1; 
        let time = parseInt(timer.innerHTML, 10);
        time += 5;
        timer.innerHTML = time;
    }
    else{
        console.log("Wrong Answer!");
        let time = parseInt(timer.innerHTML, 10);
        time -= 5;
        timer.innerHTML = time;
    }
    loadNewQuestion();
});