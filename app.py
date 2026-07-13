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
    name = data["name"]
    # Validation: check if the name is empty.
    if name.strip() == "":
        return jsonify({"message": "Name cannot be empty."}), 400
    
        # Save the note to a text file (append mode).
    with open("notes.txt", "a") as file:
        file.write(note + "\n")
    # Return a JSON response indicating success.
    return jsonify({"message": "Note saved: " + note})


if __name__ == "__main__":
    app.run(debug=True)