import axios from '../../axios-instance';

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

export const auth = (email, password, isSignup, profilePicture1, profilePicture2, profilePicture3, profilePicture4, profilePicture5, age, firstName, lastName, gender, interestedIn, bio ) => {
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

        //setting up the profilePicture object
        let profilePicture = {
          0: profilePicture1,
          1: profilePicture2 ? profilePicture2 : null,
          2: profilePicture3 ? profilePicture3 : null,
          3: profilePicture4 ? profilePicture4 : null,
          4: profilePicture5 ? profilePicture5 : null
        }

        //looping through the object and removing the properties that have null as a value
        for(let objectKey in profilePicture){
          if(profilePicture[objectKey] === null){
            delete profilePicture[objectKey];
          }
        }

        //this means that a user might skip an input. and we would have the properties of the profile picture object being 0 and then 2 instead of 1. this fucks up our image rendering
        //so im going to reset the object properties to make sure this is fixed.
        let updatedProfilePicture = {};
        //this will keep track of what the property we're assigning is
        let index = 0;
        for(let Key in profilePicture){
          //we set the value of the property in the new object to be the value of the property in the previous object.
          //the indexes in this new object are going to be re arranged 0,1,2,3,4. (if we had enough inputs, if we only had 2 inputs, it'll be 0,1. but you get my point)
          updatedProfilePicture[index] = profilePicture[Key];
          index = index + 1;
        }

        //now we're going to take the chance to create the user profile if the user was signing up and not just logging in
        if(isSignup){
          dispatch(userCreatingStart());
          const userId = localStorage.getItem("userId");
          const userData = {
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            age: age,
            profilePicture: updatedProfilePicture,
            gender: gender,
            interestedIn: interestedIn,
            bio: bio,
            //we gotta put exists: true so that these fields aren't empty, empty fields are automatically removed by firebase, which we don't want
            disliked: {exists: true},
            liked: {exists: true},
            dislikedBy: {exists: true},
            likedBy: {exists: true},
            matches: {exists: true},
            chats: {exists: true}
          }
          let token = localStorage.getItem("token");
          axios.post('https://tinder-9d380-default-rtdb.firebaseio.com/users.json?auth=' + token, userData)
            .then(res => {
              //idk why, but this would never throw an error, if the response came back undefined, no error would be thrown, and userCreatingSuccess would be dispatched regardless, therefore,
              //i imposed this status check, to make sure that only is done if we actually got a response back
              console.log(res);
              //dispatch(userCreatingSuccess(userData.userId))
              //if there is a response (that isn't null or undefined), we check for the status, if this doesn't apply, then we dispatch error
              if(res){
                if(res.status === 200) {
                  dispatch(userCreatingSuccess(userData.userId))
                }
                else{
                  dispatch(userCreatingFail(true));
                  //if we don't manage to create the respective user account, then we just logout the user
                  dispatch(logout());
                }
              }
              else {
                dispatch(userCreatingFail(true));
                //if we don't manage to create the respective user account, then we just logout the user
                dispatch(logout());
              }
            })
            .catch(err => {
              dispatch(userCreatingFail(err));
              //if we don't manage to create the respective user account, then we just logout the user
              dispatch(logout());
            })
        }
        
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => {
        dispatch(authFail(err));
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