// Find the button, the input field, and the response area by their id.
const button = document.getElementById("sendButton");
const input = document.getElementById("userInput");
const responseArea = document.getElementById("response");
// Find the notes list by its id.
const notesList = document.getElementById("notesList");

// When the button is clicked, run this function.
button.addEventListener("click", function () {
    // Read the text the user typed.
    const name = input.value;

    // Validation: check if the field is empty.
    if (name.trim() === "") {
        responseArea.textContent = "Please enter your note.";
        return;
    }

    // Send the text to the backend as JSON.
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
            input.value = "";      // clear the input field
            loadNotes();           // refresh the notes list
        });
});

// Function that loads all notes from the backend and shows them.
function loadNotes() {
    fetch("/notes")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Clear the list first.
            notesList.innerHTML = "";
            // Add each note as a list item with a delete button.
            data.notes.forEach(function (note, index) {
                const li = document.createElement("li");
                li.textContent = note;

                  // Create an edit button for this note.
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.addEventListener("click", function () {
                    editNote(index, note);
                });
                // Create a delete button for this note.
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", function () {
                    deleteNote(index);
                });

                // Add the button to the list item.
                li.appendChild(editButton);
                li.appendChild(deleteButton);
                notesList.appendChild(li);
            });
        });
}

// Function that tells the backend to delete a note by its index.
function deleteNote(index) {
    fetch("/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: index })
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Refresh the list after deleting.
            loadNotes();
        });
}

// Function that asks for new text and tells the backend to edit a note.
function editNote(index, oldText) {
    // Show a small window to enter the new text (pre-filled with the old one).
    const newText = prompt("Edit your note:", oldText);

    // If the user clicked Cancel, prompt returns null — do nothing.
    if (newText === null) {
        return;
    }

    fetch("/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: index, new_text: newText })
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Refresh the list after editing.
            loadNotes();
        });
}

// Load notes when the page opens.
loadNotes();