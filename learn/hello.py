# http://127.0.0.1:5000

import os
from flask import render_template
from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    hobbies={
        # "gaming" , "coding" , "reading"
    }
    return render_template("home.html" , name="Human" , hobbies=hobbies)

@app.route("/about")
def about():
    return "They not really care about us"

@app.route("/user/<name>")
def user_name(name):
    return ("hello " + name)

@app.route("/user/<int:age>")
def user_age(age):
    return "next year you will be " + str(age+1) + " years old"

if __name__ == "__main__":
    app.run(debug=True)