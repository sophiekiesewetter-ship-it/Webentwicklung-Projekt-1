// Formularelemente abrufen
const myButton = document.getElementById('myButton');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const ideaList = document.getElementById('ideaList');
const charCount = document.querySelector('.char-count');
const ratingInputs = document.querySelectorAll('input[name="bewertung"]');
const uploadInput = document.querySelector('.upload input');

// Ideen speichern
let ideas = [];
let idCounter = 0;
let currentImageData = null;

// Bild-Upload verarbeiten
uploadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            currentImageData = event.target.result;
            console.log('Bild hochgeladen');
        };
        reader.readAsDataURL(file);
    }
});

// Mit Beispielideen initialisieren
function initializeExamples() {
    const examples = [
        {
            id: idCounter++,
            title: '🌳 Picknick im Park',
            description: 'Essen & Snacks vorbereiten\nDecke einpacken\nGetränke kaufen',
            rating: '4',
            image: null,
            done: false,
            expanded: false
        },
        {
            id: idCounter++,
            title: '🎬 Kinoabend zuhause',
            description: 'Lieblingsfilm auswählen\nSnacks & Getränke vorbereiten\nGemütliche Sitzplätze schaffen',
            rating: '5',
            image: null,
            done: false,
            expanded: false
        }
    ];
    
    ideas = [...examples];
    examples.forEach(idea => renderIdea(idea));
}

// Zeichenanzahl aktualisieren
descriptionInput.addEventListener('input', function() {
    charCount.textContent = this.value.length + ' / 300 Zeichen';
});

// Beschreibung in Bulletpoints parsen
function parseDescription(description) {
    if (!description.trim()) return [];

    return description
        .replace(/\r/g, '')
        .replace(/[•\-\*\+]\s*/g, '\n')
        .split(/\n|,\s*|;\s*/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
}

// Neue Idee hinzufügen
myButton.addEventListener('click', function() {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    let rating = 0;
    
    // Ausgewählte Bewertung abrufen
    ratingInputs.forEach(input => {
        if (input.checked) {
            rating = input.value;
        }
    });
    
    // Validierung
    if (!title) {
        alert('Bitte gib einen Titel ein!');
        return;
    }
    
    // Ideen-Objekt erstellen
    const idea = {
        id: idCounter++,
        title: title,
        description: description,
        rating: rating,
        image: currentImageData,
        done: false,
        expanded: false
    };
    
    ideas.push(idea);
    renderIdea(idea);
    
    // Formular leeren
    titleInput.value = '';
    descriptionInput.value = '';
    charCount.textContent = '0 / 300 Zeichen';
    ratingInputs.forEach(input => input.checked = false);
    currentImageData = null;
    uploadInput.value = '';
    myButton.classList.remove('blue');
    
    titleInput.focus();
});

// Einzelne Idee rendern
function renderIdea(idea) {
    const bulletPoints = parseDescription(idea.description);
    const starsHtml = '⭐'.repeat(idea.rating);
    
    const ideaHTML = `
        <div class="todo-card fade-in" data-id="${idea.id}">
            ${idea.image ? `<img src="${idea.image}" alt="${idea.title}" class="todo-card-image">` : ''}
            <div class="todo-card-content">
                <div class="todo-card-header">
                    <div class="todo-card-title-section">
                        <input type="checkbox" id="check-${idea.id}" ${idea.done ? 'checked' : ''}>
                        <h3 class="todo-card-title">${idea.title}</h3>
                    </div>
                    <span class="delete" data-id="${idea.id}">✖</span>
                </div>
                
                ${bulletPoints.length > 0 ? `
                    <button class="dropdown-toggle ${idea.expanded ? 'open' : ''}" data-id="${idea.id}">
                        <span class="dropdown-arrow">▼</span>
                        <span class="dropdown-text">Beschreibung</span>
                    </button>
                    <div class="dropdown-content ${idea.expanded ? 'open' : ''}" data-id="${idea.id}">
                        <ul>
                            ${bulletPoints.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${starsHtml ? `<p class="todo-card-rating">${starsHtml}</p>` : ''}
            </div>
        </div>
    `;
    
    ideaList.insertAdjacentHTML('beforeend', ideaHTML);
    
    // Event-Listener hinzufügen
    const todoCard = ideaList.querySelector(`[data-id="${idea.id}"]`);
    
    // Dropdown umschalten
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
    
    // Checkbox umschalten
    const checkbox = todoCard.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function() {
        idea.done = this.checked;
        todoCard.classList.toggle('done');
    });
    
    // Löschen-Button
    const deleteBtn = todoCard.querySelector('.delete');
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        ideas = ideas.filter(i => i.id !== idea.id);
        todoCard.remove();
    });
}

// Mit Beispielen beim Laden der Seite initialisieren
initializeExamples();
