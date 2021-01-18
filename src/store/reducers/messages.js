import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../sharedFunctions/utilityFunctions';

const initialState = {
    userId: null,
    errorLastMessage: false,
    errorFetchMessages: false,
    errorSendMessage: false,
    loadingLastMessage: false,
    loadingFetchMessages: false,
    loadingSendMessage: false,
    messagesToShow: [],
    lastMessagesToShow: [],
    recipientInfo: null
};

const fetchMessagesStart = ( state, action ) => {
  return updateObject( state, { loadingFetchMessages: true, messagesToShow: [], recipientInfo: null, errorFetchMessages: null} );
};

const fetchMessagesSuccess = ( state, action ) => {
  return updateObject( state, {
      messagesToShow: action.messagesToShow,
      loadingFetchMessages: false,
      errorFetchMessages: false,
      recipientInfo: action.recipientInfo
  } );
};

const fetchMessagesFail = ( state, action ) => {
  return updateObject( state, { loadingFetchMessages: false, errorFetchMessages: action.error } );
};



const sendMessageStart = ( state, action ) => {
  return updateObject( state, { loadingSendMessage: true, errorSendMessage: null })
}

const sendMessageSuccess = ( state, action ) => {
  return updateObject( state, { 
    loadingSendMessage: false,
    errorSendMessage: false,
    lastMessage: action.lastMessage
  })
}

const sendMessageFail = ( state, action ) => {
  return updateObject( state, {loadingSendMessage: false, errorSendMessage: action.error})
}



const fetchLastMessagesStart = ( state, action ) => {
  return updateObject( state, { loadingLastMessage: true, errorLastMessage: null } );
};

const fetchLastMessagesSuccess = ( state, action ) => {
  return updateObject( state, {
      lastMessagesToShow: action.messagesToShow,
      loadingLastMessage: false,
      errorLastMessage: false
  } );
};

const fetchLastMessagesFail = ( state, action ) => {
  return updateObject( state, { loadingLastMessage: false, errorLastMessage: action.error } );
};


const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case actionTypes.FETCH_MESSAGES_START: return fetchMessagesStart( state, action );
    case actionTypes.FETCH_MESSAGES_SUCCESS: return fetchMessagesSuccess( state, action );
    case actionTypes.FETCH_MESSAGES_FAIL: return fetchMessagesFail( state, action );
    case actionTypes.SEND_MESSAGE_START: return sendMessageStart( state, action );
    case actionTypes.SEND_MESSAGE_SUCCESS: return sendMessageSuccess( state, action );
    case actionTypes.SEND_MESSAGE_FAIL: return sendMessageFail( state, action );
    case actionTypes.FETCH_LAST_MESSAGES_START: return fetchLastMessagesStart( state, action );
    case actionTypes.FETCH_LAST_MESSAGES_SUCCESS: return fetchLastMessagesSuccess( state, action );
    case actionTypes.FETCH_LAST_MESSAGES_FAIL: return fetchLastMessagesFail( state, action );
    default:
      return state;
  }
};

export default reducer;