// Find the button, the input field, and the response area by their id.
const button = document.getElementById("sendButton");
const input = document.getElementById("userInput");
const responseArea = document.getElementById("response");
// Find the notes list by its id.
const notesList = document.getElementById("notesList");

// When the button is clicked, add a new note.
button.addEventListener("click", function () {
    const name = input.value;

    // Validation: check if the field is empty.
    if (name.trim() === "") {
        responseArea.textContent = "Please enter your note.";
        return;
    }

    // Send the note to the backend as JSON.
    fetch("/greet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name })
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            responseArea.textContent = data.message;
            input.value = "";
            loadNotes();
        });
});

// Function that loads all notes from the backend and shows them.
function loadNotes() {
    fetch("/notes")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            notesList.innerHTML = "";
            data.notes.forEach(function (note) {
                const li = document.createElement("li");
                li.textContent = note.content;

                // Edit button.
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.className = "edit-btn";
                editButton.addEventListener("click", function () {
                    editNote(note.id, note.content);
                });

                // Delete button.
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "delete-btn";
                deleteButton.addEventListener("click", function () {
                    deleteNote(note.id);
                });

                li.appendChild(editButton);
                li.appendChild(deleteButton);
                notesList.appendChild(li);
            });
        });
}

// Function that deletes a note by its id.
function deleteNote(id) {
    fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            loadNotes();
        });
}

// Function that edits a note by its id.
function editNote(id, oldText) {
    const newText = prompt("Edit your note:", oldText);
    if (newText === null) {
        return;
    }
    fetch("/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, new_text: newText })
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            loadNotes();
        });
}

// Load notes when the page opens.
loadNotes();