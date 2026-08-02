from flask import Flask
from flask import url_for
from flask import render_template
import os

app = Flask(__name__)

@app.route("/")
def login():
    return "well you got into the site"

@app.route("/home")
def home():
    return "this is the home"


@app.route("/where")
def where():
    return url_for("home")

@app.route("/house")
def house():
    return url_for("home")

@app.route("/hobbies")
def hobbies():
    sports=[
        "soccer" , "basketball" , "football"
    ]
    return render_template("testlearn.html" , sports=sports)
    




app.run(debug=True)