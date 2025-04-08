const getQuestions = require('./getQuestions');

async function main() {
    try {
        const questions = await getQuestions();
        console.log(questions);
    } catch (error) {
        console.error('Error getting questions:', error);
    }
}

main();