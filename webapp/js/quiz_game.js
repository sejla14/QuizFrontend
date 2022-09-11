var quiz = {
    id: 0,
    title: '',
    picUrl: '',
    image: undefined,
    creator: 0,
    questions: [],
};

var player = {
    id: 0,
    playerId: 0,
    firstname: '',
    lastname: '',
    totalPoints: 0,
    scoredPoints: 0,
    quizId: 0
};

function Question() {

    this.id = 0;
    this.quizId = 0;
    this.order = 0;
    this.text = '';
    this.time = 0;
    this.points = 0;
    this.answers = [];
    this.remainTime = 0;
    this.selectedAnswerId = 0;
}

function Answer() {
    this.id = 0;
    this.questionId = 0;
    this.answerId = 0;
    this.text = '';
    this.correct = false;
    this.points = 0;
}

function isQuizCompleted() {
    for (i = 0; i < quiz.questions.length; i++) {
        if (quiz.questions[i].selectedAnswerId == 0)
            return false;
    }
    return true;
}

function startQuiz(quizid) {
    console.log("start the quiz: " + quizid);
    clearDiv("idAnswerList");

    $.get("/admin/quizzes/"+ quizid, /*** Podesiti putanju kako treba ****/
    function (data, status) {
        var retMessage = data + "\nStatus: " + status;
        $("#idQuizInfoMessage").text(retMessage);
        $("#idQuizInfoMessage").show();

        if (status == 200) {
            data.json().then((data) => {
                setQuiz(data);
            });
        }
        else {
            data.text().then((text) => {
                
                var retMessage = data + "\nStatus: " + status;
                $("#idQuizInfoMessage").text(retMessage);
                $("#idQuizInfoMessage").show();
                console.log(retMessage);
            });
        }
    });

}

function setQuiz(quizObj) {
    quiz = quizObj;
    for (i = 0; i < quiz.questions.length; i++) {
        quiz.questions[i].id = i + 1;		//id starts from 1
        quiz.questions[i].selectedAnswerId = 0;
        quiz.questions[i].remainTime = quiz.questions[i].time;
        for (k = 0; k < quiz.questions[i].answers.length; k++) {
            quiz.questions[i].answers[k].id = k + 1;	//id starts from 1
        }
    }

    renderQuestion(quiz.questions[0]);
}

function createDivColumn(divClass) {
    var div = document.createElement("div");
    div.setAttribute("class", divClass);
    return div;
}

function handleInput(event, obj, propertyId) {
    obj[propertyId] = event.target.value;
}

function countdown(timeCounter, timeLimit, divId) {
    timeCounter = setInterval(function () {
        if (timeLimit > 0) {
            --timeLimit;
            document.getElementById(divId).innerText = timeLimit;
        }
    }, 1000);
}

function clearDiv(divId) {
    var div = document.getElementById(divId);
    var firstChild = div.firstElementChild;
    while (firstChild) {
        firstChild.remove();
        firstChild = div.firstElementChild;
    }
}

