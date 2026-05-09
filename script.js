// ==========================================
// JavaScript für die Date-Ideen Webseite
// Dieses Skript macht die Seite interaktiv
// ==========================================

// ------------------------------
// TEIL 1: Elemente aus dem HTML holen
// Wir brauchen diese Elemente, um mit ihnen zu arbeiten
// ------------------------------

// Das ist der Button, der neue Ideen hinzufügt
const myButton = document.getElementById('myButton');

// Das Eingabefeld für den Titel der Idee
const titleInput = document.getElementById('title');

// Das Textfeld für die Beschreibung
const descriptionInput = document.getElementById('description');

// Die Liste, wo alle Ideen angezeigt werden
const ideaList = document.getElementById('ideaList');

// Zeigt an, wie viele Zeichen in der Beschreibung sind
const charCount = document.querySelector('.char-count');

// Alle Radio-Buttons für die Bewertung (Sterne)
const ratingInputs = document.querySelectorAll('input[name="bewertung"]');

// Das Eingabefeld für Bild-Uploads
const uploadInput = document.querySelector('.upload input');

// ------------------------------
// TEIL 2: Globale Variablen
// Diese speichern Daten, die wir im ganzen Programm brauchen
// ------------------------------

// Eine Liste (Array), die alle Ideen speichert
let ideas = [];

// Ein Zähler für eindeutige IDs jeder Idee
let idCounter = 0;

// Speichert das aktuell hochgeladene Bild als Daten-URL
let currentImageData = null;

// ------------------------------
// TEIL 3: Bild-Upload verarbeiten
// Wenn der User ein Bild auswählt, wird es hier gelesen
// ------------------------------

// Wenn sich etwas im Upload-Feld ändert (User wählt Datei aus)
uploadInput.addEventListener('change', function(e) {
    // Die ausgewählte Datei holen
    const file = e.target.files[0];

    // Prüfen, ob wirklich eine Datei ausgewählt wurde
    if (file) {
        // FileReader liest die Datei als Daten-URL (Base64)
        const reader = new FileReader();

        // Wenn das Lesen fertig ist, speichere das Bild
        reader.onload = function(event) {
            currentImageData = event.target.result;
        };

        // Starte das Lesen der Datei
        reader.readAsDataURL(file);
    }
});

// ------------------------------
// TEIL 4: localStorage – Daten dauerhaft speichern
// Alle Ideen werden im Browser gespeichert und beim nächsten
// Besuch automatisch wieder geladen
// ------------------------------

// Speichert alle Ideen als JSON im localStorage
function saveToStorage() {
    const data = {
        ideas: ideas,
        idCounter: idCounter
    };
    localStorage.setItem('dateIdeen', JSON.stringify(data));
}

// Lädt gespeicherte Ideen aus dem localStorage
// Gibt true zurück, wenn Daten gefunden wurden, sonst false
function loadFromStorage() {
    const stored = localStorage.getItem('dateIdeen');
    if (stored) {
        const data = JSON.parse(stored);
        ideas = data.ideas || [];
        idCounter = data.idCounter || 0;
        return true;
    }
    return false;
}

// ------------------------------
// TEIL 5: Beispielideen beim Start laden
// Prüft zuerst localStorage – nur wenn leer, werden Beispiele geladen
// ------------------------------

