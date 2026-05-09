// ==========================================
// Canvas-basierte Date-Ideen App
// Alles wird mit Canvas gezeichnet und Events verwendet
// ==========================================

// Canvas und Kontext holen
const canvas = document.getElementById('ideaCanvas');
const ctx = canvas.getContext('2d');

// Globale Variablen
let ideas = [];
let idCounter = 0;
let currentImageData = null;
let selectedRating = 0;
let titleText = '';
let descriptionText = '';
let mouseX = 0;
let mouseY = 0;

// ------------------------------
// Canvas-Größe setzen
// ------------------------------
canvas.width = 800;
canvas.height = 600;

// ------------------------------
// Beispielideen laden
// ------------------------------
function initializeExamples() {
    ideas = [
        {
            id: idCounter++,
            title: '🌳 Picknick im Park',
            description: 'Essen & Snacks vorbereiten\nDecke einpacken\nGetränke kaufen',
            rating: 4,
            image: 'bilder/picknick.jpg',
            done: false,
            y: 50 + (idCounter - 1) * 120  // Position auf Canvas
        },
        {
            id: idCounter++,
            title: '🎬 Kinoabend zuhause',
            description: 'Lieblingsfilm auswählen\nSnacks & Getränke vorbereiten\nGemütliche Sitzplätze schaffen',
            rating: 5,
            image: 'bilder/filmabend.jpeg',
            done: false,
            y: 50 + (idCounter - 1) * 120
        }
    ];
    drawCanvas();
}

// ------------------------------
// Canvas zeichnen
// ------------------------------
function drawCanvas() {
    // Hintergrund löschen
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Titel
    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.fillText('Date-Ideen Manager', 20, 30);

    // Eingabebereich zeichnen
    drawInputArea();

    // Ideen zeichnen
    ideas.forEach(idea => drawIdea(idea));
}

// ------------------------------
// Eingabebereich zeichnen
// ------------------------------
function drawInputArea() {
    // Hintergrund für Eingabe
    ctx.fillStyle = '#fff';
    ctx.fillRect(20, 350, 760, 200);
    ctx.strokeStyle = '#ddd';
    ctx.strokeRect(20, 350, 760, 200);

    // Titel-Label
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText('Titel:', 30, 375);

    // Titel-Eingabe (simuliert)
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(30, 380, 300, 25);
    ctx.strokeRect(30, 380, 300, 25);
    ctx.fillStyle = '#000';
    ctx.fillText(titleText || 'Titel eingeben...', 35, 397);

    // Beschreibung-Label
    ctx.fillText('Beschreibung:', 30, 420);

    // Beschreibung-Eingabe
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(30, 425, 500, 60);
    ctx.strokeRect(30, 425, 500, 60);
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    wrapText(descriptionText || 'Beschreibung eingeben...', 35, 440, 490, 16);

    // Bewertung zeichnen
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText('Bewertung:', 30, 500);
    for (let i = 1; i <= 5; i++) {
        ctx.fillStyle = i <= selectedRating ? '#ffd700' : '#ddd';
        ctx.fillText('⭐', 30 + (i-1) * 25, 520);
    }

    // Button zeichnen
    ctx.fillStyle = '#007bff';
    ctx.fillRect(600, 500, 100, 30);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('Hinzufügen', 615, 518);
}

// ------------------------------
// Idee zeichnen
// ------------------------------
function drawIdea(idea) {
    const y = idea.y;

    // Hintergrund der Karte
    ctx.fillStyle = idea.done ? '#e8f5e8' : '#fff';
    ctx.fillRect(20, y, 760, 100);
    ctx.strokeStyle = '#ddd';
    ctx.strokeRect(20, y, 760, 100);

    // Checkbox zeichnen
    ctx.fillStyle = idea.done ? '#28a745' : '#fff';
    ctx.fillRect(30, y + 10, 20, 20);
    ctx.strokeRect(30, y + 10, 20, 20);
    if (idea.done) {
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText('✓', 35, y + 25);
    }

    // Titel
    ctx.fillStyle = '#333';
    ctx.font = '18px Arial';
    ctx.fillText(idea.title, 60, y + 25);

    // Sterne-Bewertung
    ctx.fillStyle = '#ffd700';
    for (let i = 0; i < idea.rating; i++) {
        ctx.fillText('⭐', 60 + i * 20, y + 50);
    }

    // Löschen-Button
    ctx.fillStyle = '#dc3545';
    ctx.fillRect(720, y + 10, 50, 25);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('Löschen', 725, y + 25);
}

