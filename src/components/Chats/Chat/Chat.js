import React from 'react';

import classes from './Chat.css';
import Avatar from '@material-ui/core/Avatar';

const Chat = (props) => {
  return (
    <div className={classes.chat}>
      {/* the cool thing about the Avatar from material UI is that if no profile pic is passed or if we have a problem loading it, it shows a generic profile icon*/}
      <Avatar className={classes.chatImage} alt={props.name} src={props.profilePic}/>
      <div className={classes.chatDetails}>
        <h3>{props.name}</h3>
        <p>{props.message}</p>
      </div>
      <p className={classes.chatTimestamp}>{props.timestamp}</p>
    </div>
  );
};

export default Chat;