function initializeExamples() {
    // Prüfen ob bereits Daten im localStorage vorhanden sind
    if (loadFromStorage()) {
        // Gespeicherte Ideen anzeigen
        ideas.forEach(idea => renderIdea(idea));
        return;
    }

    // Falls keine gespeicherten Daten: Beispiele laden
    const examples = [
        {
            id: idCounter++,
            title: '🌳 Picknick im Park',
            description: 'Essen & Snacks vorbereiten\nDecke einpacken\nGetränke kaufen',
            rating: '4',
            image: 'bilder/picknick.jpg',
            done: false,
            expanded: false
        },
        {
            id: idCounter++,
            title: '🎬 Kinoabend zuhause',
            description: 'Lieblingsfilm auswählen\nSnacks & Getränke vorbereiten\nGemütliche Sitzplätze schaffen',
            rating: '5',
            image: 'bilder/filmabend.jpeg',
            done: false,
            expanded: false
        },
        {
            id: idCounter++,
            title: '👨‍🍳 Kochabend zusammen',
            description: 'Rezepte aussuchen\nZutaten einkaufen\nGemeinsam kochen\nTisch schön decken',
            rating: '4',
            image: 'bilder/kochabend.jpeg',
            done: false,
            expanded: false
        },
        {
            id: idCounter++,
            title: '🏙️ Stadttrip erkunden',
            description: 'Sehenswürdigkeiten planen\nÖffentliche Verkehrsmittel checken\nFotospots finden\nLokale Cafés entdecken',
            rating: '5',
            image: 'bilder/stadttrip.jpeg',
            done: false,
            expanded: false
        }
    ];

    // Kopiere die Beispiele in die globale Liste
    ideas = [...examples];

    // Zeige jede Beispiel-Idee auf der Seite an
    examples.forEach(idea => renderIdea(idea));

    // Beispiele auch im localStorage speichern
    saveToStorage();
}

// ------------------------------
// TEIL 6: Zeichen zählen
// Zeigt live an, wie viele Zeichen in der Beschreibung sind
// ------------------------------

// Wenn der User in das Beschreibungsfeld tippt
descriptionInput.addEventListener('input', function() {
    // Aktualisiere den Zähler-Text
    charCount.textContent = this.value.length + ' / 300 Zeichen';
});

// ------------------------------
// TEIL 7: Beschreibung in Punkte umwandeln
// Wandelt Komma-getrennten Text in eine Liste um
// ------------------------------

