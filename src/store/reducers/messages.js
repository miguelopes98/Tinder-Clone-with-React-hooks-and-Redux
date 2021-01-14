import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../sharedFunctions/utilityFunctions';

const initialState = {
    userId: null,
    error: null,
    loading: false,
    messagesToShow: []
};

const fetchMessagesStart = ( state, action ) => {
  return updateObject( state, { loading: true } );
};

const fetchMessagesSuccess = ( state, action ) => {
  return updateObject( state, {
      messagesToShow: action.messagesToShow,
      loading: false
  } );
};

const fetchMessagesFail = ( state, action ) => {
  return updateObject( state, { loading: false, error: action.error } );
};

const sendMessageStart = ( state, action ) => {
  return updateObject( state, { loading: true })
}

const sendMessageSuccess = ( state, action ) => {
  return updateObject( state, { loading: false })
}

const sendMessageFail = ( state, action ) => {
  return updateObject( state, {loading: false, error: action.error})
}

const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case actionTypes.FETCH_MESSAGES_START: return fetchMessagesStart( state, action );
    case actionTypes.FETCH_MESSAGES_SUCCESS: return fetchMessagesSuccess( state, action );
    case actionTypes.FETCH_MESSAGES_FAIL: return fetchMessagesFail( state, action );
    case actionTypes.SEND_MESSAGE_START: return sendMessageStart( state, action );
    case actionTypes.SEND_MESSAGE_SUCCESS: return sendMessageSuccess( state, action );
    case actionTypes.SEND_MESSAGE_FAIL: return sendMessageFail( state, action );
    default:
      return state;
  }
};

export default reducer;