import React, {useEffect, createRef} from 'react';
import { connect } from 'react-redux';
import ScrollContainer from 'react-indiana-drag-scroll'

import classes from './Chats.css';
import Chat from './Chat/Chat';
import * as actions from '../../../store/actions/index';
import Match from './Match/Match';

const Chats = (props) => {

  useEffect(() => {
    if(props.userId) {
      props.onFetchMatches(props.userId);
      props.onFetchLastMessages(props.userId);
    }
  }, [props.onFetchMatches, props.onFecthLastMessages, props.userId]);

  const scrollRef = createRef();

  const enableKeyboardCursorToScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.focus();
    }
  };

  return(
    <div>

      <h2 className={classes.newMatches}>New Matches</h2>

      <ScrollContainer className={classes.container} vertical={false}>
        <section
          className={classes.tiles}
          onFocus={enableKeyboardCursorToScroll}
          ref={scrollRef}
        >
          {props.usersToShow.map((user) => (
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

      <h2 className={classes.messages}>Messages</h2>

      <div className={classes.chats}>
        {props.lastMessagesToShow.map(lastMessage => {
          return (
            <Chat
              name={lastMessage.name}
              message={lastMessage.lastMessage}
              timestamp="40 seconds ago"
              profilePic={lastMessage.profilePicture}
              key={lastMessage.userId}
              userId={lastMessage.userId}
            />
          );
        })}
        
      </div>

      </div>
  );
};

const mapStateToProps = state => {
  return {
    usersToShow: state.matches.usersToShow,
    loading: state.matches.loading,
    userId: state.auth.userId,
    lastMessagesToShow: state.messages.lastMessagesToShow
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchMatches: (userId) => dispatch( actions.fetchMatches(userId)),
    onFetchLastMessages: (userId) => dispatch(actions.fetchLastMessages(userId))
  };
};

export default connect( mapStateToProps, mapDispatchToProps )(Chats);