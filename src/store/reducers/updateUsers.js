import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../sharedFunctions/utilityFunctions';

const initialState = {
    error: null,
    loadingFetchingUser: false,
    authenticatedUser: null,
    loadingUpdateUser: false
};

const fetchAuthenticatedUserStart = ( state, action ) => {
  return updateObject( state, { loadingFetchingUser: true } );
};

const fetchAuthenticatedUserSuccess = ( state, action ) => {
  return updateObject( state, {
    authenticatedUser: action.authenticatedUser,
    loadingFetchingUser: false
  });
};

const fetchAuthenticatedUserFail = ( state, action ) => {
  return updateObject( state, { loadingFetchingUser: false, error: action.error } );
};

const updateUserFail = ( state, action ) => {
  return updateObject( state, { loadingUpdateUser: false, error: action.error } );
};

const updateUserStart = ( state, action ) => {
  return updateObject( state, { loadingUpdateUser: true } );
};

const updateUserSuccess = ( state, action ) => {
  return updateObject( state, { loadingUpdateUser: false } );
};

const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case actionTypes.FETCH_AUTHENTICATED_USER_START: return fetchAuthenticatedUserStart( state, action );
    case actionTypes.FETCH_AUTHENTICATED_USER_SUCCESS: return fetchAuthenticatedUserSuccess( state, action );
    case actionTypes.FETCH_AUTHENTICATED_USER_FAIL: return fetchAuthenticatedUserFail( state, action );
    case actionTypes.UPDATE_USER_START: return updateUserFail( state, action );
    case actionTypes.UPDATE_USER_FAIL: return updateUserStart( state, action );
    case actionTypes.UPDATE_USER_SUCCESS: return updateUserSuccess( state, action );
    default:
      return state;
  }
};

export default reducer;