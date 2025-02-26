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
            "Sehr hell bis hell mit kühlen Untertönen": ["coral_crush", "raspberry_jam"], 
            "Mittel mit neutralen Untertönen": ["toasted_chili", "sunset_babe"], 
            "Oliv bis gebräunt mit warmen Untertönen": ["caramel_latte", "toasted_chili"], 
            "Dunkel mit warmen oder neutralen Untertönen": ["cherry_red", "raspberry_jam"]
        } 
    },
    { 
        text: "Welche Augenfarbe hast du?", 
        options: { 
            "Blau oder Grau": ["coral_crush", "raspberry_jam"], 
            "Grün oder Haselnuss": ["sunset_babe", "toasted_chili"], 
            "Braun": ["caramel_latte", "cherry_red"], 
            "Dunkelbraun oder Schwarz": ["cherry_red", "raspberry_jam"]
        } 
    },
    { 
        text: "Wie würdest du deinen Stil beschreiben?", 
        options: { 
            "Natürlich & dezent": ["coral_crush", "sunset_babe"], 
            "Klassisch & elegant": ["toasted_chili", "caramel_latte"], 
            "Mutig & auffällig": ["cherry_red", "raspberry_jam"], 
            "Verspielt & romantisch": ["sunset_babe", "coral_crush"]
        } 
    },
    { 
        text: "Wofür trägst du am liebsten Lip Tints?", 
        options: { 
            "Für den Alltag – easy und unkompliziert": ["coral_crush", "sunset_babe"], 
            "Für besondere Anlässe": ["toasted_chili", "caramel_latte"], 
            "Um ein Statement zu setzen": ["cherry_red", "raspberry_jam"], 
            "Für Dates oder Treffen mit Freunden": ["raspberry_jam", "sunset_babe"]
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

function selectAnswer(button, answerKeys) {
    document.querySelectorAll(".options button").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");

    // Speichere alle empfohlenen Farben
    answers[currentQuestion] = { keys: answerKeys, text: button.innerText };

    // Erhöhe Punkte für alle empfohlenen Farben
    answerKeys.forEach(key => {
        scores[key] += 1;
    });
}


function nextQuestion() {
    if (answers[currentQuestion]) {
        answers[currentQuestion].keys.forEach(key => {
            scores[key] += 1;  // Erhöhe die Punktzahl für ALLE empfohlenen Farben
        });

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
    // Sortiere die Farben nach Punktzahl (höchste zuerst)
    let sortedTints = Object.entries(scores)
        .filter(([key, value]) => value > 0) // Entferne Farben mit 0 Punkten
        .sort((a, b) => b[1] - a[1]);

    // Falls keine Farben eine Punktzahl haben, wähle zwei zufällig
    if (sortedTints.length === 0) {
        sortedTints = Object.entries(scores).sort(() => Math.random() - 0.5).slice(0, 2);
    }

    // Stelle sicher, dass IMMER zwei Farben empfohlen werden
    let bestTints = sortedTints.slice(0, 2);

    // Falls es nur eine Farbe gibt, wähle eine Backup-Farbe
    if (bestTints.length < 2) {
        let backupTints = Object.entries(scores)
            .filter(([key]) => !bestTints.some(([selectedKey]) => selectedKey === key))
            .sort(() => Math.random() - 0.5);
        if (backupTints.length > 0) {
            bestTints.push(backupTints[0]);
        }
    }

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
        }
    });

    resultHTML += "</div>";
    document.getElementById("quiz").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("result").innerHTML = resultHTML;

    // Speichert die Ergebnisse in Google Sheets
    saveToGoogleSheet(bestTints.map(tint => tint[0]));

    document.getElementById("restart-button").style.display = "block";
}







const lipTintLinks = {
    "coral_crush": { 
        "name": "Coral Crush", 
        "url": "https://www.venicebeauty.de/produkt/lip-tint-tattoo-effect-2/?utm_source=quiz&utm_medium=lip_tint&utm_campaign=quiz_result", 
        "img": "https://www.venicebeauty.de/wp-content/uploads/2023/12/Lip-Tint_Corral-Crush_2-1024x1024.jpg" 
    },
    "toasted_chili": { 
        "name": "Toasted Chili", 
        "url": "https://www.venicebeauty.de/produkt/lip-tint-tattoo-effect-2/?utm_source=quiz&utm_medium=lip_tint&utm_campaign=quiz_result", 
        "img": "https://www.venicebeauty.de/wp-content/uploads/2023/12/Lip-Tint_Toasted-Chilli_2-1024x1024.jpg" 
    },
    "sunset_babe": { 
        "name": "Sunset Babe", 
        "url": "https://www.venicebeauty.de/produkt/lip-tint-tattoo-effect-2/?utm_source=quiz&utm_medium=lip_tint&utm_campaign=quiz_result", 
        "img": "https://www.venicebeauty.de/wp-content/uploads/2024/03/Lip-Tint_Sunset-Babe_2-1024x1024.jpg" 
    },
    "cherry_red": { 
        "name": "Cherry Red", 
        "url": "https://www.venicebeauty.de/produkt/lip-tint-tattoo-effect-2/?utm_source=quiz&utm_medium=lip_tint&utm_campaign=quiz_result", 
        "img": "https://www.venicebeauty.de/wp-content/uploads/2024/03/Lip-Tint_Cherry-Red_2-1024x1024.jpg" 
    },
    "caramel_latte": { 
        "name": "Caramel Latte", 
        "url": "https://www.venicebeauty.de/produkt/lip-tint-tattoo-effect-2/?utm_source=quiz&utm_medium=lip_tint&utm_campaign=quiz_result", 
        "img": "https://www.venicebeauty.de/wp-content/uploads/2024/05/lip-tint-caramel-latte-1024x1024.jpg" 
    },
    "raspberry_jam": { 
        "name": "Raspberry Jam", 
        "url": "https://www.venicebeauty.de/produkt/lip-tint-tattoo-effect-2/?utm_source=quiz&utm_medium=lip_tint&utm_campaign=quiz_result", 
        "img": "https://www.venicebeauty.de/wp-content/uploads/2023/12/lip-tint-raspberry-jam-1-1024x1024.jpg" 
    }
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
