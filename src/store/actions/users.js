import axios from 'axios';

import * as actionTypes from './actionTypes';

export const fetchUsersSuccess = ( usersToShow ) => {
  return {
      type: actionTypes.FETCH_USERS_SUCCESS,
      usersToShow: usersToShow
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
      setTimeout(function(){ 
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
          const loggedInUser = fetchedUser;

          // grabbing the users that have the gender the logged in user is interested in
          const queryParams = /*'?auth=' + token + '&*/'?orderBy="gender"&equalTo="' + loggedInUser[0].interestedIn + '"';
          axios.get( 'https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams)
            .then( res => {
              //we grabbed all the people that have the gender that the logged in user is interested in, now we have to filter those results to only show the ones that are interested in the
              //gender of the logged in user as well (if the logged in user is a male, we grabbed the females, but the females might only be interested in females as well while our
              //logged in user is a male, so we gotta take those ones out)
              const fetchedUsers = [];
              for ( let key in res.data ) {
                fetchedUsers.push( {
                  ...res.data[key],
                  id: key
                });
              }

              const filteredUsers = fetchedUsers.filter(user => {
                return (user.interestedIn === loggedInUser[0].gender);
              });

              dispatch(fetchUsersSuccess(filteredUsers));
            })
            .catch( err => {
              dispatch(fetchUsersFail(err));
            });

        })
        .catch( err => {
          dispatch(fetchUsersFail(err));
        });
       }, 1000);
      

      
  };
};