function renderQuestion(questionObj) {
    //clear up previous elements
    var rootDiv = document.getElementById("rootDiv");
    clearDiv("rootDiv");
    rootDiv.setAttribute("class", "mdl-grid");

    //prepare the divs
    rootDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
    var questionDiv = createDivColumn("mdl-cell mdl-cell--6-col mdl-grid mdl-shadow--8dp");
    rootDiv.appendChild(questionDiv);
    rootDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));

    //render the question
    //---TEXT
    questionDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
    var textDiv = document.createElement("div");
    textDiv.setAttribute("class", "mdl-cell mdl-cell--6-col mdl-grid");
    var text = document.createElement("h3");
    text.innerText = questionObj.id + ". " + questionObj.text;
    textDiv.appendChild(text);
    questionDiv.appendChild(textDiv);
    //---TIME
    var timeDiv = document.createElement("div");
    timeDiv.setAttribute("class", "mdl-cell mdl-cell--3-col mdl-grid");
    var time = document.createElement("h3");
    var timerId = "timer" + questionObj.questionId;
    time.setAttribute("id", timerId);
    time.innerText = questionObj.remainTime;
    timeDiv.appendChild(time);
    questionDiv.appendChild(timeDiv);
    //questionDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
    var timeCounter;


    //---ANSWERS
    questionDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
    var answersDiv = document.createElement("div");
    answersDiv.setAttribute("id", "answerList");
    answersDiv.setAttribute("class", "mdl-cell mdl-cell--6-col mdl-grid");
    for (let i = 0; i < questionObj.answers.length; i++) {
        var singleAnswerDiv = document.createElement("div");
        singleAnswerDiv.setAttribute("class", "mdl-cell mdl-cell--8-col mdl-grid");

        var rbLabel = document.createElement("label");
        rbLabel.setAttribute("class", "mdl-radio mdl-js-radio mdl-js-ripple-effect");
        rbLabel.setAttribute("for", i);

        var rbOption = document.createElement("input");
        rbOption.setAttribute("id", i);
        rbOption.setAttribute("type", "radio");
        rbOption.setAttribute("name", "answer");
        rbOption.setAttribute("class", "mdl-radio__button answerRb");
        rbOption.setAttribute("value", questionObj.answers[i].answerId);
        if (questionObj.answers[i].answerId == questionObj.selectedAnswerId)
            rbOption.checked = true;
        rbOption.onclick = function () {
            questionObj.selectedAnswerId = event.target.value;
            console.log(quiz);
        };
        var rbOptionLabel = document.createElement("span");
        rbOptionLabel.setAttribute("class", "mdl-radio__label");
        rbOptionLabel.innerText = questionObj.answers[i].text;

        if (questionObj.remainTime <= 0) {
            rbOption.disabled = true;
        }

        rbLabel.appendChild(rbOption);
        rbLabel.appendChild(rbOptionLabel);

        singleAnswerDiv.appendChild(rbLabel);
        //singleAnswerDiv.appendChild(rbOptionLabel);
        answersDiv.appendChild(createDivColumn("mdl-cell mdl-cell--2-col mdl-grid"));
        answersDiv.appendChild(singleAnswerDiv);
        answersDiv.appendChild(createDivColumn("mdl-cell mdl-cell--2-col mdl-grid"));
    }
    questionDiv.appendChild(answersDiv);
    questionDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));

    //---BUTTONS
    questionDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
    var buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("class", "mdl-cell mdl-cell--6-col mdl-grid");
    questionDiv.appendChild(buttonDiv);

    var buttonPrev = document.createElement("button");
    buttonPrev.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect");
    buttonPrev.innerText = 'Previous';
    buttonPrev.onclick = function () {
        clearInterval(timeCounter);
        renderQuestion(quiz.questions[questionObj.id - 2])
    };
    buttonDiv.appendChild(buttonPrev);
    buttonDiv.appendChild(createDivColumn("mdl-cell mdl-cell--4-col mdl-grid"));
    if (questionObj.id <= 1)
        buttonPrev.style.visibility = 'hidden';

    var buttonNext = document.createElement("button");
    buttonNext.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect");
    buttonNext.innerText = 'Next';
    buttonNext.onclick = function () {
        clearInterval(timeCounter);
        if (questionObj.id < quiz.questions.length) {
            renderQuestion(quiz.questions[questionObj.id]);
        }
        else {
            if (isQuizCompleted()) {
                loadSubmitResultPage();
            }
            else {
                loadQuestionListPage();
            }
        }
    };
    buttonDiv.appendChild(buttonNext);

    questionDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
    componentHandler.upgradeDom();

    if (questionObj.remainTime > 0) {
        timeCounter = setInterval(function () {
            if (questionObj.remainTime > 0) {
                --questionObj.remainTime;
                document.getElementById(timerId).innerText = questionObj.remainTime;
            }
            else {
                if (questionObj.selectedAnswerId == 0) {
                    questionObj.selectedAnswerId = -1;	//unanswered question!!!	
                }
                //buttonNext.click();
                $('.answerRb').each((index, elem) => { elem.parentNode.MaterialRadio.disable() });
            }
        }, 1000);
    }
}

