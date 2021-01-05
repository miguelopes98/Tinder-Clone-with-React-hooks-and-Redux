import React from 'react';

import classes from './Chats.css';
import Chat from './Chat/Chat';

const Chats = () => {
  return(
    <div className={classes.chats}>
      <Chat
        name="Àstrid Bergès-Frisbey"
        message="Heyy whats up?"
        timestamp="40 seconds ago"
        profilePic="https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
      />
      <Chat
        name="Juultje Tieleman"
        message="Yo whats up?"
        timestamp="40 seconds ago"
        profilePic="https://taddlr.com/wp-content/uploads/Screenshot-2020-06-25-at-11.47.45.png"
      />
      <Chat
        name="Mikky Kiemeney"
        message="Yo whats up?"
        timestamp="40 seconds ago"
        profilePic="https://www.paraeles.pt/wp-content/uploads/2019/03/mikkykiemeney_35338988_231560977655444_5072636146450694144_n.jpg"
      />
      <Chat
        name="Scarlett Johanson"
        message="Yo whats up?"
        timestamp="40 seconds ago"
        profilePic="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-179427791-1580485545.jpg?crop=1xw:0.6665776828617191xh;center,top&resize=480:*"
      />
    </div>
  );
};

export default Chats;