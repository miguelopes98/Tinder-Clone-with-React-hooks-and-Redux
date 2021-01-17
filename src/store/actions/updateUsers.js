import axios from 'axios';

import * as actionTypes from './actionTypes';

export const fetchAuthenticatedUserSuccess = ( authenticatedUser ) => {
  return {
    type: actionTypes.FETCH_AUTHENTICATED_USER_SUCCESS,
    authenticatedUser: authenticatedUser
  };
};

export const fetchAuthenticatedUserFail = ( error ) => {
  return {
    type: actionTypes.FETCH_AUTHENTICATED_USER_FAIL,
    error: error
  };
};

export const fetchAuthenticatedUserStart = () => {
  return {
    type: actionTypes.FETCH_AUTHENTICATED_USER_START
  };
};

export const fetchAuthenticatedUser = (userId) => {
  return dispatch => {
    dispatch(fetchAuthenticatedUserStart());

    //grabbing profile data associated to the logged in user
    let token = localStorage.getItem("token");
    const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
    axios.get( 'https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams)
    .then( res => {
      const fetchedUser = [];
      //even though we are only grabbing one user for sure, we still don't have a way to know the firebase key that comes in the response.
      //that is why we still loop through something that we know that has only one key, that is why we still keep an array, just for good practice
      for ( let key in res.data ) {
        fetchedUser.push( {
          ...res.data[key],
          id: key
        });
      }
      const loggedInUser = fetchedUser[0];

      dispatch(fetchAuthenticatedUserSuccess(loggedInUser));
    })
    .catch(err => {
      dispatch(fetchAuthenticatedUserFail(err));
    })
  };
};

export const updateUserStart = () => {
  return {
    type: actionTypes.UPDATE_USER_START
  };
};

export const updateUserFail = (error) => {
  return {
    type: actionTypes.UPDATE_USER_FAIL,
    error: error
  };
};

export const updateUserSuccess = () => {
  return {
    type: actionTypes.UPDATE_USER_SUCCESS
  };
};

export const updateUser = (profilePicture, age, firstName, lastName, gender, interestedIn, bio) => {
  return dispatch => {
    dispatch(updateUserStart());

    //grabbing profile data associated to the logged in user so we can grab the respective key.
    let token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");
    const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
    axios.get( 'https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams)
    .then( res => {
      const fetchedUser = [];
      //even though we are only grabbing one user for sure, we still don't have a way to know the firebase key that comes in the response.
      //that is why we still loop through something that we know that has only one key, that is why we still keep an array, just for good practice
      for ( let key in res.data ) {
        fetchedUser.push( {
          ...res.data[key],
          id: key
        });
      }
      const loggedInUser = fetchedUser[0];

      //preparing data structure to update the user info of the logged in user
      const userData = {
        profilePicture: profilePicture,
        age: age,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        interestedIn: interestedIn,
        bio: bio
      }

      //now we're going to update the info on the logged in user
      axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + loggedInUser.id + '.json?auth=' + token, userData)
      .then(res => {

        //now we're going to grab all the users in the database. so that we can loop through them and update the info of logged in user in the matches field of the user that have matched with the logged in user
        const queryParams = '?auth=' + token;
        axios.get( 'https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams)
        .then( res => {
          const fetchedUsers = [];
          //even though we are only grabbing one user for sure, we still don't have a way to know the firebase key that comes in the response.
          //that is why we still loop through something that we know that has only one key, that is why we still keep an array, just for good practice
          for ( let key in res.data ) {
            fetchedUsers.push( {
              ...res.data[key],
              id: key
            });
          }
          //now we're going to filter the users that have matched with the logged in user.
          const matchedUsers = fetchedUsers.filter(user => {
            return user.matches.hasOwnProperty(userId);
          });

          //now we're going to filter the users that have exchanged messages with the logged in user.
          const messagedUsers = fetchedUsers.filter(user => {
            return user.chats.hasOwnProperty(userId);
          })

          //preparing the data we need to update in the matches field
          const userMatchesData = {
            profilePicture: userData.profilePicture,
            firstName: userData.firstName,
            userId: userData.userId
          }

          //preparing the data we need to updated in the chats field
          const userChatsData = {
            profilePicture: userData.profilePicture,
            name: userData.firstName,
            userId: userData.userId
          }

          //now we're going to loop through those users and update their matches field that holds the info of the logged in user
          matchedUsers.map(user => {
            return axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + user.id + '/matches' + userId + '.json?auth=' + token, userMatchesData)
            .then(res => {
              //we don't really wanna do anything, we just wanna keep moving
            })
            .catch(err => {
              dispatch(updateUserFail(err));
            })
          })

          //now we're going to loop through those users and update their matches field that holds the info of the logged in user
          messagedUsers.map(user => {
            return axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + user.id + '/chats/' + userId + '.json?auth=' + token, userChatsData)
            .then(res => {
              //we don't really wanna do anything, we just wanna keep moving
            })
            .catch(err => {
              dispatch(updateUserFail(err));
            })
          })


          //we don't need to wait for the updates to finish, they ll do that by themselves, we can move on now.
          dispatch(updateUserSuccess());
          //we tell the re-grab the authenticated user info, now that it has changed, so that it is updated.
          dispatch(fetchAuthenticatedUser());

        })
        .catch(err => {
          dispatch(updateUserFail(err));
        })
      })
      .catch(err => {
        dispatch(updateUserFail(err));
      })
    })
    .catch(err => {
      dispatch(updateUserFail(err));
    })


  };
};