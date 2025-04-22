(function() {
    const wheel = document.querySelector('.wheel');
    const startButton = document.querySelector('.button');
    const app = document.querySelector('.app');
    let deg = 0;
    let questionContainer = null;
    let loadedQuestions = [];
    let score = 0;
    let questionsAnswered = 0;

    async function loadQuestions() {
        try {
            // Using here the function created in the google apps script
            // to get the questions from the spreadsheet
            google.script.run.withSuccessHandler((questions) => {
                loadedQuestions = questions;
                console.log('Questions loaded:', loadedQuestions);
            }).getQuestions();
        } catch (error) {
            console.error('Failed to load questions:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', loadQuestions);

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

    startButton.addEventListener('click', () => {
        startButton.style.pointerEvents = 'none';
        startButton.style.display = 'none';
        deg = Math.floor(3000 + Math.random() * 3000);
        wheel.style.transition = 'all 4s ease-out';
        wheel.style.transform = `rotate(${deg}deg)`;
        getQuestionContainer().style.display = 'none';
    });

    wheel.addEventListener('transitionend', () => {
        startButton.style.pointerEvents = 'auto';
        wheel.style.transition = 'none';
        const actualDeg = deg % 360;
        wheel.style.transform = `rotate(${actualDeg}deg)`;

        let sectionName = '';
        if (Math.floor(actualDeg / 45) % 3 === 1) {
            sectionName = "Questions générales";
        } else if (Math.floor(actualDeg / 45) % 3 === 2) {
            sectionName = "Visites médicales";
        } else {
            sectionName = "Prévention des risques professionnels";
        }

        let question = getQuestionForSection(sectionName);

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
                setTimeout(() => {
                    startButton.style.display = 'block';
                }, 3500);
            });
        });
        container.style.display = 'block';
    });
})();
