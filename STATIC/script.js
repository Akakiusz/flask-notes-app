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
        // Take the backend's answer and turn it from JSON into usable data.
        .then(function (response) {
            return response.json();
        })
        // Show the message on the page.
        .then(function (data) {
            responseArea.textContent = data.message;
        });
});