function parseDescription(description) {
    // Wenn keine Beschreibung da ist, leere Liste zurückgeben
    if (!description.trim()) return [];

    return description
        .replace(/\r/g, '')
        .replace(/[•\-\*\+]\s*/g, '\n')
        .split(/\n|,\s*|;\s*/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
}

// ------------------------------
// TEIL 8: HTML-Sonderzeichen escapen
// Verhindert, dass Nutzereingaben als HTML interpretiert werden
// ------------------------------

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ------------------------------
// TEIL 9: Neue Idee hinzufügen
// Wird ausgeführt, wenn der "Hinzufügen"-Button geklickt wird
// ------------------------------

myButton.addEventListener('click', function() {
    // Werte aus den Eingabefeldern holen und Leerzeichen entfernen
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    // Standard-Bewertung ist 0
    let rating = 0;

    // Schaue alle Bewertungs-Buttons durch
    ratingInputs.forEach(input => {
        if (input.checked) {
            rating = input.value;
        }
    });

    // Prüfen, ob ein Titel eingegeben wurde
    if (!title) {
        alert('Bitte gib einen Titel für deine Idee ein!');
        return;
    }

    // Erstelle ein neues Ideen-Objekt
    const idea = {
        id: idCounter++,
        title: title,
        description: description,
        rating: rating,
        image: currentImageData,
        done: false,
        expanded: false
    };

    // Füge die Idee zur Liste hinzu
    ideas.push(idea);

    // Zeige die Idee auf der Seite an
    renderIdea(idea);

    // Im localStorage speichern
    saveToStorage();

    // ------------------------------
    // Formular zurücksetzen für nächste Eingabe
    // ------------------------------

    titleInput.value = '';
    descriptionInput.value = '';
    charCount.textContent = '0 / 300 Zeichen';
    ratingInputs.forEach(input => input.checked = false);
    currentImageData = null;
    uploadInput.value = '';
    myButton.classList.remove('blue');
    titleInput.focus();
});

// ------------------------------
// TEIL 10: Eine Idee auf der Seite anzeigen
// Erstellt das HTML für eine Idee und fügt es hinzu
// Optional: insertBeforeElement gibt an, vor welchem Element eingefügt wird
// ------------------------------

function renderIdea(idea, insertBeforeElement = null) {
    // Wandele die Beschreibung in Bullet-Punkte um
    const bulletPoints = parseDescription(idea.description);

    // Erstelle Sterne für die Bewertung (z.B. ⭐⭐⭐⭐⭐)
    const starsHtml = '⭐'.repeat(idea.rating);

    // done-Klasse direkt setzen, damit der Status nach Reload korrekt ist
    const ideaHTML = `
        <div class="todo-card fade-in ${idea.done ? 'done' : ''}" data-id="${idea.id}">
            <div class="todo-card-content">
                <div class="todo-card-header">
                    <div class="todo-card-title-section">
                        <input type="checkbox" id="check-${idea.id}" ${idea.done ? 'checked' : ''}>
                        <h3 class="todo-card-title">${escapeHtml(idea.title)}</h3>
                    </div>
                    <div class="card-actions">
                        <span class="edit-btn" data-id="${idea.id}" title="Bearbeiten">✏️</span>
                        <span class="delete" data-id="${idea.id}">✖</span>
                    </div>
                </div>

                ${bulletPoints.length > 0 ? `
                    <button class="dropdown-toggle ${idea.expanded ? 'open' : ''}" data-id="${idea.id}">
                        <span class="dropdown-arrow">▼</span>
                        <span class="dropdown-text">Beschreibung</span>
                    </button>
                    <div class="dropdown-content ${idea.expanded ? 'open' : ''}" data-id="${idea.id}">
                        ${idea.image ? `<img src="${idea.image}" alt="${escapeHtml(idea.title)}" class="dropdown-image">` : ''}
                        <ul>
                            ${bulletPoints.map(point => `<li>${escapeHtml(point)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${starsHtml ? `<p class="todo-card-rating">${starsHtml}</p>` : ''}
            </div>
        </div>
    `;

    // Einfügen: entweder vor einem bestimmten Element oder am Ende der Liste
    if (insertBeforeElement) {
        insertBeforeElement.insertAdjacentHTML('beforebegin', ideaHTML);
    } else {
        ideaList.insertAdjacentHTML('beforeend', ideaHTML);
    }

    // ------------------------------
    // Event-Listener für die neue Karte hinzufügen
    // ------------------------------

    // Finde die gerade hinzugefügte Karte
    const todoCard = ideaList.querySelector(`[data-id="${idea.id}"]`);

    const toggleBtn = todoCard.querySelector('.dropdown-toggle');
    const contentDiv = todoCard.querySelector('.dropdown-content');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            idea.expanded = !idea.expanded;
            toggleBtn.classList.toggle('open');
            if (contentDiv) {
                contentDiv.classList.toggle('open');
            }
        });
    }

    // Checkbox: Idee als erledigt markieren und speichern
    const checkbox = todoCard.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function() {
        idea.done = this.checked;
        todoCard.classList.toggle('done');
        saveToStorage();
    });

    // Löschen-Button: Idee entfernen und speichern
    const deleteBtn = todoCard.querySelector('.delete');
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        ideas = ideas.filter(i => i.id !== idea.id);
        todoCard.remove();
        saveToStorage();
    });

    // Edit-Button: Bearbeitungsformular öffnen
    const editBtn = todoCard.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showEditForm(idea, todoCard);
        });
    }
}

// ------------------------------
// TEIL 11: Idee bearbeiten
// Zeigt ein Bearbeitungsformular direkt in der Karte an
// ------------------------------

