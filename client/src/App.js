import React, {useState,useEffect} from "react";
import './App.css'
import './normal.css'


var has_exited = false;
//var session_completed = false;
var questionIndex = 0;

const userName = "Please enter your Name: "
const userEmail = "Please enter your Email: "
const userAge = "Please enter your Age: "
const userChristian = "Are you a Christian?: "
const userClass = "Are you part of Mrs. Shimada's Introduction to AI class?: "
const userQuestions = [userName, userEmail, userAge, userChristian, userClass]
//POST list for fetch requests for last five questions
const postList = ["https://r800360-cors.onrender.com/https://aichatbotspiritflaskbackend.pythonanywhere.com/nameResponse","https://r800360-cors.onrender.com/https://aichatbotspiritflaskbackend.pythonanywhere.com/emailResponse","https://r800360-cors.onrender.com/https://aichatbotspiritflaskbackend.pythonanywhere.com/ageResponse","https://r800360-cors.onrender.com/https://aichatbotspiritflaskbackend.pythonanywhere.com/christianResponse","https://r800360-cors.onrender.com/https://aichatbotspiritflaskbackend.pythonanywhere.com/classResponse"]
/*
function NewlineText(props) {
  const text = props.text;
  var textArray = text.split('\n');
  var outputArray = [];
  if (has_exited && !session_completed && text !== "Please enter your Name: ") {
    console.log("CHAT LOG PRINT")
    for (var i=0; i<textArray.length; i++) {
      outputArray.push(<p>{(i % 2 === 0 ? "user: " + textArray[i] : "bot: " + textArray[i])}</p>)
    }
  } else {
    outputArray = textArray.map(str => <p>{str}</p>);
  }
  return outputArray;
  
  return textArray.map(str => <p>{str}</p>);
}
*/

const ChatMessage = ({ message }) => {
  return (
    <div className = {`chat-message-container ${message.user === "bot" && "bot"}`}>
      <div className= "chat-message">
        <div className= {`avatar ${message.user === "bot" && "bot"}`}>
          
        </div>
        <span className={`message ${message.user === "bot" && "bot"}`} style={{"--n":53}}>
          {message.message}
        </span>
      </div>
    </div>
  )
}


