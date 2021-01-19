import React, {useEffect, createRef, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ScrollContainer from 'react-indiana-drag-scroll'

import classes from './Chats.css';
import Chat from './Chat/Chat';
import * as actions from '../../../store/actions/index';
import Match from './Match/Match';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-instance';
import withErrorHandler from '../../../hoc/withErrorHandler';

const Chats = (props) => {


  const dispatch = useDispatch();
  const usersToShow = useSelector( state => state.matches.usersToShow );
  const loading = useSelector( state => state.matches.loading );
  const loadingLastMessage = useSelector( state => state.messages.loadingLastMessage );
  const userId = useSelector( state => state.auth.userId );
  const lastMessagesToShow = useSelector( state => state.messages.lastMessagesToShow );
  const errorLastMessage = useSelector( state => state.messages.errorLastMessage );
  const error = useSelector( state => state.matches.error );
  const onFetchMatches = useCallback((userId) => dispatch( actions.fetchMatches(userId)), [dispatch]);
  const onFetchLastMessages = useCallback((userId) => dispatch(actions.fetchLastMessages(userId)), [dispatch]);


  useEffect(() => {
    if(userId) {
      onFetchMatches(userId);
      onFetchLastMessages(userId);
    }
  }, [onFetchMatches, onFetchLastMessages, userId]);

  const scrollRef = createRef();

  const enableKeyboardCursorToScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.focus();
    }
  };

  let matches = <Spinner/>;
  if(loading === false) {

    matches = (
      <ScrollContainer className={classes.container} vertical={false}>
        <section
          className={classes.tiles}
          onFocus={enableKeyboardCursorToScroll}
          ref={scrollRef}
        >
          {usersToShow.map((user) => (
            <div
              key={user.userId}
              className={classes.row}
            >
              <Match
                profilePic={user.profilePicture}
                name={user.firstName}
                userId={user.userId}
              />
            </div>
          ))}
        </section>
      </ScrollContainer>
    );

    if(usersToShow.length === 0) {
      matches = (
        <p className={classes.noNewMatches}>You have no new matches. Keep swiping to get more matches!</p>
      );
    }

  }
    

  let messages = <Spinner/>;

  if(loadingLastMessage === false) {
    messages = (
      <div className={classes.chats}>
        {lastMessagesToShow.map(lastMessage => {
          return (
            <Chat
              name={lastMessage.name}
              message={lastMessage.lastMessage}
              profilePic={lastMessage.profilePicture}
              key={lastMessage.userId}
              userId={lastMessage.userId}
            />
          );
        })}
      </div>
    );
    
    if(lastMessagesToShow.length === 0) {
      messages = (
        <p className={classes.noMessages}>You have no messages. Compliment your new matches by sending a message!</p>
      );
    }
  }
  
  let messagesClass = [classes.messages];

  if(lastMessagesToShow.length === 0){
    messagesClass.push(classes.notice);
  }

  let noMessagesClasses = messagesClass.join(' ');

  let renderData = <h1 style={{'textAlign': 'center', 'position': 'absolute', 'top': '50%', 'left': '50%', 'marginRight': '-50%', 'transform': 'translate(-50%, -50%)'}}>Something went wrong!</h1> ;
  
  if(!errorLastMessage && !error) {
    renderData = (
      <div>
        <h2 className={classes.newMatches}>New Matches</h2>

        {matches}

        <h2 className={noMessagesClasses}>Messages</h2>

        {messages}
      </div>
    );
  }
  
  return (
    <div>
      {renderData}
    </div>
  );
};

export default withErrorHandler(Chats, axios);