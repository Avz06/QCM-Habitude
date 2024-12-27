const questions = [
   {
       question: "Quelle est ta motivation principale pour développer cette habitude ?",
       options: ["Je ne sais pas...", "J'ai envie de faire quelque chose de productif ", "Je veux atteindre un objectif spécifique", "Je cherche à renforcer mon bien-être"],
       category: "Motivation"
   },
   {
       question: "À quelle fréquence pratiques-tu actuellement cette habitude ?",
       options: ["0-1 jour sur 7", "2-4 jours sur 7", "5-6 jours sur 7", "7 jours sur 7"],
       category: "Fréquence"
   },
   {
       question: "Quel est ton niveau de confiance en ta capacité à maintenir cette habitude ?",
       options: ["Quasi nulle", "Faible", "Moyenne", "Forte"],
       category: "Confiance"
   },
   {
       question: "As-tu identifié des obstacles potentiels à la mise en place de cette habitude ?",
       options: ["Non, et ça je m'en fiche", "Oui, mais je n'y fait pas attention", "Je ne sais pas ou du moins, j'essaie de les trouver...", "Oui, des petits obstacles"],
       category: "Obstacles"
   },
   {
       question: "As-tu un système de suivi pour cette habitude ?",
       options: ["Aucun suivi", "Seulement un suivi mental", "Suivi numérique (ex : application)", "Suivi manuscrit (ex : carnet/calendier)"],
       category: "Suivi"
   },
   {
       question: "Comment gères-tu les moments où tu manques de motivation ?",
       options: ["J'abandonne facilement", "Je lutte mais continue parfois", "Je persévère la plupart du temps", "J'ai des stratégies efficaces pour rester motivé"],
       category: "Résilience"
   },
   {
       question:"As-tu partagé ton habitude avec d'autres personnes ?",
       options:["Non, je le garde pour moi","J'en ai parlé à une personne","J'en ai parlé à quelques proches","J'ai un réseau de soutien"],
       category:"Soutien social"
   },
   {
        question:"Comment cette habitude s'intègre-t-elle dans ta routine quotidienne ?",
        options:["Elle n'est pas du tout intégrée","Elle est difficilement intégrée","Elle est partiellement intégrée","Elle est parfaitement intégrée"],
        category:"Intégration"
   },
   {
        question:"Quel est ton niveau de connaissance sur les bénéfices de cette habitude ?",
        options:["Très limité","Je connais les bases","Je suis plutôt bon","Je pourrais te les expliquer pendant 15 min"],
        category:"Connaissance"
   },
   {
        question:"Comment réagis-tu face aux échecs temporaires dans la pratique de cette habitude ?",
        options:["Je change d'habitude","Je me décourage facilement","Je me sens coupable mais je réessaie (sans analyser)","J'analyse mes erreurs et j'ajuste"],
        category:"Gestion des échecs"
   },
   {
        question:"Quels déclencheurs t'incitent à pratiquer cette habitude ?",
        options:["Quand j'ai envie","Lors d'un événements spécifiques (ex : à chaque fois que je sors dehors)","À une heure spécifique de la journée (ex : heure de déjeuner)","Après une autre habitude"],
        category:"Déclencheurs"
    },
];

// Variables globales
let currentQuestion = 0;
let answers = [];
let habitName = "";

