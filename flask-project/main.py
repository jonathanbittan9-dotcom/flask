from flask import Flask , request

app = Flask(__name__)

 
@app.route('/')
def index():
    return "<h1>Hello world</h1>"

@app.route('/hello')
def hello():
    return "hello world"

@app.route('/greet/<name>')
def greet(name):
    return f"hello {name}"

@app.route('/add/<int:number>/<int:number2>')
def add(number , number2):
    return f"{number} + {number2} = {number+number2}"

@app.route('/handle_url_paras')
def handle_paras():
    greeting = request.args.get('greeting')
    name = request.args.get('name')
    return f"{greeting} , {name}"

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    name = data.get('name')
    password = data.get('password')
    if name == "jonathan" and password == 123:
        return f"got name={name} , password={password} , logged in."
    else:
        return "you are banned from the server."


if __name__ == "__main__":
    print("got into the doc...")
    app.run(host='0.0.0.0' ,port=5555 ,debug=True)