import React, {useState} from 'react';
import {useParams} from 'react-router-dom';

import classes from './ChatScreen.css';
import Avatar from '@material-ui/core/Avatar';

const ChatScreen = (props) => {

  const [input, setInput] = useState('');

  //the first 2 messages are from astrid and the last one is from the logged in user that is talking to her
  const [messages, setMessages] = useState([
    {
      name: "Àstrid Bergès-Frisbey",
      text: "Heyy whats up?",
      image: "https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
    },
    {
      name: "Àstrid Bergès-Frisbey",
      text: "You looking fine",
      image: "https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
    },
    {
      text: "Heyy whats up?"
    }
  ])

  const params = useParams();
  console.log(params);

  const sendHandler = (event) => {
    event.preventDefault();

    //need to change the state in the reducer instead of this
    setMessages([...messages, { text: input}]);

    setInput("");
  }

  return (
    <div className={classes.chatScreen}>
      <p className={classes.timestamp}>YOU MATCHED WITH ASTRID ON 10/08/2020</p>
      {messages.map( (message, index) => {

        let text = (
          <div className={classes.message}>
            <Avatar
              className={classes.image}
              alt={message.name}
              src={message.image}
            />
            <p className={classes.text}>{message.text}</p>
          </div>
        );

        if(!message.name){
          text = (
            <p className={classes.textUser}>{message.text}</p>
          );
        }

        return (
          <div className={classes.message} key={index}>
            {text}
          </div>
        );
      })}

      <form className={classes.input}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={classes.inputField}
          type="text" 
          placeholder="Type a message..."
        />
        <button onClick={sendHandler} type="submit" className={classes.inputButton}>SEND</button>
      </form>

    </div>
  );
};

export default ChatScreen;