function startQuiz() {
    console.log("Démarrage du quiz");
    habitName = document.getElementById('habit-name').value.trim();
    if (!habitName) {
        Swal.fire({
            title: 'Oops!',
            text: 'Oh tu as oublié d\'entrer le nom de ton habitude ;)',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return
    }

    document.getElementById('intro-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    currentQuestion = 0;
    answers = [];
    displayQuestion();
    updateProgressBar();
}

function updateProgressBar() {
   const progress = (currentQuestion / questions.length) * 100;
   document.querySelector('#progress-bar .progress').style.width = `${progress}%`;
}

function displayQuestion() {
    console.log("Affichage de la question", currentQuestion);
    const questionContainer = document.getElementById('question-container');
    const q = questions[currentQuestion];
    
    questionContainer.innerHTML = `
        <div class='question'>
            <p>${q.question}</p>
            ${q.options.map((option, index) => `
                <label>
                    <input type='radio' name='q${currentQuestion}' value='${index}'>
                    ${option}
                </label>`).join('')}
        </div>`;
        
    updateButtons();
}

function restartQuiz() {
    currentQuestion = 0;
    answers = [];

    document.getElementById('results').style.display = 'none';
    document.getElementById('intro-container').style.display = 'block';
    document.getElementById('habit-name').value = '';
}

function updateButtons() {
    document.getElementById('prev-btn').style.display = currentQuestion > 0 ? 'inline-block' : 'none';
    document.getElementById('next-btn').style.display = currentQuestion < questions.length - 1 ? 'inline-block' : 'none';
    document.getElementById('submit-btn').style.display = currentQuestion === questions.length - 1 ? 'inline-block' : 'none';
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('#progress-bar .progress').style.width = `${progress}%`;
}

function nextQuestion() {
    const selected = document.querySelector(`input[name='q${currentQuestion}']:checked`);
    if (!selected) {
        Swal.fire({
            title: 'Oops!',
            text: 'Oh, tu as oublié de sélectionner une réponse ;)',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    answers[currentQuestion] = parseInt(selected.value);
    
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        displayQuestion();
        updateProgressBar();
    } else {
        submitQuiz();
    }
}

function prevQuestion() {
    currentQuestion--;
    displayQuestion();
    updateProgressBar(); 
}

function submitQuiz() {
    console.log("Soumission du quiz");
    const selected = document.querySelector(`input[name='q${currentQuestion}']:checked`);
    if (!selected) {
        Swal.fire({
            title: 'Oops!',
            text: 'Oh, tu as oublié de sélectionner une réponse ;)',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    answers[currentQuestion] = parseInt(selected.value);
    displayResults();
}

function displayResults() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';

    const analysisData = analyzeAnswers();

    let resultsHTML = `
        <h2>Analyse de ton habitude : ${habitName}</h2>
        ${displayAnalysis(analysisData)}
        <div id="charts-container">
            <canvas id="barChart" class="spacing"></canvas>
            <canvas id="predictionChart" class="spacing"></canvas>
        </div>
        <button id="download-report" class="glow-button">Télécharge ton rapport personnalisé</button>
        <button id="restart-btn" class="glow-button">Recommencer l'analyse ?</button>
    `;

    resultsDiv.innerHTML = resultsHTML;

    createBarChart(analysisData);
    createPredictionChart(analysisData);

    document.getElementById('download-report').addEventListener('click', downloadReport);
    document.getElementById('restart-btn').addEventListener('click', restartQuiz);
}

function restartQuiz() {
    console.log("Redémarrage du quiz");
    currentQuestion = 0;
    answers = [];
    document.getElementById('results').style.display = 'none';
    document.getElementById('intro-container').style.display = 'block';
    document.getElementById('habit-name').value = '';
}

function analyzeAnswers() {
    let analysisData = {};
    questions.forEach((q, index) => {
        analysisData[q.category] = analysisData[q.category] || { score: 0, count: 0 };
        analysisData[q.category].score += answers[index];
        analysisData[q.category].count++;
    });

    Object.keys(analysisData).forEach(category => {
        analysisData[category].average = analysisData[category].score / analysisData[category].count;
        analysisData[category].interpretation = interpretScore(category, analysisData[category].average);
    });

    return analysisData;
}

function displayAnalysis(analysisData) {
    let analysisHTML = `
        <div class='analysis-results'>
            <h3>Analyse Détaillée</h3>
            <div class="table-container spacing"> <!-- Ajoutez la classe ici -->
                <table class="analysis-table">
                    <thead>
                        <tr>
                            <th>Catégorie</th>
                            <th>Score</th>
                            <th>Niveau</th>
                            <th>Interprétation</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    Object.entries(analysisData).forEach(([category, data]) => {
        const scorePercentage = (data.average / 3) * 100;
        const scoreColor = getScoreColor(scorePercentage);
        const level = getScoreLevel(scorePercentage);
        
        analysisHTML += `
            <tr>
                <td class="category-cell">${category}</td>
                <td class="score-cell">
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${scorePercentage}%; background-color: ${scoreColor};">
                            ${data.average.toFixed(2)}
                        </div>
                    </div>
                </td>
                <td class="level-cell">
                    <span class="level-badge" style="background-color: ${scoreColor};">${level}</span>
                </td>
                <td class="interpretation-cell">${data.interpretation}</td>
            </tr>
        `;
    });

    analysisHTML += `
                </tbody>
            </table>
        </div>
    </div>
    `;

    return analysisHTML;
}

function getScoreColor(percentage) {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#8BC34A';
    if (percentage >= 40) return '#FFC107';
    if (percentage >= 20) return '#FF9800';
    return '#F44336';
}

function getScoreLevel(percentage) {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Bon';
    if (percentage >= 40) return 'Moyen';
    if (percentage >= 20) return 'Faible';
    return 'Critique';
}

function interpretScore(category, score) {
    const interpretations = {
        "Motivation": [
            "Ta motivation semble faible. Il serait intéressant de renforcer le 'pourquoi ?' cette habitude.",
            "Tu as une motivation moyenne. Essaie de trouver une façon de rendre ton habitude plus fun ('la gamifier') !",
            "Bonne motivation ! Continue à nourrir cette flamme.",
            "Excellente motivation ! Tu continues comme ça et c'est... GAGNÉ !"
        ],
        "Fréquence": [
            "La pratique est très rare. Si possible, essaie d'augmenter progressivement ta fréquence.",
            "Pratique occasionnelle. Vise une régularité plus importante, en augmentant petit à petit.",
            "Bonne fréquence de pratique. Cherche à la stabiliser.",
            "Excellente régularité ! Que dire... ;)"
        ],
        "Confiance": [
            "Ta confiance est basse. Regarde en quoi cette habitude contribuera à ton identité.",
            "Confiance modérée. Célèbre tes petites victoires pour la renforcer.",
            "Bonne confiance en toi. Continue à la cultiver.",
            "Excellente efficacité ! Que dire... ;)"
        ],
        "Obstacles": [
            "C'est vrai !? Pourquoi ? Car si tu les identifiais, ta progression pourrait aller plus vite !",
            "Identifiés mais non traité. Il serait intéressant de les aborder un par un pour progresser.",
            "Super, tu te mets dans une disposition de recherche afin de progresser. Continue ainsi ! ",
            "Des obstacles identifiés, et peut-être même contrer ! Continue comme ça !"
        ],
        "Suivi": [
            "Aucun suivi en place. Essaie de mettre en place un système simple.",
            "Suivi mental. Honnêtement, à moins que tu n'y arrives, ça peut paraitre anti-productif, et source de charge mentale inutile. Essaie de mettre en place un système simple.",
            "Système numérique de suivi. C'est une grande étape pour l'engagement intrinsèque.",
            "Système manuscrit de suivi ! Le meilleur, ton engagement est total, et ça te permet d'être au plus simple."
        ],
        "Résilience": [
            "Résilience faible. Si tu abandonnes facilement, essaie de voir si cette habitude est vraiment en accord avec tes valeurs.",
            "Résilience modérée. Essaie de renforcer ta capacité à rebondir, notamment en te forçant au début (P.S. ça travaille ta discipline).",
            "Bonne résilience. C'est super, toutefois, trouve le moyen d'encore la booster !",
            "Excellente résilience ! Que dire..."
        ],
                "Soutien social": [
            "Peu de soutien social. Certes, nous avons envie de grandir en secret, toutefois, le dire à quelqu'un peut permettre d'ouvrir certaines portes.",
            "Soutien limité. C'est super ! Tu l'as déjà dit à quelqu'un, soit tu peux continuer, soit tu peux t'arrêter, c'est amplement suffisant.",
            "Bon réseau de soutien. Les proches sont les meilleures soutiens !",
            "Excellent soutien social ! Une habitude en groupe est toujours plus facile que seul."
        ],
        "Intégration": [
            "Habitude peu intégrée. Essaie de la rendre plus visible dans ton quotidien.",
            "Intégration partielle. Essaie de la rendre plus naturelle.",
            "Bonne intégration. Essaie de peaufiner la fluidité d'exécution.",
            "Parfaite intégration ! Que dire..."
        ],
        "Connaissance": [
            "Connaissances limitées. Essaie de t'informer davantage sur les bénéfices, ça te permettra de comprendre pourquoi tu le fais.",
            "Connaissances de base. Un bon départ, toutefois, sais-tu combien de personne pratique cette habitude ? Et pourquoi ?",
            "Bonnes connaissances. Continue à t'informer, essaie de cherche la petite bête.",
            "Expertise élevée ! Ah ouais ? 15 min ? Eh bien je t'écoute ;)"
        ],
        "Gestion des échecs": [
            "Difficulté à gérer les échecs. Si tu changes facilement, d'habitude, cela signifie que cette habitude n'est pas aligné avec tes valeurs.",
            "Gestion moyenne des échecs. Être découragé ça arrive et c'est normal. Mais je te promets, que si tu t'y tiens, ça en vaudra la chandelle.",
            "Bonne gestion des échecs. Super ! Maintenants je ne peux que te conseiller d'analyser des erreurs.",
            "Excellente gestion des échecs ! Que dire..."
        ],
        "Déclencheurs": [
            "Ton déclencheur semble principalement due à ton envie, qui est souvent aléatoire. Essaye d'associer ton habitude à un événement spécifique.",
            "Ton déclencheur est bonne. C'est déjà super ! Prochain step : l'associer à heure précise, ou même à des repères visuels.",
            "Très bon déclencheur. C'est incroyable ! En plus de booster ton habitude, tu boostes ta discipline !",
            "Excellent déclencheur. Le stack d'habitude, est l'une des meilleures stratégies, pour ne pas dire la meilleure."
        ],
    };

    const index = Math.min(Math.floor(score), 3);
    return interpretations[category] ? interpretations[category][index] : "Que dire...";
}

function createBarChart(analysisData) {
    const ctx = document.getElementById('barChart').getContext('2d');
    const categories = Object.keys(analysisData);
    const scores = categories.map(cat => analysisData[cat].average);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Scores par catégorie',
                data: scores,
                backgroundColor: 'skyblue'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: 3,
                            yMax: 3,
                            borderColor: 'rgba(0, 255, 0, 0.8)',
                            borderWidth: 3, 
                            borderDash: [5, 5], 
                            z: 100,
                            label: {
                                content: 'maximum',
                                enabled: true,
                                position: 'end',
                                backgroundColor: 'rgba(0, 255, 0, 0.8)',
                                color: 'white'
                            }
                        },
                    }
                }
            }
        }
    });
}

function createPredictionChart(analysisData) {
    const ctx = document.getElementById('predictionChart').getContext('2d');
    const overallScore = Object.values(analysisData).reduce((sum, data) => sum + data.average, 0) / Object.keys(analysisData).length;
    const data = generatePredictionData(overallScore);
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => `${d.week}`),
            datasets: [{
                label: 'Prédiction de réalisation de l\'habitude',
                data: data.map(d => d.probability),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Semaines'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Probabilité de réalisation'
                    },
                    min: 0,
                    max: 1,
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Prédiction de ta réalisation de ton habitude si tu t\'y tiens !',
                    color: '#9b59b6'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Probabilité : ${(context.parsed.y * 100).toFixed(1)}%`;
                        }
                    }
                },
                annotation: {
                    annotations: {}
                }
            }
        }
    });
}

