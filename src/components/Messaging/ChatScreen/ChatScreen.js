import React, {useState} from 'react';

import classes from './ChatScreen.css';
import Avatar from '@material-ui/core/Avatar';

const ChatScreen = () => {

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

  return (
    <div className={classes.chatScreen}>
      <p className={classes.timestamp}>YOU MATCHED WITH ASTRID ON 10/08/2020</p>
      {messages.map( (message) => {

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
          <div className={classes.message}>
            {text}
          </div>
        );
      })}
    </div>
  );
};

export default ChatScreen;