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
      return this.explaination;
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
    let deg = 0;
    let questionContainer = null;
    let loadedQuestions = [];
    let score = 0;
    let questionsAnswered = 0;
    let username = "Unconnu";
    let idPlayer = -1;

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
        console.log("Score is " + score);
        console.log("Section is " + section);
        choosenQuestion = null;

        for (element of loadedQuestions) {
            if (element.getCategory() === section && element.getPriority() === 1) {
                choosenQuestion = element;
                loadedQuestions.splice(loadedQuestions.indexOf(element), 1);
                return choosenQuestion;
            }
        }
        for (element of loadedQuestions) {
            if (element.getCategory() === section) {
                choosenQuestion = element;
                loadedQuestions.splice(loadedQuestions.indexOf(element), 1);
                return choosenQuestion;
            }
        }
    }

    function rigWheelBySection(questions) {
        const sectionCount = {};
        questions.forEach((question) => {
            const section = question.getCategory();
            const priority = question.getPriority();
            if (!sectionCount[section]) {
                sectionCount[section] = 0;
            }
            sectionCount[section]++;
            if (priority === 1) {
                sectionCount[section]++;
            }
        });

        const weightedSections = [];
        for (const section in sectionCount) {
            for (let i = 0; i < sectionCount[section]; i++) {
            weightedSections.push(section);
            }
        }

        const randomIndex = Math.floor(Math.random() * weightedSections.length);
        const selectedSection = sectionMap[weightedSections[randomIndex]];
        if (randomIndex % 2 === 0) {
            return selectedSection;
        } else {
            return selectedSection + 4;
        }
    }

// ------------------END OF FUNCTION DEFINITIONS-----------------

    loadQuestions()


    startButton.addEventListener('click', () => {
        startButton.style.pointerEvents = 'none';
        startButton.style.display = 'none';
        let rigDeg = rigWheelBySection(loadedQuestions);
        let deg = Math.floor(Math.random() * 360 + 720) + (rigDeg * 45);
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
            <div class="answers-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            ${answersButtons.map((answer, index) => `
            <button class="answer-btn" data-index="${index}">
                ${answer.text}
            </button>
            `).join('')}
            </div>
        `;

        const answerButtons = container.querySelectorAll('.answer-btn');
        answerButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const isCorrect = answersButtons[index].correct;
                questionsAnswered++;
                if (isCorrect) {
                    score++;
                    answerButtons.forEach((btn, idx) => {
                        if (answersButtons[idx].correct) {
                            btn.style.backgroundColor = 'green';
                        }
                        btn.disabled = true;
                    });
                } else {
                    button.style.backgroundColor = 'red';
                    answerButtons.forEach((btn, idx) => {
                        if (answersButtons[idx].correct) {
                            btn.style.backgroundColor = 'green';
                        }
                        btn.disabled = true;
                    });
                }
                (async () => {
                    idPlayer = await new Promise((resolve) => {
                        google.script.run.withSuccessHandler(resolve)
                            .updateScore(username, idPlayer, score, questionsAnswered);
                    });
                })();
                setTimeout(() => {
                    startButton.style.display = 'block';
                }, 3500);
            });
        });
        container.style.display = 'block';
    });
})();
