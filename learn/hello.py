#################### notes for the learning ##################


## http://127.0.0.1:5000
## KZEUG_RUN_MAIN


##############################################################
import os
from flask import render_template
from flask import Flask
from flask import request
app = Flask(__name__)

# Anchor the log folder to THIS file's location, not the launch directory,
# so logs/app.log always sits next to hello.py no matter where you run from.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.join(BASE_DIR, "logs")
LOG_FILE = os.path.join(LOG_DIR, "app.log")

@app.route("/")
def home():
    hobbies={
        # "gaming" , "coding" , "reading"
    }
    return render_template("home.html" , name="Human" , hobbies=hobbies)

@app.route("/about")
def about():
    os.makedirs(LOG_DIR, exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as logfile:
        logfile.write("returned the about❓\n")
    return "They not really care about us"
    
@app.route("/user/<name>")
def user_name(name):
    return ("hello " + name)

@app.route("/user/<int:age>")
def user_age(age):
    return "next year you will be " + str(age+1) + " years old"
@app.route("/search")
def search():
    term = request.args.get("q" , "nothing")
    return "you searched for: " + term
if __name__ == "__main__":
    # Only the reloader's parent process runs this, so it logs exactly once.
    if os.environ.get("WERKZEUG_RUN_MAIN") != "true":
        os.makedirs(LOG_DIR, exist_ok=True)
        with open(LOG_FILE, "a", encoding="utf-8") as logfile:
            logfile.write("the system worked✔️\n")
    app.run(debug=True)
   

