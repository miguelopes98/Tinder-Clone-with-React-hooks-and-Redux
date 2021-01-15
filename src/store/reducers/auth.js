import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../sharedFunctions/utilityFunctions';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    loadingUserCreation: false,
    errorUserCreation: false,
    firstTimeLogin: false
    //authRedirectPath: '/'
};

const authStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true } );
};

const authSuccess = (state, action) => {
    return updateObject( state, { 
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false
     } );
};

const authFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const authLogout = (state, action) => {
    return updateObject(state, { token: null, userId: null, firstTimeLogin: false });
};

const userCreatingStart = ( state, action ) => {
  return updateObject( state, { errorUserCreation: null, loadingUserCreation: true } );
};

const userCreatingSuccess = (state, action) => {
  return updateObject( state, {
      userId: action.userId,
      errorUserCreation: null,
      loadingUserCreation: false
   } );
};

const userCreatingFail = (state, action) => {
  return updateObject( state, {
    errorUserCreation: action.error,
    loadingUserCreation: false
  });
};

/*const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirectPath: action.path })
}*/

const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case actionTypes.AUTH_START: return authStart(state, action);
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
    case actionTypes.AUTH_FAIL: return authFail(state, action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
    case actionTypes.USER_CREATING_START: return userCreatingStart(state, action);
    case actionTypes.USER_CREATING_SUCCESS: return userCreatingSuccess(state, action);
    case actionTypes.USER_CREATING_FAIL: return userCreatingFail(state, action);
    //case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state,action);
    default:
      return state;
  }
};

export default reducer;