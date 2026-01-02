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
let isFetching = false;

let questionQueue = [];

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


startButton.addEventListener("click", async function() {
    await prepareQuestionData();

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
        const response = await fetch("https://opentdb.com/api.php?amount=10&encode=base64&type=multiple");
        const data = await response.json();
        console.log("Fetched question data:", data);
        return data;
    }
    catch (error) {
        document.getElementById("quiz-container").innerHTML = "<h2>Failed to load question. Please check your internet connection and try again.</h2>";
        console.error("Error fetching question:", error);

    } 
}

async function loadNewQuestion() {
    isFetching = true;
    const questionData = await getQuestion();
    questionQueue.push(...questionData.results);
    isFetching = false;
}

const decode = (val) => {
    if (typeof val !== "string") return val;
    try {
        return atob(val);
    } catch (e) {
        console.error("Error decoding string:", e);
        return val;
    }
};

async function prepareQuestionData() {
    if (questionQueue.length === 0) {
        console.error("No questions available in the queue.");
        await loadNewQuestion();
    }
    const questionData = questionQueue.shift();


    currentQuestionData.difficulty = decode(questionData.difficulty);
    currentQuestionData.questionText = decode(questionData.question);
    currentQuestionData.correct_answer = decode(questionData.correct_answer);
    currentQuestionData.options = questionData.incorrect_answers.map(ans => decode(ans));
    currentQuestionData.options.push(currentQuestionData.correct_answer);
    console.log("Prepared question data:", currentQuestionData);
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
passbtn.addEventListener("click", async function() {
    if (isFetching) {
        console.log("Already fetching a new question. Please wait.");
        return;
    }
    await prepareQuestionData();
    displayQuestion(currentQuestionData.questionText, currentQuestionData.options, currentQuestionData.difficulty);
});

submitButton.addEventListener("click", async function() {
    if (isFetching) {
        console.log("Already fetching a new question. Please wait.");
        return;
    }
    let selectedOption;
    for (const option of options) {
        if (option.checked) {
            selectedOption = document.querySelector(`label[for="${option.id}"]`).innerHTML;
            break;
        }
    }
    if (!selectedOption) return;
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

    await prepareQuestionData();

    displayQuestion(currentQuestionData.questionText, currentQuestionData.options, currentQuestionData.difficulty);
});