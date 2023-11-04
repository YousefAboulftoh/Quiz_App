let overlay = document.querySelector(`.overlay`)
let start = document.querySelector(`.user .start`)
let userInput = document.querySelector(`.user input[type="text"]`)
let userName = document.querySelector(`.name span`)
let progress = document.querySelector(`.progress`)
let questionCountSpan = document.querySelector(`.count span`)
let question = document.querySelector(`.quiz-area .question`)
let answerContainer = document.querySelector(`.answer-container`)
let bulletsAndTimer = document.querySelector(`.question-number`)
let spansContainer = document.querySelector(`.question-number .qspans`)
let submit = document.querySelector(`.submit`)
let timer = document.querySelector(`.timer`)
let results = document.querySelector(`.result`)
let jsObject;
let resultShow = false;
let current = 0;
let right = 0;
let numberOfQuestion;
let timerInterval;
window.onload = function () {
    userInput.focus()
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && userInput === document.activeElement) {
            if (userInput.value.match(/[a-z0-9]/ig)) {
                // Check if the "Enter" key is pressed and the user is in the input field
                startQuiz();
            } else {
                document.getElementById('nameErrorMsg').textContent = 'Please enter your name.';
            }
        }
    });
    function startQuiz() {
        // Start the quiz logic here
        overlay.remove();
        start.parentNode.remove();
        userName.innerText = userInput.value;
        getData();
    }

}
function startQuiz() {
    // Start the quiz logic here
    overlay.remove();
    start.parentNode.remove();
    userName.innerText = userInput.value;
    getData();
}

function getData() {
    let request = new XMLHttpRequest()

    request.onreadystatechange = function () {
        if (this.readyState === 3 && this.status === 200) {
            jsObject = JSON.parse(this.responseText)
            numberOfQuestion = jsObject.length
            getNumberQuestion(numberOfQuestion)
            getQuestionAndAnswers(jsObject[current], numberOfQuestion)
            countdowen(3, numberOfQuestion)
            submit.onclick = function () {
                allData()
            }
            document.addEventListener(`keydown`, (e) => {
                if (e.key === "Enter" && resultShow === false) {
                    allData()
                }
            })
        }
    }

    request.open(`GET`, "html.json")
    request.send()

}

function allData() {
    progressBar(numberOfQuestion)
    let rightAnswer = jsObject[current].right_answer
    current++;
    check(rightAnswer, numberOfQuestion)
    question.innerHTML = ""
    answerContainer.innerHTML = ""
    getQuestionAndAnswers(jsObject[current], numberOfQuestion)
    handleSpans()
    clearInterval(timerInterval)
    countdowen(4, numberOfQuestion)
    showResults(numberOfQuestion)

}
function getNumberQuestion(num) {
    questionCountSpan.innerHTML = num

    for (let i = 0; i < num; i++) {
        let span = document.createElement(`span`)
        if (i === 0) {
            span.className = `on`
        }
        spansContainer.append(span)
    }
}

function getQuestionAndAnswers(obj, count) {
    if (current < count) {
        let h2 = document.createElement(`h2`)
        let textHeading = document.createTextNode(obj.title)
        h2.appendChild(textHeading)
        question.appendChild(h2)
        const randomNumbers = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
        for (let i = 1; i < 5; i++) {
            let answer = document.createElement(`div`)
            answer.className = `answer`
            let radio = document.createElement(`input`)
            radio.type = `radio`;
            radio.id = `answer_${i}`
            radio.name = `answers`
            radio.dataset.answer = obj[`answer_${randomNumbers[i - 1].toString()}`]; // Use random numbers
            if (i === 1) {
                radio.checked = true
            }
            let label = document.createElement(`label`)
            label.htmlFor = `answer_${i}`
            let textLabel = document.createTextNode(obj[`answer_${randomNumbers[i - 1].toString()}`]); // Use random numbers
            label.appendChild(textLabel)
            answer.appendChild(radio)
            answer.appendChild(label)
            answerContainer.appendChild(answer)
        }

    }
}
function check(rAnswer, count) {
    if (current < count) {
        let answers = document.getElementsByName(`answers`)
        let theChoosen;
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].checked) {
                theChoosen = answers[i].dataset.answer
            }
        }
        if (rAnswer === theChoosen) {
            right++;
        }
    }
}
function handleSpans() {
    let spans = document.querySelectorAll(`.question-number .qspans span`)
    spans.forEach((span, index) => {
        if (current === index) {
            span.classList.add(`on`)
        }
    })
}
function showResults(count) {
    let theResult;
    if (current === count) {
        bulletsAndTimer.remove()
        submit.remove()
        if (right > (count / 2) && right < count) {
            theResult = `<span class="good">Good</span> ${userInput.value} You success ${right} From ${count}`
        } else if (right < (count / 2) || right === (count / 2)) {
            theResult = `<span class="bad">Fail</span> ${userInput.value} You success ${right} From ${count} GO To Learn`
        } else {
            theResult = `<span class="perfect">Perfect</span> ${userInput.value} You success ${right} From ${count}`
        }
        results.innerHTML = theResult;
        resultShow = true;
    }
}

function countdowen(duration, count) {
    if (current < count) {
        let minuts, seconds;
        timerInterval = setInterval(() => {
            minuts = parseInt(duration / 60)
            seconds = parseInt(duration % 60)
            minuts = minuts < 10 ? `0${minuts}` : minuts
            seconds = seconds < 10 ? `0${seconds}` : seconds
            timer.innerHTML = `${minuts}:${seconds}`
            if (--duration < 0) {
                clearInterval(timerInterval)
                submit.click()
            }
        }, 1000)
    }
}

// 
function progressBar(count) {
    if (current < count) {
        // Calculate the percentage of completion
        let percentage = 10 + (current * 10); // Start from 10% and increase by 10% for each question
        progress.style.width = `${percentage}%`;
    }
}
