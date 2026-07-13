# Simple Flask application to demonstrate a basic server setup.

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Define a route for the home page that returns the main HTML page.
@app.route("/")
def home():
    return render_template("index.html")

# Route that receives a name and returns a greeting.
@app.route("/greet", methods=["POST"])
def greet():
    data = request.get_json()
    note = data["name"]
    # Validation: check if the note is empty.
    if note.strip() == "":
        return jsonify({"message": "Note cannot be empty."}), 400
    # Save the note to a text file (append mode).
    with open("notes.txt", "a") as file:
        file.write(note + "\n")
    # Return a JSON response indicating success.
    return jsonify({"message": "Note saved: " + note})

# Route that reads all notes from the file and returns them.
@app.route("/notes")
def get_notes():
    notes = []
    try:
        with open("notes.txt", "r") as file:
            for line in file:
                notes.append(line.strip())
    except FileNotFoundError:
        notes = []
    return jsonify({"notes": notes})

# Route that deletes a note by its position (index).
@app.route("/delete", methods=["POST"])
def delete_note():
    data = request.get_json()
    index = data["index"]

    # Read all notes from the file.
    notes = []
    try:
        with open("notes.txt", "r") as file:
            for line in file:
                notes.append(line.strip())
    except FileNotFoundError:
        notes = []

    # Remove the note at the given index (if it exists).
    if 0 <= index < len(notes):
        notes.pop(index)

    # Write the remaining notes back to the file.
    with open("notes.txt", "w") as file:
        for note in notes:
            file.write(note + "\n")

    return jsonify({"message": "Note deleted."})

# Route that edits a note by its position (index).
@app.route("/edit", methods=["POST"])
def edit_note():
    data = request.get_json()
    index = data["index"]
    new_text = data["new_text"]

    # Validation: check if the new text is empty.
    if new_text.strip() == "":
        return jsonify({"message": "Note cannot be empty."}), 400

    # Read all notes from the file.
    notes = []
    try:
        with open("notes.txt", "r") as file:
            for line in file:
                notes.append(line.strip())
    except FileNotFoundError:
        notes = []

    # Replace the note at the given index (if it exists).
    if 0 <= index < len(notes):
        notes[index] = new_text.strip()

    # Write all notes back to the file.
    with open("notes.txt", "w") as file:
        for note in notes:
            file.write(note + "\n")

    return jsonify({"message": "Note updated."})

if __name__ == "__main__":
    app.run(debug=True)