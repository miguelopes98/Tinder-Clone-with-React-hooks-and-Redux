import React from 'react';
import {NavLink} from 'react-router-dom';

import classes from './Match.css';

const Chat = (props) => {
  return (
    <NavLink to={"/chat/" + props.userId}>
        <div className={classes.matchImage} style={{ 'backgroundImage': `url("${props.profilePic}")` }}>
        </div>
        <p className={classes.name}>{props.name}</p>
    </NavLink>
  );
};

export default Chat;