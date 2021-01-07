import axios from 'axios';

import * as actionTypes from './actionTypes';

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

export const userCreate = (profilePicture, age, firstName, lastName, gender, interestedIn) => {
  return dispatch => {

    dispatch(userCreatingStart());

    //this is called right after the user is authenticated and the respective user credentials are initiated, sometimes the userId wouldn't be set before we called this part of the code, so we 
    //would get a null userId, which is not what we want. therefore, we're going to keep calling for the userId until we get it , so that the user profile is created correctly
    let userId = null;
    while(localStorage.getItem('userId') === null){
      console.log(userId);
      userId = localStorage.getItem('userId');
    }
    //const userId = localStorage.getItem('userId');
    const userData = {
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      age: age,
      profilePicture: profilePicture,
      gender: gender,
      interestedIn: interestedIn
    }

    axios.post('https://tinder-9d380-default-rtdb.firebaseio.com/users.json', userData)
      .then(response => {
        dispatch(userCreatingSuccess(userData.userId));
      })
      .catch(err => {
        dispatch(userCreatingFail(err.response.data.error));
      })
  };
};

export const fetchUsersSuccess = ( orders ) => {
  return {
      type: actionTypes.FETCH_USERS_SUCCESS,
      orders: orders
  };
};

export const fetchUsersFail = ( error ) => {
  return {
      type: actionTypes.FETCH_USERS_FAIL,
      error: error
  };
};

export const fetchUsersStart = () => {
  return {
      type: actionTypes.FETCH_USERS_START
  };
};

export const fetchUsers = (token, userId) => {
  return dispatch => {
      dispatch(fetchUsersStart());
      //grabbing profile data associated to the logged in user
      const queryParams = /*'?auth=' + token + '&*/'?orderBy="userId"&equalTo="' + userId + '"';
      axios.get( 'https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams)
        .then( res => {
          console.log(res);
          /*for ( let key in res.data ) {
            fetchedUsers.push( {
              ...res.data[key],
              id: key
            });
          }
          const loggedInUser = fetchedUsers;*/
        })
        .catch( err => {
          dispatch(fetchUsersFail(err));
        });

      /*// grabbing the users to show to logged in user
      const queryParams = '?auth=' + token + '&orderBy="interestedIn"&equalTo="' + interestedIn + '"';
      axios.get( 'https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams)
          .then( res => {
              const fetchedUsers = [];
              for ( let key in res.data ) {
                  fetchedUsers.push( {
                      ...res.data[key],
                      id: key
                  } );
              }
              dispatch(fetchUsersSuccess(fetchedUsers));
          } )
          .catch( err => {
              dispatch(fetchUsersFail(err));
          } );*/
  };
};