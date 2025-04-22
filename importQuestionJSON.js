/*
** EPITECH PROJECT, 2025
** RoueFortuneSante
** File description:
** importQuestionJSON
*/

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
    }

    addAnswer(answer) {
        this.answer.push(answer);
    }

    addCorrectAnswer(correctAnswer) {
        this.answer.push(correctAnswer);
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

    getPriority() {
        return this.priority;
    }
}

// Ouais c'est moche je sais mais bon j'ai pas trouvé d'autres moyens pour le moment ca me saoule mdr
const csvData = `ID,Priorité,Question,Thème,Réponse1,Valide?,Réponse2,Valide?,Réponse3,Valide?,Réponse4,Valide?,Réponse5,Valide?,Réponse6,Valide?,Réponse7,Valide?,Réponse8,Valide?,Réponse9,Valide?,Réponse10,Valide?,Réponse11,Valide?
0,Obligatoire,Pensez vous que Manitou soit concerné par l’obligation d’assurer un suivi en santé au travail de ses salariés ?,Questions générales,Oui,Oui,Non,Non,"Oui, uniquement si le salarié a des soucis de santé.",Non,,,,,,,,,,,,,,,,
1,,"Selon vous, quelles sont les principales missions du Pôle Santé ? (plusieurs réponses possibles)",Questions générales,Prévention des risques professionnels,Oui,Surveillance de l'état de santé des salariés,Oui,Conseiller les actions de maintien dans l'emploi,Oui,Remplacer le médecin généraliste : faire les ordonnances et certificats de sport,Non,,,,,,,,,,,,,,
2,,Quels professionnels composent l'équipe du Pôle Santé ? (plusieurs réponses possibles),Questions générales,"Médecin du travail, infirmiers en santé au travail, assistante médicale en santé au travail",Oui,"Psychologue du travail, assistante sociale",Oui,"Ergonome, HSE",Non,"RH, chef d'équipe",Non,,,,,,,,,,,,,,
3,,Quel est le rôle du médecin du travail ?,Questions générales,Soigner les maladies professionnelles,Non,Evaluer l'aptitude au poste de travail,Oui,"Prescrire des arrêts de travail, réaliser les certificats de sport",Non,Rechercher les postes de reclassement pour les salariés inaptes,Non,,,,,,,,,,,,,,
4,,En quoi le Pôle Santé intervient dans le maintien dans l'emploi ?,Questions générales,Le Pôle Santé propose des aménagements du poste de travail ou des restrictions,Oui,Le Pôle Santé accompagne à la réalisation des dossiers RQTH,Oui,Le Pôle Santé n'agit que pour les personnes en situation de handicap,Non,Le Pöle Santé collabore avec des organismes externes,Oui,,,,,,,,,,,,,,
5,,Quel est le principal responsable de l'organisation et du suivi en santé au travail des salariés,Visites médicales,Le salarié,Non,Le médecin du travail / employeur,Non,Le service des ressources humaines,Oui,L'assisante médicale en santé au travail,Non,,,,,,,,,,,,,,
6,,"Quelles sont, selon vous, les principales utilités des visites en santé au travail ? (plusieurs réponses possibles)",Visites médicales,Vérifier l'aptitude au poste de travail et détecter les problèmes de santé liés au travail,Oui,Evaluer l'exposition aux risques professionnels et conseiller sur leur prévention,Oui,Pour déterminer si le salarié est en bonne forme physique,Non,Trouver un poste de travail adapté,Non,,,,,,,,,,,,,,
7,,Je suis apte à mon poste de travail donc,Visites médicales,Je n'ai aucune maladie,Non,Mon état de santé est compatible avec les exigences du poste,Oui,Je suis motivée à venir travailler,Non,Je suis capable de réaliser le trajet domicile - travail,Non,,,,,,,,,,,,,,
8,,Quels types de visite en santé au travail sont obligatoires pour les salariés ?,Visites médicales,Une visite d'embauche,Oui,Une visite annuelle avec un médecin généraliste,Non,Une visite périodique,Oui,Aucune visite médicale n'est obligatoire,Non,,,,,,,,,,,,,,
9,,A quelle fréquence pensez-vous que les visites obligatoires en santé au travail doivent être réalisées ?,Visites médicales,A la demande de l'employeur,Non,Uniquement en cas de besoin,Non,La périodicité des visites dépend des risques professionnels auxquels le salarié est exposé et de son état de santé,Oui,Il n'y a pas de visite obligatoire en santé au travail,Non,,,,,,,,,,,,,,
10,,Qui peut demander un rendez-vous avec le Pôle Santé pendant un arrêt de travail ?,Visites médicales,Le salarié,Oui,Le service RH / responsable de service,Non,Le médecin traitant / le médecin conseil de la CPAM,Oui,Le médecin du travail,Oui,,,,,,,,,,,,,,
11,,Que peut comprendre une visite en santé au travail ?,Visites médicales,Un entretien individuel / examen clinique,Oui,"Des examens complémentaires (prise de sang, analyse d'urine ...)",Oui,Renouvellement d'ordonnance du médecin traitant / réalisation des certificats de sport (uniquement s'il reste du temps),Non,Prescription du temps partiel thérapeutique,Non,,,,,,,,,,,,,,
12,,Quels sont les objectifs principaux des examens réalisés lors des visites en santé au travail,Visites médicales,Détecter et soigner les maladies courantes,Non,Contrôler la prise de stupéfiants,Non,Evaluer l'aptitude à exercer votre poste de travail en tenant compte de votre état de santé et des risques professionnels,Oui,Evaluer l'état de santé général,Non,,,,,,,,,,,,,,
13,,Quels types de risques un service de santé au travail aide-t-il à prévenir ?,Prévention des risques professionnels,Les risques physiques,Oui,Les risques chimiques,Oui,Les risques psychosociaux,Oui,Les risques en lien avec le trajet domicile / travail,Non,,,,,,,,,,,,,,
14,,Comment le Pôle Santé contribue-t-il à la prévention des risques professionnels ?,Prévention des risques professionnels,En réalisant des visites des lieux de travail et en analysant les risques professionnels,Oui,En conseillant l'employeur sur l'aménagement des postes de travail,Oui,En réalisant le document unique d'évaluation des risques professionnels (DUER),Non,"Aucun, il ne fait que des visites de santé au travail",Non,,,,,,,,,,,,,,
15,,Comment le Pôle Santé peut-il améliorer l'ergonomie d'un poste de travail ?,Prévention des risques professionnels,En réalisant une étude ergonomique et en proposant des aménagements,Oui,En demandant au salarié de s'adapter aux conditions existantes,Non,En remplaçant systématiquement le matériel tous les ans,Non,En sensibilisant à l'utilisation de matériel sur le poste de travail,Oui,,,,,,,,,,,,,,
16,,Qui peut solliciter l'intervention du Pôle Santé en matière de prévention des risques professionnels ?,Prévention des risques professionnels,Le responsable du salarié,Oui,Le service des ressources humaines,Oui,Les salariés,Oui,Les clients de l'entreprise,Non,,,,,,,,,,,,,,
17,,Pourquoi le Pôle Santé vous conseille-t-il de porter vos Equipements de Protections Individuel (EPI) ?,Prévention des risques professionnels,Pour éviter de salir vos vêtements de travail,Non,Parce que le service HSE doit liquider ses stocks obsolète d'EPI,Non,Pour vous protéger des risques professionnels auxquels vous êtes exposé(s),Oui,Pour que tous les salariés aient la bonne tenue,Non,,,,,,,,,,,,,,
18,,Quelle est la différence entre un médecin généraliste et un médecin du travail ?,,Il n'y a aucune différence,Non,Le médecin du travail se concentre sur la prévention des risques professionnels,Oui,"Le médecin du travail peut, au même titre qu'un médecin généraliste, vous prescrire des antibiotiques",Non,Le médecin généraliste peut également donner des recommandations d'aménagement du poste de travail de son patient,Non,,,,,,,,,,,,,,`

