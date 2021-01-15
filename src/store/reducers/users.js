import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../sharedFunctions/utilityFunctions';

const initialState = {
    userId: null,
    error: null,
    loading: false,
    usersToShow: [],
    lastDirection: null,
    //this defines if we already tried to search for users at least once. this is to helps us manage the loading state in the tinder cards component
    searchedForUsers: false
};

const fetchUsersStart = ( state, action ) => {
  return updateObject( state, { loading: true } );
};

const fetchUsersSuccess = ( state, action ) => {
  return updateObject( state, {
      usersToShow: action.usersToShow,
      loading: false,
      searchedForUsers: true
  } );
};

const fetchUsersFail = ( state, action ) => {
  return updateObject( state, { loading: false, error: action.error } );
};

const swipedDirection = ( state, action ) => {
  return updateObject( state, {lastDirection: action.direction})
}

const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case actionTypes.FETCH_USERS_START: return fetchUsersStart( state, action );
    case actionTypes.FETCH_USERS_SUCCESS: return fetchUsersSuccess( state, action );
    case actionTypes.FETCH_USERS_FAIL: return fetchUsersFail( state, action );
    case actionTypes.USER_SWIPED_DIRECTION: return swipedDirection( state, action );
    default:
      return state;
  }
};

export default reducer;