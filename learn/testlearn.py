from flask import Flask
from flask import url_for
from flask import render_template
import os
import logging 
import colorlog
from logging.handlers import RotatingFileHandler
from flask import jsonify
import random

app = Flask(__name__)

handler = colorlog.StreamHandler()
handler.setFormatter(colorlog.ColoredFormatter(
    "%(log_color)s%(asctime)s [%(levelname)s]%(reset)s %(blue)s%(name)s%(reset)s: %(message)s",
    datefmt="%H:%M:%S",
    log_colors={"DEBUG": "cyan", "INFO": "green", "WARNING": "yellow",
                "ERROR": "red", "CRITICAL": "bold_red"},

    
))
logging.basicConfig(level=logging.DEBUG, handlers=[handler]),
format=("[%(levelname)s] %(message)s")

# logging.basicConfig(
#     level=logging.DEBUG,
#     format="%(asctime)s [%(levelname)s] %(message)s" ,
#     datefmt="%H:%M:%S" ,
#     log_colors={"INFO": "purple"}

# )
log = logging.getLogger(__name__)
log.info("the system is running✔️")




class Book:
    def __init__(self, title , author):
        self.title = title
        self.author = author
    # def as_dict(self):
    #     return{
    #         "title": self.title,
    #         "author": self.author,
    #         "availbale": self.availbale,
    #     }

class book_available:
    def __init__(self):
        self.availbale = random.randint(1,2)

    def situation(self):
        if self.availbale == 1:
            return "availbale"
        else:
            return "borrowed"


book1= Book("Human" , "Einstein")
book2=Book("1939" , "idk")
book1_availbale = book_available()
book2_available = book_available()
@app.route("/books")
def books():
    log.info("returned the list of the books📕")
    all_books= [book1 , book2]
    return render_template("testlearn.html" , books=all_books)
    
@app.route("/borrow/<int:book_id>")
def borrows(book_id):
    book = book1_availbale if book_id == 1 else book2_available
    log.info("returned the availbalty of the book📙")
    return render_template("testlearn.html", book=book)
 

@app.route("/")
def login():
    return "well you got into the site"

@app.route("/home")
def home():
    log.info("user entered home🏠")
    return "this is the home"

try:
    1/0
except ZeroDivisionError:
    log.exception("Math went wrong‼️")

user_id, count = 42 , 7
log.debug("processing user %s with %d items", user_id , count)

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




# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s [%(levelname)s] %(message)s",
#     handlers=[
#         logging.StreamHandler(),
#         RotatingFileHandler("lesson.log", maxBytes=1000,
#                             backupCount=3, encoding="utf-8"),
#     ],
# )

# log = logging.getLogger(__name__)
# for i in range(200):
#     log.info("line number %d", i)

# student = {
#     "name": "Jonathan",
#     "age": 13,
#     "grade": 7
# }

# print(student["name"])   # Jonathan

# numbers = {1, 2, 3, 3, 4, 4}

# print(numbers)

# point = (10, 20)

# print(point[0])  # 10