async function parseCSV(text) {
    const lines = text.split('\n');
    const dataLines = lines.filter(line => !line.startsWith('//') && line.trim().length > 0);
    const headers = dataLines[0].split(',');
    const rows = [];
    for (let i = 1; i < dataLines.length; i++) {
        const line = dataLines[i];
        if (!line.trim()) continue;
        const values = [];
        let currentValue = "";
        let insideQuote = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                insideQuote = !insideQuote;
            } else if (char === ',' && !insideQuote) {
                values.push(currentValue);
                currentValue = "";
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue);
        if (values.length > 0 && values[0].trim()) {
            rows.push(values);
        }
    }
    return { headers, rows };
}

async function createQuestionsFromCSV(csvData) {
    const questions = [];
    const { headers, rows } = csvData;
    for (const row of rows) {
        if (!row[0] || !row[2]) continue;
        const id = row[0];
        const priority = row[1] || "";
        const questionText = row[2];
        const category = row[3] || "";
        const question = new Question(id, priority, questionText, category);
        for (let i = 4; i < row.length; i += 2) {
            const answerText = row[i];
            const isCorrect = (i + 1 < row.length && row[i + 1] === "Oui");
            if (answerText && answerText.trim()) {
                if (isCorrect) {
                    question.addCorrectAnswer(answerText);
                } else {
                    question.addAnswer(answerText);
                }
            }
        }
        questions.push(question);
    }
    return questions;
}

// Use embedded CSV data instead of fetching
async function getQuestions() {
    try {
        // Instead of fetching, use the hardcoded CSV data
        const parsedData = await parseCSV(csvData);
        const questions = await createQuestionsFromCSV(parsedData);

        console.log(`Successfully loaded ${questions.length} questions from CSV`);
        return questions;
    } catch (error) {
        console.error('Error loading questions:', error);
        return [];
    }
}

// Make getQuestions available in the browser
window.getQuestions = getQuestions;
