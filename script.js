let currentQuestion = 0;
let answers = [];
let scores = {
    "coral_crush": 0,
    "toasted_chili": 0,
    "sunset_babe": 0,
    "cherry_red": 0,
    "caramel_latte": 0,
    "raspberry_jam": 0
};

const questions = [
    { 
        text: "Wie würdest du deinen Hautton beschreiben?", 
        options: { 
            "Sehr hell bis hell mit kühlen Untertönen": "coral_crush", 
            "Mittel mit neutralen Untertönen": "toasted_chili", 
            "Oliv bis gebräunt mit warmen Untertönen": "caramel_latte", 
            "Dunkel mit warmen oder neutralen Untertönen": "cherry_red" 
        } 
    },
    { 
        text: "Welche Augenfarbe hast du?", 
        options: { 
            "Blau oder Grau": "coral_crush", 
            "Grün oder Haselnuss": "sunset_babe", 
            "Braun": "caramel_latte", 
            "Dunkelbraun oder Schwarz": "cherry_red" 
        } 
    },
    { 
        text: "Wie würdest du deinen Stil beschreiben?", 
        options: { 
            "Natürlich & dezent": "coral_crush", 
            "Klassisch & elegant": "toasted_chili", 
            "Mutig & auffällig": "cherry_red", 
            "Verspielt & romantisch": "sunset_babe" 
        } 
    },
    { 
        text: "Wofür trägst du am liebsten Lip Tints?", 
        options: { 
            "Für den Alltag – easy und unkompliziert": "coral_crush", 
            "Für besondere Anlässe": "toasted_chili", 
            "Um ein Statement zu setzen": "cherry_red", 
            "Für Dates oder Treffen mit Freunden": "raspberry_jam" 
        } 
    }
];

function renderQuestion() {
    const questionData = questions[currentQuestion];
    document.getElementById("question-text").innerText = questionData.text;
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
    
    for (const [key, value] of Object.entries(questionData.options)) {
        const button = document.createElement("button");
        button.innerText = key;
        button.onclick = function() { selectAnswer(button, value); };
        optionsContainer.appendChild(button);
    }
    document.getElementById("back-button").style.display = currentQuestion > 0 ? "block" : "none";
}

function selectAnswer(button, answerKey) {
    document.querySelectorAll(".options button").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    answers[currentQuestion] = { key: answerKey, text: button.innerText };
}

function nextQuestion() {
    if (answers[currentQuestion]) {
        scores[answers[currentQuestion].key] += 1;
        currentQuestion++;
        if (currentQuestion < questions.length) {
            renderQuestion();
        } else {
            showResult();
        }
    } else {
        alert("Bitte eine Antwort auswählen.");
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

function showResult() {
    let bestTints = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2);

    let resultHTML = "<p>Danke für deine Antworten! Deine empfohlenen Lip Tints:</p><div class='set-container'>";

    bestTints.forEach(([key]) => {
        let tint = lipTintLinks[key];
        if (tint) {
            resultHTML += `<div class='set'>
                            <a href="${tint.url}" target="_blank">
                                <img src="${tint.img}" alt="${tint.name}">
                                <p>${tint.name}</p>
                            </a>
                          </div>`;
        } else {
            resultHTML += `<div class='set'><p>Standard Lip Tint</p></div>`;
        }
    });

    resultHTML += "</div>";
    document.getElementById("quiz").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("result").innerHTML = resultHTML;

    saveToGoogleSheet(bestTints.map(tint => tint[0]));
    document.getElementById("restart-button").style.display = "block";
}

const lipTintLinks = {
    "coral_crush": { "name": "Coral Crush", "url": "#", "img": "coral_crush.jpg" },
    "toasted_chili": { "name": "Toasted Chili", "url": "#", "img": "toasted_chili.jpg" },
    "sunset_babe": { "name": "Sunset Babe", "url": "#", "img": "sunset_babe.jpg" },
    "cherry_red": { "name": "Cherry Red", "url": "#", "img": "cherry_red.jpg" },
    "caramel_latte": { "name": "Caramel Latte", "url": "#", "img": "caramel_latte.jpg" },
    "raspberry_jam": { "name": "Raspberry Jam", "url": "#", "img": "raspberry_jam.jpg" }
};

function saveToGoogleSheet(recommendedTints) {
    const dataToSend = {
        answers: answers.map(answer => answer.text),
        recommendedTints: recommendedTints
    };

    fetch("https://script.google.com/macros/s/AKfycbx9a2iCGOrCEVTLr5M9emPo4Y5aT6HA8S8hrm3JDRlRWDSYlHZ_dkqpq9qAtz6rNNjG8g/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
    })
    .then(() => console.log("Antwort erfolgreich gesendet."))
    .catch(error => console.error("Fehler beim Senden:", error));
}

function restartQuiz() {
    currentQuestion = 0;
    answers = [];
    for (let key in scores) {
        scores[key] = 0;
    }
    document.getElementById("result").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    document.getElementById("restart-button").style.display = "none";
    renderQuestion();
}

document.addEventListener("DOMContentLoaded", function() {
    renderQuestion();
});