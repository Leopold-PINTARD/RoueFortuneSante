class Question {
    constructor(id, priority, question, category, explanation) {
      this.id = id;
      this.priority = priority === "Obligatoire" ? 1 : 0;
      this.explanation = explanation;
      this.answer = [];
      this.correctAnswer = [];
      this.category = category;
      this.question = question;
    }

    addAnswer(answer) {
      this.answer.push(answer);
    }

    addCorrectAnswer(correctAnswer) {
      this.correctAnswer.push(correctAnswer);
    }

    getQuestion() {
      return this.question;
    }

    getAnswer() {
      return this.answer;
    }

    getCorrectAnswer() {
      return this.correctAnswer;
    }

    getCategory() {
      return this.category;
    }

    getExplanation() {
      return this.explanation;
    }

    getPriority() {
      return this.priority;
    }
  }

// -----------------------END OF CLASS DEFINITION-----------------------

(function() {
    const wheel = document.querySelector('.wheel');
    const startButton = document.querySelector('.button');
    const app = document.querySelector('.app');
    const usernameForm = document.getElementById('usernameForm');
    const usernameInput = document.getElementById('usernameInput');
    let deg = 0;
    let questionContainer = null;
    let loadedQuestions = [];
    let score = 0;
    let questionsAnswered = 0;
    let username = "Inconnu";
    let idPlayer = -1;
    let sectionAnswered = [];

    const sectionMap = {
        0: "Visites médicales",
        1: "Autres missions du Pôle Santé",
        2: "Prévention des risques professionnels",
        3: "Questions générales",
        4: "Visites médicales",
        5: "Autres missions du Pôle Santé",
        6: "Prévention des risques professionnels",
        7: "Questions générales"
    };

    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    async function loadQuestions() {
        try {
            // Using here the function created in the google apps script
            // to get the questions from the spreadsheet
            google.script.run.withSuccessHandler((questions) => {
                loadedQuestions = questions.map((question) => {
                    const q = new Question(
                        question.id,
                        question.priority,
                        question.question,
                        question.category,
                        question.explanation
                    );
                    for (let i = 0; i < question.answer.length; i++) {
                        q.addAnswer(question.answer[i]);
                    }
                    for (let i = 0; i < question.correctAnswer.length; i++) {
                        q.addCorrectAnswer(question.correctAnswer[i]);
                    }
                    return q;
                });
                console.log('Questions loaded:', loadedQuestions);
                startButton.style.display = 'block';
            }).getQuestions();
        } catch (error) {
            console.error('Failed to load questions:', error);
        }
    }

    function getQuestionContainer() {
        if (!questionContainer) {
            questionContainer = document.createElement('div');
            questionContainer.className = 'question-container';
            questionContainer.style.display = 'none';
            app.parentNode.insertBefore(questionContainer, app.nextSibling);
        }
        return questionContainer;
    }

    function getQuestionForSection(section) {
        let prioritariesQuestions = loadedQuestions.filter((question) =>
            question.getCategory() === section && question.getPriority() === 1);
        if (prioritariesQuestions.length > 0) {
            let randomIndex = Math.floor(Math.random() *
                prioritariesQuestions.length);
            return prioritariesQuestions[randomIndex];
        }

        let questions = loadedQuestions.filter((question) =>
            question.getCategory() === section);
        if (questions.length > 0) {
            let randomIndex = Math.floor(Math.random() * questions.length);
            return questions[randomIndex];
        }
        return null;
    }

    function rigWheelBySection() {
        let randomNumber = -1;
        let OneOrTwo = Math.floor(Math.random() * 2);

        while (randomNumber < 0 || sectionAnswered.includes(randomNumber)) {
            randomNumber = Math.floor(Math.random() * 4);
        }
        sectionAnswered.push(randomNumber);
        if (OneOrTwo === 0) {
            return randomNumber;
        }
        else {
            return randomNumber + 4;
        }
    }

// ------------------END OF FUNCTION DEFINITIONS-----------------

    loadQuestions()

    usernameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        username = sanitizeInput(usernameInput.value.trim());
        if (username === "" ||
            (username.startsWith("=") && !username.startsWith("=IMAGE("))) {
            alert("Veuillez entrer un nom d'utilisateur valide.");
            return;
        }
        usernameForm.style.display = 'none';
        console.log("Username is " + username);
    });

    startButton.addEventListener('click', () => {
        startButton.style.pointerEvents = 'none';
        startButton.style.display = 'none';
        let rigDeg = rigWheelBySection(loadedQuestions);
        deg = Math.floor((10 * 360) + // Make that the wheel do 10 turns
                        (rigDeg * (360 / 8)) + // Chooses the section
                        (Math.floor(Math.random() * ((360 / 8) + 1)))); // Make that the wheel doesnt stop on the line
        wheel.style.transition = 'all 4s ease-out';
        wheel.style.transform = `rotate(${deg}deg)`;
        getQuestionContainer().style.display = 'none';
    });

    wheel.addEventListener('transitionend', () => {
        startButton.style.pointerEvents = 'auto';
        wheel.style.transition = 'none';
        const actualDeg = deg % 360;
        wheel.style.transform = `rotate(${actualDeg}deg)`;
        const division = Math.floor(actualDeg / (360 / 8));

        let question = getQuestionForSection(sectionMap[division]);

        if (!question) {
            alert("Il n'y a plus de questions dans ce thème.");
            return;
        }

        let answersButtons = []

        for (let i = 0; i < question.getAnswer().length; i++) {
            answersButtons.push({
                text: question.getAnswer()[i],
                correct: question.getCorrectAnswer().includes(question.getAnswer()[i]),
            });
        }

        const container = getQuestionContainer();
        container.innerHTML = `
            <h2>${question.getQuestion()}</h2>
            <div class="answers-grid">
            ${answersButtons.map((answer, index) => `
                <div class="answer-btn" id="answer-box-${index}">
                    <input type="checkbox" id="answer-${index}" class="answer-checkbox" data-index="${index}">
                    <label for="answer-${index}">${answer.text}</label>
                </div>
            `).join('')}
            </div>
            <button id="validate-btn" class="validate-btn">Valider</button>
            <div class="explanation">
                <p>${question.getExplanation()}</p>
            </div>
        `;

        const checkboxes = container.querySelectorAll('.answer-checkbox');
        const validateButton = container.querySelector('#validate-btn');
        const explanationDiv = container.querySelector('.explanation');
        validateButton.addEventListener('click', () => {
            const selectedAnswers = Array.from(checkboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => parseInt(checkbox.dataset.index));
            if (selectedAnswers.length === 0) {
                alert("Veuillez sélectionner au moins une réponse.");
                return;
            }
            questionsAnswered++;
            let isCorrect = true;
            answersButtons.forEach((answer, index) => {
                const isSelected = selectedAnswers.includes(index);
                const answerBox = container.querySelector(`#answer-box-${index}`);
                const label = container.querySelector(`label[for="answer-${index}"]`);
                if ((answer.correct && !isSelected) || (!answer.correct && isSelected)) {
                    isCorrect = false;
                }
                if (answer.correct) {
                    answerBox.classList.add('correct-answer');
                } else if (isSelected) {
                    answerBox.classList.add('wrong-answer');
                }
            });
            if (isCorrect) {
                score++;
                validateButton.innerHTML = '✓ Correct!';
                validateButton.style.backgroundColor = 'green';
            } else {
                validateButton.innerHTML = '✗ Incorrect';
                validateButton.style.backgroundColor = 'red';
            }
            checkboxes.forEach(checkbox => checkbox.disabled = true);
            validateButton.disabled = true;
            explanationDiv.style.display = 'block';
            (async () => {
                try {
                    idPlayer = await new Promise((resolve, reject) => {
                        google.script.run
                            .withSuccessHandler(resolve)
                            .withFailureHandler(reject)
                            .updateScore(username, idPlayer, score, questionsAnswered);
                    });
                } catch (error) {
                    console.error('Failed to update score:', error);
                }
            })();
            setTimeout(() => {
                startButton.style.display = 'block';
            }, 3500);
        });
        container.style.display = 'block';
    });
})();
