/*
** EPITECH PROJECT, 2025
** tests
** File description:
** getQuestions
*/

const SheetSync = require('./SheetSync');

class Question {
    constructor(id, priority, question, category) {
        this.id = id;
        this.priority = priority === "Obligatoire" ? 1 : 0;
        this.question = '';
        this.answer = [];
        this.correctAnswer = [];
        this.category = '';
        this.question = question;
        this.category = category;
    };

    addAnswer(answer) {
        this.answer.push(answer);
    };

    addCorrectAnswer(correctAnswer) {
        this.answer.push(correctAnswer);
        this.correctAnswer.push(correctAnswer);
    };

    getQuestion() {
        return this.question;
    };

    getAnswer() {
        return this.answer;
    };

    getCorrectAnswer() {
        return this.correctAnswer;
    };

    getCategory() {
        return this.category;
    };
};

async function getQuestions() {
    const credentials = require('private/credentials.json');
    const spreadsheetId = '1076c6YbIb7hVe2tM_uTvbwXEKW9ffpp834Zy7KVkzfI';
    const sheetSync = new SheetSync(credentials, spreadsheetId);
    let questions = [];
    let sheetData = [];

    try {
        sheetData = await sheetSync.readSheet('Questions!A:Z');
    } catch (error) {
        console.error('Read of the question sheet failed:', error);
        return [];
    }

    if (!sheetData || sheetData.length === 0) return [];

    sheetData.shift();

    if (sheetData.length > 0 && (!sheetData[sheetData.length-1] ||
        sheetData[sheetData.length-1].length === 0)) {
        sheetData.pop();
    }

    sheetData.forEach(element => {
        if (!element || element.length < 2) return;
        const question = new Question(element[0], element[1], element[2],
            element[3]);
        for (let i = 4; i < element.length; i+=2) {
            if (i+1 < element.length && element[i+1] === "Oui") {
                question.addCorrectAnswer(element[i]);
            } else if (element[i]) {
                question.addAnswer(element[i]);
            }
        }
        questions.push(question);
    });
    return questions;
}

module.exports = getQuestions;
