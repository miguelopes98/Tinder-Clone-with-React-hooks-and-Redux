import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

/*export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};*/

export const userCreatingStart = () => {
  return {
    type: actionTypes.USER_CREATING_START
  };
};

export const userCreatingSuccess = (userId) => {
  console.log("userCreating Success action " + userId);
  return {
    type: actionTypes.USER_CREATING_SUCCESS,
    userId: userId
  };
};

export const userCreatingFail = (error) => {
  return {
    type: actionTypes.USER_CREATING_FAIL,
    error: error
  };
};

export const auth = (email, password, isSignup, profilePicture, age, firstName, lastName, gender, interestedIn ) => {
  return dispatch => {
    dispatch(authStart());

    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    //url if the user isn't registering, just logging in
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + process.env.REACT_APP_FIREBASE_API_KEY;

    //url if the user is registering, signing up
    if (!isSignup) {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + process.env.REACT_APP_FIREBASE_API_KEY;
    }

    //creating the user account itself
    axios.post(url, authData)
      .then(response => {
        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', response.data.localId);

        //now we're going to take the chance to create the user profile if the user was signing up and not just logging in
        if(isSignup){
          dispatch(userCreatingStart());
          const userId = localStorage.getItem("userId");
          const userData = {
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            age: age,
            profilePicture: profilePicture,
            gender: gender,
            interestedIn: interestedIn,
            //we gotta put exists: true so that these fields aren't empty, empty fields are automatically removed by firebase, which we don't want
            disliked: {exists: true},
            liked: {exists: true},
            dislikedBy: {exists: true},
            likedBy: {exists: true},
            matches: {exists: true},
            chats: {exists: true}
          }
  
          axios.post('https://tinder-9d380-default-rtdb.firebaseio.com/users.json', userData)
            .then(response => {
              dispatch(userCreatingSuccess(userData.userId));
            })
            .catch(err => {
              dispatch(userCreatingFail(err.response.data.error));
            })
        }
        
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => {
        dispatch(authFail(err.response.data.error));
      });

      
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
      }   
    }
  };
};