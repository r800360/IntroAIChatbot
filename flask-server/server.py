from flask import Flask
from flask import request as flaskRequest
from flask import jsonify

import json
#import mysql.connector
import MySQLdb

#userName = "Please enter you Name: "
nameString = ""
#userEmail = "Please enter you Email: "
emailString = ""
#userAge = "Please enter you Age: "
ageString = ""
#userChristian = "Are you a Christian?: "
christianString = ""
#userClass = "Are you part of Mrs. Shimada's Introduction to AI class?: "
classString = ""

my_dictionary = {}


#update dictionary
file = open("/home/aichatbotspiritflaskbackend/mysite/bot_response.csv")
for line in file:
    splitLine = line.strip().split("|")
    my_dictionary[splitLine[0]] = splitLine[1]

queryList = []
botResponses = []

#removes punctuation and return edited word
def remove_punctuation(word):
    if word.isalpha():
        return word
    return word[0:-1]


def process_request(request):
    #split request string into a list spliting via " " then loop through each word to see if its one of the three key words
    requestList = request.strip().split(" ")
    for word in requestList:
        word = remove_punctuation(word.lower())
        if word in my_dictionary:
            return my_dictionary[word]
        #if (word == "internet" or word == "printer" or word == "computer"):
        #    print("Bot: We'll get your", word, "working in no time!")
        #    return

    #Couldn't find any keyword within request
    return "Sorry I don't know how to help you with this."

#START PYTHON FLASK CODE
app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, World!'

#HTTPS POST request to send user response to server, find bot response
#Then HTTP GET request to return bot response to frontend
@app.route("/userResponse", methods=['GET','POST'])

def userResponse():
    currentBotResponse = ""
    userString = remove_punctuation(flaskRequest.get_json().lower())
    #print(userString == "exit\n")
    if (userString != "exit" and userString != "good-bye"):
        queryList.append(userString)
        currentBotResponse += process_request(userString)
        currentBotResponse += "\nIs there anything else I can help with? To leave the chat, type 'exit' or 'good-bye'."
        botResponses.append(currentBotResponse)
    else:
        currentBotResponse += "Here are your logs for this session:\n"
        for i in range(len(queryList)):
            currentBotResponse += queryList[i]
            currentBotResponse += "\n"
            currentBotResponse += botResponses[i]
            currentBotResponse += "\n"
        currentBotResponse += "\n\n\nPlease answer the following questions for our records.\n"
    return {"userResponse": currentBotResponse}

#HTTP POST request to retrieve nameResponse
@app.route("/nameResponse", methods=['GET','POST'])

def nameResponse():
    global nameString
    nameString += flaskRequest.get_json()
    return jsonify('Done', 201)

#HTTP POST request to retrieve emailResponse
@app.route("/emailResponse", methods=['GET','POST'])

def emailResponse():
    global emailString
    emailString += flaskRequest.get_json()
    return jsonify('Done', 201)

#HTTP POST request to retrieve ageResponse
@app.route("/ageResponse", methods=['GET','POST'])

def ageResponse():
    global ageString
    ageString += flaskRequest.get_json()
    return jsonify('Done', 201)

#HTTP POST request to retrieve christianResponse
@app.route("/christianResponse", methods=['GET','POST'])

def christianResponse():
    global christianString
    christianString += flaskRequest.get_json()
    return jsonify('Done', 201)

#HTTP POST request to clean out user variables when New Chat is pressed
@app.route("/bigClean", methods=['GET','POST'])

def bigClean():
    global nameString
    global emailString
    global ageString
    global christianString
    global classString
    nameString = ""
    emailString = ""
    ageString = ""
    christianString = ""
    classString = ""
    queryList.clear()
    botResponses.clear()
    return jsonify('Done', 201)

#HTTP POST request to retrieve classResponse
@app.route("/classResponse", methods=['GET','POST'])

def classResponse():
    global nameString
    global emailString
    global ageString
    global christianString
    global classString
    classString += flaskRequest.get_json()
    sql = "INSERT INTO project3formresponses (NAME, EMAIL, AGE, CHRISTIAN, CLASS, QUERIES, RESPONSES) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    val = (nameString, emailString, ageString, christianString, classString, "\n".join(queryList), "\n".join(botResponses))
    print("sql: " + sql)
    print("val: ")
    for i in range(len(val)):
        print(val[i])

    #MYSQL Database Credentials
    #mydb = MySQLdb.connect(host="db4free.net",user="flaskchatbotdb",password="4wU&FxVoD%",database="introaichatbot")
    mydb = MySQLdb.connect("aichatbotspiritflaskbackend.mysql.pythonanywhere-services.com","aichatbotspiritf","4wU&FxVoD%","aichatbotspiritf$introaichatbot")
    mycursor = mydb.cursor()
    mycursor.execute(sql, val)
    mydb.commit()
    mycursor.close()
    mydb.close()

    nameString = ""
    emailString = ""
    ageString = ""
    christianString = ""
    classString = ""
    queryList.clear()
    botResponses.clear()
    return jsonify('Done', 201)

if __name__== "__main__":
    app.run(debug=False)