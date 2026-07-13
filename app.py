# Flask notes app using SQLite database for storage.

from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Create the notes table if it doesn't exist yet.
def init_db():
    connection = sqlite3.connect("notes.db")
    connection.execute(
        "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    )
    connection.close()

init_db()

# Home page — returns the main HTML page.
@app.route("/")
def home():
    return render_template("index.html")

# Create: add a new note to the database.
@app.route("/greet", methods=["POST"])
def greet():
    data = request.get_json()
    note = data["name"]
    if note.strip() == "":
        return jsonify({"message": "Note cannot be empty."}), 400
    connection = sqlite3.connect("notes.db")
    connection.execute("INSERT INTO notes (content) VALUES (?)", (note.strip(),))
    connection.commit()
    connection.close()
    return jsonify({"message": "Note saved: " + note})

# Read: return all notes from the database.
@app.route("/notes")
def get_notes():
    connection = sqlite3.connect("notes.db")
    rows = connection.execute("SELECT id, content FROM notes").fetchall()
    connection.close()
    notes = []
    for row in rows:
        notes.append({"id": row[0], "content": row[1]})
    return jsonify({"notes": notes})

# Delete: remove a note by its id.
@app.route("/delete", methods=["POST"])
def delete_note():
    data = request.get_json()
    note_id = data["id"]
    connection = sqlite3.connect("notes.db")
    connection.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    connection.commit()
    connection.close()
    return jsonify({"message": "Note deleted."})

# Update: edit a note by its id.
@app.route("/edit", methods=["POST"])
def edit_note():
    data = request.get_json()
    note_id = data["id"]
    new_text = data["new_text"]
    if new_text.strip() == "":
        return jsonify({"message": "Note cannot be empty."}), 400
    connection = sqlite3.connect("notes.db")
    connection.execute("UPDATE notes SET content = ? WHERE id = ?", (new_text.strip(), note_id))
    connection.commit()
    connection.close()
    return jsonify({"message": "Note updated."})

if __name__ == "__main__":
    app.run(debug=True)