function loadSubmitResultPage() {
    //calculate max score and total score
    var maxScore = 0;
    var totScore = 0;
    for (i = 0; i < quiz.questions.length; i++) {
        var singleQuestion = quiz.questions[i];
        for (k = 0; k < singleQuestion.answers.length; k++) {
            if (singleQuestion.selectedAnswerId == singleQuestion.answers[k].answerId) {
                totScore += singleQuestion.answers[k].points;
            }
            if (singleQuestion.answers[k].isCorrect == true) {
                maxScore += singleQuestion.answers[k].points;
            }
        }
    }

    //render the UI elements
    var rootDiv = document.getElementById("rootDiv");
    clearDiv("rootDiv");
    rootDiv.setAttribute("class", "mdl-grid");

    //SCORE
    rootDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
    var scoreDiv = createDivColumn("mdl-cell mdl-cell--6-col mdl-grid");
    var scoreHeading = document.createElement("h2");
    scoreHeading.innerText = "Result: " + totScore + "/" + maxScore;
    scoreDiv.appendChild(scoreHeading);
    rootDiv.appendChild(scoreDiv);
    rootDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));

    //player's data:
    rootDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
    var userDataDiv = createDivColumn("mdl-cell mdl-cell--6-col mdl-grid");

    //FIRSTNAME
    var firstnameInput = document.createElement("input");
    firstnameInput.required = true;
    firstnameInput.setAttribute("id", "firstname");
    firstnameInput.setAttribute("type", "text");
    firstnameInput.setAttribute("class", "mdl-textfield__input");
    firstnameInput.onchange = function () {
        handleInput(event, inbox, "firstname");
    };

    var firstnameLabel = document.createElement("label");
    firstnameLabel.setAttribute("for", "firstname");
    firstnameLabel.setAttribute("class", "mdl-textfield__label");
    firstnameLabel.innerText = "Firstname:";

    var firstnameDiv = document.createElement("div");
    firstnameDiv.setAttribute("class", "mdl-textfield mdl-js-textfield mdl-textfield--floating-label has-placeholder mdl-cell mdl-cell--10-col");
    firstnameDiv.appendChild(firstnameLabel);
    firstnameDiv.appendChild(firstnameInput);
    userDataDiv.appendChild(firstnameDiv);

    //LASTNAME
    var lastnameInput = document.createElement("input");
    lastnameInput.required = true;
    lastnameInput.setAttribute("id", "lastname");
    lastnameInput.setAttribute("type", "text");
    lastnameInput.setAttribute("class", "mdl-textfield__input");
    lastnameInput.onchange = function () {
        handleInput(event, inbox, "lastname");
    };

    var lastnameLabel = document.createElement("label");
    lastnameLabel.setAttribute("for", "lastname");
    lastnameLabel.setAttribute("class", "mdl-textfield__label");
    lastnameLabel.innerText = "Lastname:";

    var lastnameDiv = document.createElement("div");
    lastnameDiv.setAttribute("class", "mdl-textfield mdl-js-textfield mdl-textfield--floating-label has-placeholder mdl-cell mdl-cell--10-col");
    lastnameDiv.appendChild(lastnameLabel);
    lastnameDiv.appendChild(lastnameInput);
    userDataDiv.appendChild(lastnameDiv);

    //EMAIL
    var emailInput = document.createElement("input");
    emailInput.required = true;
    emailInput.setAttribute("id", "email");
    emailInput.setAttribute("type", "text");
    emailInput.setAttribute("class", "mdl-textfield__input");
    emailInput.onchange = function () {
        handleInput(event, inbox, "email");
    };

    var emailLabel = document.createElement("label");
    emailLabel.setAttribute("for", "email");
    emailLabel.setAttribute("class", "mdl-textfield__label");
    emailLabel.innerText = "Email:";

    var emailDiv = document.createElement("div");
    emailDiv.setAttribute("class", "mdl-textfield mdl-js-textfield mdl-textfield--floating-label has-placeholder mdl-cell mdl-cell--10-col");
    emailDiv.appendChild(emailLabel);
    emailDiv.appendChild(emailInput);
    userDataDiv.appendChild(emailDiv);

    //SUBMIT BUTTON
    var buttonDiv = document.createElement("div");
    var submitButton = document.createElement("button");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect");
    submitButton.innerText = 'Submit the result';
    submitButton.onclick = function () {
        submitResult(totScore, maxScore);
    };
    buttonDiv.appendChild(submitButton);
    userDataDiv.appendChild(buttonDiv);

    rootDiv.appendChild(userDataDiv);
    rootDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
}

function loadQuestionListPage() {
    //render the UI elements
    var rootDiv = document.getElementById("rootDiv");
    clearDiv("rootDiv");
    rootDiv.setAttribute("class", "mdl-grid");

    //header
    rootDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
    var headerDiv = createDivColumn("c");
    headerDiv.setAttribute("class", "mdl-cell mdl-cell--6-col mdl-grid");
    var header = document.createElement("h3");
    header.innerText = 'Unanswered questions:'
    headerDiv.appendChild(header);
    rootDiv.appendChild(headerDiv);
    rootDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));

    rootDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
    var questionListDiv = createDivColumn("mdl-cell mdl-cell--6-col mdl-grid");
    //add unanswered questions as links:
    for (let i = 0; i < quiz.questions.length; i++) {
        if (quiz.questions[i].selectedAnswerId == 0) {
            var questionLink = document.createElement("a");
            questionLink.setAttribute("id", i);
            questionLink.setAttribute("href", "#");
            questionLink.innerText = quiz.questions[i].text;

            questionLink.onclick = function () {
                renderQuestion(quiz.questions[i]);
            };
            var linkDiv = document.createElement("div");
            linkDiv.setAttribute("class", "mdl-cell mdl-cell--12-col");
            linkDiv.appendChild(questionLink);
            questionListDiv.appendChild(linkDiv);
        }
    }
    rootDiv.appendChild(questionListDiv);
    rootDiv.appendChild(createDivColumn("mdl-cell mdl-cell--3-col mdl-grid"));
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function isFormValid() {
    const requiredElements = document.getElementById("rootDiv").querySelectorAll("[required]");
    //check mandatory fields
    for (i = 0; i < requiredElements.length; i++) {
        if (isEmpty(requiredElements[i].value)) {
            alert("Please enter the " + requiredElements[i].id + "!");
            requiredElements[i].focus();
            return false;
        }
    }
    return true;
}

function submitResult(totScore, maxScore) {
    if (isFormValid()) {

        inbox.totalPoints = maxScore;
        inbox.scoredPoints = totScore;
        inbox.quizId = quiz.quizId;

        console.log(inbox);

        fetch(
            '/WA-Quizz/inbox/submitResult',
            {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inbox)
            }

        ).then((response) => {
            if (response.status == 200) {
                window.location.href = '/WA-Quizz/index.jsp';
            }
            else {
                response.text().then((text) => {
                    console.log(text);

                });
            }
        }).catch((error) => {
            console.log(error);
        });

    }
}