function App() {

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([{
    user: "bot",
    message: "Hello, my name is the holey holy spirit bot. Feel free to ask me any questions reguarding the holy spirit!\nTo leave the chat, type 'exit' or 'good-bye'."
    //fetch("/startingText").then(response => response.text()).then(function (text) => {return text})//
  }]);

  //all app functions defined here

  useEffect(() => {
    scrollToEnd();
  });


  async function clearChat() {
    await setChatLog([]);
    await setChatLog([{
      user: "bot",
      message: "Hello, my name is the holely holy spirit bot. Feel free to ask me any questions reguarding the holy spirit!\nTo leave the chat, type 'exit' or 'good-bye'."
    }]);
    has_exited = false;
    questionIndex=0;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch("https://r800360-cors.onrender.com/https://aichatbotspiritflaskbackend.pythonanywhere.com/bigClean", requestOptions).then(response => response.json());
    
    //session_completed=false;
  }

  function scrollToEnd() {
    var cl = document.getElementById("chatLog")
    cl.scrollTo({top: cl.scrollHeight, behavior: "smooth",})
  }
  //User typed (exit or good-bye) or not
  //imma change this 
  //can you create the user question list here yup
  //no outside make it const

  //added retriever as a parameter in handleUserQuestionSubmit
  async function handleUserQuestionSubmit(e, retriever) {
    e.preventDefault();
    //console.log("Submit"); //scrollToEnd();
    //await setChatLog([ ...chatLog, {user: "User", message: `${input}`} ])
    var currentQuestion = "ERROR";

    //response to the previous user question. REMIND: make first userquestion appear in the first submit function
    let chatLogAlpha = [...chatLog, {user: "User", message: `${input}`} ]

    await setInput("");
    

    
    
    //Added new fetch request - question asked, response received, fetch request to send response to backend, repeat
    if (questionIndex < userQuestions.length) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(retriever)
      };
      console.log("FETCH Question index: " + questionIndex)
      fetch(postList[questionIndex], requestOptions).then(response => response.json());
      
      questionIndex+=1
      console.log("Question index: " + questionIndex)
      //added further conditional to handle questionIndex case logic
      if (questionIndex < userQuestions.length) {
        currentQuestion = userQuestions[questionIndex];
        await setChatLog([...chatLogAlpha, {user: "bot", message: currentQuestion}]);
      } else {
        await setChatLog([...chatLogAlpha, {user: "bot", message: `Click on the "New Chat" button on the top left corner to began a new chat.\nThank you for chatting with me!`}]);
      }
      //currentQuestion = userQuestions[questionIndex];
      //questionIndex+=1;
      //await setChatLog([...chatLogAlpha, {user: "bot", message: currentQuestion}])
    } else {
      await setChatLog([...chatLogAlpha, {user: "bot", message: `Click on the "New Chat" button on the top left corner to began a new chat.\nThank you for chatting with me!`}])
    }
    
  }

  async function handleSubmit(e, retriever) {
    e.preventDefault();
    //console.log("Submit"); //scrollToEnd();
    //await setChatLog([ ...chatLog, {user: "User", message: `${input}`} ])
    let chatLogAlpha = [...chatLog, {user: "User", message: `${input}`} ]

    await setInput("")
    //chatlog stringified
    //const messages = chatLogAlpha.map((message) => message.message).join("\n")
    //console.log(messages)
    //template bot response
    //await setChatLog([...chatLogAlpha, {user: "bot", message: "Sample message Alpha."} ])
    console.log("Retriever: " + retriever);
    console.log("Has exited: " + has_exited);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      //I change retriever to message: retriever
      body: JSON.stringify(retriever)
    };
    const response = await fetch("https://r800360-cors.onrender.com/https://aichatbotspiritflaskbackend.pythonanywhere.com/userResponse", requestOptions);
    const data = await response.json();
    //console.log(JSON.stringify(data))
    if (has_exited) {
      await setChatLog([...chatLogAlpha, {user: "bot", message: `${data.userResponse}`}, {user: "bot", message: userQuestions[questionIndex]}])
      //session_completed=true;
      //questionIndex+=1;
    } else {
      await setChatLog([...chatLogAlpha, {user: "bot", message: `${data.userResponse}`}])
    }
    //fetch("/userResponse", requestOptions).then(response => response.json()).then(mydata => setChatLog([...chatLog, {user: "bot", message: mydata.value} ]));
    
  }

  const keypressHandler = (e) => {
    var inputspace = document.getElementById("inputSpace")
    inputspace.style.height = inputspace.scrollHeight + "px"
  }

  const enterHandler = (e) => {
    var inputspace = document.getElementById("inputSpace")
    if (e.key === 'Enter') {
      //put post request here
      var retriever = inputspace.value
      //console.log(retriever)
      // POST request
      //scroll to bottom of chat-log when enter is pressed.
      //TODO: Add this for the bot's messages too
      //fetch("/userResponse", requestOptions).then(response => response.json()).then(mydata => console.log(mydata));
      if (has_exited === false && (retriever === "exit\n" || retriever === "good-bye\n")) {
        console.log("HAS EXITED")
        has_exited = true
        handleSubmit(e, retriever)
      } else if (has_exited === false) {
        handleSubmit(e, retriever)
      } else {
        handleUserQuestionSubmit(e, retriever)
      }

      
      inputspace.style.height= 10 + "%"
      //read value from chatbot input textarea into retriever variable
    }
  }
  //previous scrolling useEffect location

  return (
    <div className = "App">
      <aside className = "sidemenu">
        <div className = "side-menu-button" onClick={clearChat}>
          New Chat
        </div>
      </aside>  

      <section className="chatbox">
        <div className= "chat-log" id = "chatLog">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message}/>
            ))}
        </div>
        <div className="chat-input-holder" id = "inputSpaceHolder">
          <textarea
          id = "inputSpace" 
          value={input}
          rows = "1"
          className="chat-input-textarea" 
          placeholder="Type your message here."
          onChange={(e)=> {setInput(e.target.value); scrollToEnd()}}
          onKeyUp={enterHandler}
          onKeyDown={keypressHandler}/>
        </div>

      </section>
      
    </div>
  );
}

export default App;
