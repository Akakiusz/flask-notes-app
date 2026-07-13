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
            // Add each note as a list item.
            data.notes.forEach(function (note) {
                const li = document.createElement("li");
                li.textContent = note;
                notesList.appendChild(li);
            });
        });
}

// Load notes when the page opens.
loadNotes();