function showEditForm(idea, cardElement) {
    const cardContent = cardElement.querySelector('.todo-card-content');

    // Sterne-Radio-Buttons für das Edit-Formular erzeugen
    const ratingHtml = [5, 4, 3, 2, 1].map(n => `
        <input type="radio" id="edit-stern${n}-${idea.id}" name="edit-rating-${idea.id}" value="${n}" ${idea.rating == n ? 'checked' : ''}>
        <label for="edit-stern${n}-${idea.id}" title="${n} Sterne">★</label>
    `).join('');

    // Karten-Inhalt durch ein Bearbeitungsformular ersetzen
    cardContent.innerHTML = `
        <div class="edit-form">
            <label class="edit-label">Titel</label>
            <input type="text" class="edit-title" value="${escapeHtml(idea.title)}" maxlength="100">
            <label class="edit-label">Beschreibung</label>
            <textarea class="edit-desc" maxlength="300">${escapeHtml(idea.description)}</textarea>
            <label class="edit-label">Bewertung</label>
            <div class="sterne edit-sterne">${ratingHtml}</div>
            <div class="edit-actions">
                <button class="save-edit-btn">💾 Speichern</button>
                <button class="cancel-edit-btn">✖ Abbrechen</button>
            </div>
        </div>
    `;

    // Speichern: Werte übernehmen, Karte neu rendern und im localStorage speichern
    cardContent.querySelector('.save-edit-btn').addEventListener('click', function() {
        const newTitle = cardContent.querySelector('.edit-title').value.trim();
        const newDesc = cardContent.querySelector('.edit-desc').value.trim();
        let newRating = idea.rating;

        cardContent.querySelectorAll(`input[name="edit-rating-${idea.id}"]`).forEach(input => {
            if (input.checked) newRating = input.value;
        });

        if (!newTitle) {
            alert('Titel darf nicht leer sein!');
            return;
        }

        // Idee-Objekt aktualisieren
        idea.title = newTitle;
        idea.description = newDesc;
        idea.rating = newRating;

        // Karte an der gleichen Position neu rendern
        const nextSibling = cardElement.nextElementSibling;
        cardElement.remove();
        renderIdea(idea, nextSibling);

        saveToStorage();
    });

    // Abbrechen: Karte ohne Änderungen wiederherstellen
    cardContent.querySelector('.cancel-edit-btn').addEventListener('click', function() {
        const nextSibling = cardElement.nextElementSibling;
        cardElement.remove();
        renderIdea(idea, nextSibling);
    });
}

// ------------------------------
// TEIL 12: Inspiration-Cards per DOM Manipulation erzeugen
// Die Cards werden mit createElement und appendChild in den DOM eingefügt –
// kein hartcodiertes HTML im index.html
// ------------------------------

// Statische Vorschlagsdaten für die Inspiration-Section
const inspirationItems = [
    {
        title: 'Picknick im Park',
        image: 'bilder/picknick.jpg',
        points: ['Essen & Snacks vorbereiten', 'Decke einpacken', 'Getränke kaufen'],
        rating: '⭐⭐⭐⭐'
    },
    {
        title: 'Kinoabend zuhause',
        image: 'bilder/filmabend.jpeg',
        points: ['Lieblingsfilm auswählen', 'Snacks & Getränke vorbereiten', 'Gemütliche Sitzplätze schaffen'],
        rating: '⭐⭐⭐⭐⭐'
    },
    {
        title: 'Städtetrip',
        image: 'bilder/stadttrip.jpeg',
        points: ['Sehenswürdigkeiten planen', 'Öffentliche Verkehrsmittel checken', 'Restaurants aussuchen'],
        rating: '⭐⭐⭐⭐⭐'
    },
    {
        title: 'Zusammen kochen',
        image: 'bilder/kochabend.jpeg',
        points: ['Rezept gemeinsam aussuchen', 'Zutaten teilen und vorbereiten', 'Musik für die Küche anmachen'],
        rating: '⭐⭐⭐⭐'
    }
];

function renderInspirationCards() {
    // Container-Element im DOM finden
    const box = document.getElementById('inspirationsbox');

    // Für jede Inspiration ein Card-Element erstellen und einfügen
    inspirationItems.forEach(function(item) {
        // Äußere Card
        const card = document.createElement('div');
        card.className = 'card';

        // Bild
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        card.appendChild(img);

        // Titel
        const title = document.createElement('h3');
        title.textContent = item.title;
        card.appendChild(title);

        // Punkte-Liste
        const list = document.createElement('ul');
        item.points.forEach(function(point) {
            const li = document.createElement('li');
            li.textContent = point;
            list.appendChild(li);
        });
        card.appendChild(list);

        // Bewertung
        const rating = document.createElement('p');
        rating.textContent = item.rating;
        card.appendChild(rating);

        // Card in den Container einfügen
        box.appendChild(card);
    });
}

// ------------------------------
// TEIL 13: Programm starten
// ------------------------------

// Inspiration-Cards per DOM Manipulation erzeugen
renderInspirationCards();

// Lade gespeicherte oder Beispiel-Ideen, wenn die Seite fertig geladen ist
initializeExamples();
