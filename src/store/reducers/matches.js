import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../sharedFunctions/utilityFunctions';

const initialState = {
    error: null,
    loading: false,
    usersToShow: []
};

const fetchMatchesStart = ( state ) => {
  return updateObject( state, { loading: true, error: null } );
};

const fetchMatchesSuccess = ( state, action ) => {
  return updateObject( state, {
      usersToShow: action.usersToShow,
      loading: false
  } );
};

const fetchMatchesFail = ( state, action ) => {
  return updateObject( state, { loading: false, error: action.error } );
};

const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case actionTypes.FETCH_MATCHES_START: return fetchMatchesStart( state, action );
    case actionTypes.FETCH_MATCHES_SUCCESS: return fetchMatchesSuccess( state, action );
    case actionTypes.FETCH_MATCHES_FAIL: return fetchMatchesFail( state, action );
    default:
      return state;
  }
};

export default reducer;