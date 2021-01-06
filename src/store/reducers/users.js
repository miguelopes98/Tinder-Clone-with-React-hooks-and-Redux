import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../sharedFunctions/utilityFunctions';

const initialState = {
    userId: null,
    error: null,
    loading: false
};

const userCreatingStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true } );
};

const userCreatingSuccess = (state, action) => {
    return updateObject( state, {
        userId: action.userId,
        error: null,
        loading: false
     } );
};

const userCreatingFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false
    });
};

const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case actionTypes.USER_CREATING_START: return userCreatingStart(state, action);
    case actionTypes.USER_CREATING_SUCCESS: return userCreatingSuccess(state, action);
    case actionTypes.USER_CREATING_FAIL: return userCreatingFail(state, action);
    default:
      return state;
  }
};

export default reducer;