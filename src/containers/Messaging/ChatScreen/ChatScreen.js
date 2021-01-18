import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './ChatScreen.css';
import Avatar from '@material-ui/core/Avatar';
import * as actions from '../../../store/actions/index';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-instance';
import withErrorHandler from '../../../hoc/withErrorHandler';

const ChatScreen = (props) => {

  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');

  //accessing url params so we can grab the user id
  const params = useParams();

  useEffect(() => {
    //params.userId is the id passed as a url parameter which is the id of the recipient
    if(props.userId && !props.loadingSendMessage && props.errorSendMessage === false){
      props.onFetchMessages(props.userId, params.userId);
    }
    
    //we also want to re fetch messages when a new message is sent
  }, [props.onFetchMessages, props.userId, params.userId, props.loadingSendMessage]);

  useEffect(() => {
    if(messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.loadingFetchMessages])

  

  const sendHandler = (event) => {
    event.preventDefault();

    props.onSendMessage(params.userId, input);
    //need to change the state in the reducer instead of this
    //setMessages([...messages, { text: input}]);

    setInput("");
  }

  if(props.errorFetchMessages || props.errorSendMessage) {
    return <h1 style={{'textAlign': 'center', 'position': 'absolute', 'top': '50%', 'left': '50%', 'marginRight': '-50%', 'transform': 'translate(-50%, -50%)'}}>Something went wrong!</h1>;
  }

  if(!props.userId || !props.recipientInfo){
    return (
      <Spinner/>
    );
  }

  return (

    <div className={classes.chatScreen}>
      <p className={classes.timestamp}>You matched with {props.recipientInfo.name} on 10/08/2020</p>
      {props.messagesToShow.map( (message, index) => {

        let text = (
          <div className={classes.message}>
            <Avatar
              className={classes.image}
              alt={props.recipientInfo.name}
              src={props.recipientInfo.profilePicture}
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

      <div style={{ paddingTop: '50px', float:"left", clear: "both" }}
        ref={messagesEndRef}>
      </div>

    </div>
    
  );
};

const mapStateToProps = state => {
  return {
    loadingFetchMessages: state.messages.loadingFetchMessages,
    loadingSendMessage: state.messages.loadingSendMessage,
    messagesToShow: state.messages.messagesToShow,
    userId: state.auth.userId,
    recipientInfo: state.messages.recipientInfo,
    errorFetchMessages: state.messages.errorFetchMessages,
    errorSendMessage: state.messages.errorSendMessage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchMessages: (userId, recipientUserId) => dispatch(actions.fetchMessages(userId, recipientUserId)),
    onSendMessage: (recipientUserId, textSent) => dispatch(actions.sendMessage(recipientUserId, textSent))
  };
};

export default withErrorHandler(connect( mapStateToProps, mapDispatchToProps )(ChatScreen), axios);