function generatePredictionData(initialScore) {
    const weeks = 12;
    let data = [];
    let initialProbability = Math.min(Math.max(initialScore / 3, 0), 1);

    for (let week = 0; week <= weeks; week++) {
        let currentProbability = initialProbability + (1 - initialProbability) * (1 - Math.exp(-0.4 * week));
        
        data.push({
            week: week,
            probability: currentProbability
        });
    }

    return data;
}

function animateResults(analysisData) {
    const analysisContainer = document.getElementById('analysis-container');

    Object.entries(analysisData).forEach(([category, data], index) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'insight-card animate__animated animate__fadeInUp';
            div.innerHTML = `
                <h3>${category}</h3>
                <p>${data.details}</p>
            `;
            analysisContainer.appendChild(div);
        }, index * 200);
    });
}

function downloadReport() {
    const analysisData = analyzeAnswers();

    let reportContent = `Rapport d'Analyse d'Habitude pour : ${habitName}\n\n`;
    
    reportContent += `Date : ${new Date().toLocaleDateString()}\n\n`;
    
    reportContent += `Analyse Détaillée :\n`;
    
    Object.entries(analysisData).forEach(([category, data]) => {
        reportContent += `${category} :\n`;
        reportContent += `- Score moyen : ${data.average.toFixed(2)} / 3\n`;
        reportContent += `⇒ ${data.interpretation}\n\n`;
    });

    const blob = new Blob([reportContent], { type: 'text/plain' });
    
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    
    a.style.display = 'none';
    
    a.href = url;
    
    a.download = `Rapport_Habitude_${habitName.replace(/\s+/g, '_')}.txt`;
    
    document.body.appendChild(a);
    
    a.click();
    
    window.URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initialisation des événements");
    document.getElementById('start-btn').addEventListener('click', startQuiz);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('prev-btn').addEventListener('click', prevQuestion);
    document.getElementById('submit-btn').addEventListener('click', submitQuiz);
});