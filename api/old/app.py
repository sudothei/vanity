from flask import Flask, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from database import Users, getUser
from getAscii import getAscii
from functools import wraps

import level0

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
bcrypt = Bcrypt(app)

def login_required(func):
    @wraps(func)
    def wrap(*args, **kwargs):
        request_data = request.get_json()
        try:
            print(request_data['username'])
            user = getUser(request_data['username'])
        except:
            return "Please log in first"

        if bcrypt.check_password_hash(user.password, request_data['password']):
            return func(*args, **kwargs)
        else:
            return "Invalid password"
    return wrap

@app.route('/register', methods=['POST'])
def register():
    request_data = request.get_json()

    user = {
            "username": request_data['username'],
            "password": bcrypt.generate_password_hash(request_data['password']),
            "level": 0,
            "area" : 0,
            "inventory" : [
                "5 cigarettes",
                "smartwatch",
                "20 Karma credstick"
                ]
            }
    if Users.find_one({"username": user['username']}):
        return "Username already taken."

    Users.insert_one(user)
    return "REGISTERED :" + request_data['username']

@app.route('/login', methods=['POST'])
def login():
    request_data = request.get_json()

    try:
        user = getUser(request_data['username'])
    except:
        return "User does not exist."

    if bcrypt.check_password_hash(user.password, request_data['password']):
        return "LOGGED IN :" + request_data['username']
    else:
        return "Invalid password for account: " + request_data['username']

@app.route('/scoreboard', methods=['POST'])
def scoreboard():
    highest10 = Users.find().sort("level")
    highest10 = [ item for item in highest10 ][-10:]
    highest10 = map( lambda x: f"Level: {x['level']} - {x['username']}", highest10 )
    highest10 = "\n".join(highest10)
    return highest10

@app.route('/game', methods=['POST'])
@login_required
def game():

    request_data = request.get_json()

    user = getUser(request_data['username'])
    print(request_data['command'])

    if bcrypt.check_password_hash(user.password, request_data['password']):
        area = eval("level" + str( user.level ) + ".area" + str( user.area ) )
        if request_data['command'] == "start game":
            return area['prompt']
        elif request_data['command'] == "look":
            return area['prompt']
        elif request_data['command'] == "inventory":
            return "\n".join(user.inventory)
        elif request_data['command'] == "help":
            return """GAME COMMANDS
    inventory - view inventory
    look - look around"""
        else:
            result = ""
            for command in area['commands']:
                if command['ismatch'](request_data['command']):
                    nextArea = eval("level" + str( user.level ) + ".area" + str( command['goto'] ) )
                    result += nextArea['prompt']
                    user.updateArea(command['goto'])
                    if command['effects'] != None:
                        command['effects'](user)
                    if command['image'] != None:
                        # TODO
                        ascii = getAscii(command['image'])
                        result += ascii
                    return result
                else:
                    return 'Unknown command.'

    return "Stop that."

app.run(port=3333)
