# Simple Flask application to demonstrate a basic server setup.
from flask import Flask, render_template

app = Flask(__name__)

# Define a route for the home page that returns the main HTML page.
@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)