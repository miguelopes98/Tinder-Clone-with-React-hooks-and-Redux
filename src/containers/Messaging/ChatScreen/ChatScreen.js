import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import classes from './ChatScreen.css';
import Avatar from '@material-ui/core/Avatar';
import * as actions from '../../../store/actions/index';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-instance';
import withErrorHandler from '../../../hoc/withErrorHandler';

const ChatScreen = (props) => {


  const dispatch = useDispatch();
  const loadingFetchMessages = useSelector( state => state.messages.loadingFetchMessages );
  const loadingSendMessage = useSelector( state => state.messages.loadingSendMessage );
  const messagesToShow = useSelector( state => state.messages.messagesToShow );
  const userId = useSelector( state => state.auth.userId );
  const recipientInfo = useSelector( state => state.messages.recipientInfo );
  const errorFetchMessages = useSelector( state => state.messages.errorFetchMessages );
  const errorSendMessage = useSelector( state => state.messages.errorSendMessage );
  const onFetchMessages = useCallback((userId, recipientUserId) => dispatch(actions.fetchMessages(userId, recipientUserId)), [dispatch]);
  const onSendMessage = useCallback((recipientUserId, textSent) => dispatch(actions.sendMessage(recipientUserId, textSent)), [dispatch]);


  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');

  //accessing url params so we can grab the user id
  const params = useParams();

  useEffect(() => {
    //params.userId is the id passed as a url parameter which is the id of the recipient
    if(userId && !loadingSendMessage && errorSendMessage === false){
      onFetchMessages(userId, params.userId);
    }
    
    //we also want to re fetch messages when a new message is sent
  }, [onFetchMessages, userId, params.userId, loadingSendMessage]);

  useEffect(() => {
    if(messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loadingFetchMessages])

  

  const sendHandler = (event) => {
    event.preventDefault();

    onSendMessage(params.userId, input);
    //need to change the state in the reducer instead of this
    //setMessages([...messages, { text: input}]);

    setInput("");
  }

  if(errorFetchMessages || errorSendMessage) {
    return <h1 style={{'textAlign': 'center', 'position': 'absolute', 'top': '50%', 'left': '50%', 'marginRight': '-50%', 'transform': 'translate(-50%, -50%)'}}>Something went wrong!</h1>;
  }

  if(!userId || !recipientInfo){
    return (
      <Spinner/>
    );
  }

  return (

    <div className={classes.chatScreen}>
      <p className={classes.timestamp}>You matched with {recipientInfo.name}</p>
      {messagesToShow.map( (message, index) => {

        let text = (
          <div className={classes.message}>
            <Avatar
              className={classes.image}
              alt={recipientInfo.name}
              src={recipientInfo.profilePicture}
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

export default withErrorHandler(ChatScreen, axios);