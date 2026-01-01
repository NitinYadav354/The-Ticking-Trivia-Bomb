const getReadyText = document.getElementById("getReady");
const quizContainer = document.getElementById("quiz-container");
const startButton = document.getElementById("start-game");
const timer = document.getElementById("timer");
const blast = document.getElementById("blast");
const options = document.querySelectorAll("input[name='options']");
let CorrectAnswer;
let score = 0;
const passbtn = document.getElementById("pass-button");
const optionsLabels = document.querySelectorAll(".option-label");
const submitButton = document.getElementById("submit-answer");
const difficultyLevel = document.getElementById("difficulty");

let nextQuestionData = {
    questionText: "",
    options: [],
    difficulty: "",
    correct_answer: ""
};

let currentQuestionData = {
    questionText: "",
    options: [],
    difficulty: "",
    correct_answer: ""
};

try {
        await loadNewQuestion();
        }
        catch (error) {
            console.error("Error fetching question:", error);
            document.getElementById("quiz-container").innerHTML = "<h2>Failed to load question. Please check your internet connection and try again.</h2>";
            console.log("Please check your internet connection and try again.");
        }


startButton.addEventListener("click", function() {
    currentQuestionData = {...nextQuestionData};
    loadNewQuestion();
    displayQuestion(currentQuestionData.questionText, currentQuestionData.options, currentQuestionData.difficulty);

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
        const scoreDisplay = document.getElementById("score");
        scoreDisplay.innerHTML = "Your score is: " + score;
    }
}, 1000);

});

async function getQuestion() {
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
        const data = await response.json();
        return data;
    }
    catch (error) {
        document.getElementById("quiz-container").innerHTML = "<h2>Failed to load question. Please check your internet connection and try again.</h2>";
        console.error("Error fetching question:", error);
    }
    
}

async function loadNewQuestion() {
    const questionData = await getQuestion();
    nextQuestionData.difficulty = questionData.results[0].difficulty;
    nextQuestionData.questionText = questionData.results[0].question;
    nextQuestionData.correct_answer = questionData.results[0].correct_answer;
    nextQuestionData.options = questionData.results[0].incorrect_answers;
    nextQuestionData.options.push(nextQuestionData.correct_answer);
}

function displayQuestion(Question, optionsarr, difficulty) {
    const questionContainer = document.getElementById("Question");
    questionContainer.innerHTML = Question;

    difficultyLevel.innerHTML = difficulty;

    console.log("Options before shuffle:", optionsarr);

    for (let i = 3; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsarr[i], optionsarr[j]] = [optionsarr[j], optionsarr[i]];
    }
    console.log("Options after shuffle:", optionsarr);

    for (let i = 0; i < optionsLabels.length; i++) {
        optionsLabels[i].innerHTML = optionsarr[i];
    }
    for(const option of options) {
        option.checked = false;
    }
}
passbtn.addEventListener("click", function() {
    currentQuestionData = {...nextQuestionData};
    loadNewQuestion();
    displayQuestion(currentQuestionData.questionText, currentQuestionData.options, currentQuestionData.difficulty);
});

submitButton.addEventListener("click", function() {
    let selectedOption;
    for (const option of options) {
        if (option.checked) {
            selectedOption = document.querySelector(`label[for="${option.id}"]`).innerHTML;
            break;
        }
    }
    if (selectedOption === currentQuestionData.correct_answer) {
        console.log("Correct Answer!");
        if (difficultyLevel.innerHTML === "easy") {
            score += 1;
        }
        else if (difficultyLevel.innerHTML === "medium") {
            score += 2;
        }
        else if (difficultyLevel.innerHTML === "hard") {
            score += 3;
        }  

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
    currentQuestionData = {...nextQuestionData};
    loadNewQuestion();
    displayQuestion(currentQuestionData.questionText, currentQuestionData.options, currentQuestionData.difficulty);
});