// ------------------------------
// Text umbrechen für Canvas
// ------------------------------
function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, currentY);
            line = words[i] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
}

// ------------------------------
// Mouse-Events
// ------------------------------
canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // Prüfe Klicks auf Ideen
    ideas.forEach(idea => {
        // Checkbox-Klick
        if (mouseX >= 30 && mouseX <= 50 && mouseY >= idea.y + 10 && mouseY <= idea.y + 30) {
            idea.done = !idea.done;
            drawCanvas();
        }

        // Löschen-Klick
        if (mouseX >= 720 && mouseX <= 770 && mouseY >= idea.y + 10 && mouseY <= idea.y + 35) {
            ideas = ideas.filter(i => i.id !== idea.id);
            // Positionen neu berechnen
            ideas.forEach((i, index) => i.y = 50 + index * 120);
            drawCanvas();
        }
    });

    // Hinzufügen-Button
    if (mouseX >= 600 && mouseX <= 700 && mouseY >= 500 && mouseY <= 530) {
        addIdea();
    }

    // Bewertungssterne
    for (let i = 1; i <= 5; i++) {
        if (mouseX >= 30 + (i-1) * 25 && mouseX <= 55 + (i-1) * 25 && mouseY >= 505 && mouseY <= 525) {
            selectedRating = i;
            drawCanvas();
        }
    }
});

// Für Text-Eingabe brauchen wir trotzdem HTML-Inputs (Canvas kann keine Texteingabe)
// Versteckte Inputs für echte Eingabe
const hiddenTitle = document.createElement('input');
hiddenTitle.style.position = 'absolute';
hiddenTitle.style.left = '-1000px';
document.body.appendChild(hiddenTitle);

const hiddenDesc = document.createElement('textarea');
hiddenDesc.style.position = 'absolute';
hiddenDesc.style.left = '-1000px';
document.body.appendChild(hiddenDesc);

// Events für versteckte Inputs
hiddenTitle.addEventListener('input', () => {
    titleText = hiddenTitle.value;
    drawCanvas();
});

hiddenDesc.addEventListener('input', () => {
    descriptionText = hiddenDesc.value;
    drawCanvas();
});

// Klick-Events für Eingabebereiche (simuliert Fokus)
canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // Titel-Bereich geklickt
    if (mouseX >= 30 && mouseX <= 330 && mouseY >= 380 && mouseY <= 405) {
        hiddenTitle.focus();
    }

    // Beschreibung-Bereich geklickt
    if (mouseX >= 30 && mouseX <= 530 && mouseY >= 425 && mouseY <= 485) {
        hiddenDesc.focus();
    }
});

// ------------------------------
// Neue Idee hinzufügen
// ------------------------------
function addIdea() {
    if (!titleText.trim()) {
        alert('Bitte Titel eingeben!');
        return;
    }

    const idea = {
        id: idCounter++,
        title: titleText,
        description: descriptionText,
        rating: selectedRating,
        image: currentImageData,
        done: false,
        y: 50 + ideas.length * 120
    };

    ideas.push(idea);

    // Form zurücksetzen
    titleText = '';
    descriptionText = '';
    selectedRating = 0;
    hiddenTitle.value = '';
    hiddenDesc.value = '';

    drawCanvas();
}

// ------------------------------
// Bild-Upload (bleibt gleich)
// ------------------------------
const uploadInput = document.querySelector('.upload input');
uploadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentImageData = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// ------------------------------
// Start
// ------------------------------
initializeExamples();