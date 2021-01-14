import axios from 'axios';

import * as actionTypes from './actionTypes';

export const fetchMessagesSuccess = ( messagesToShow ) => {
  return {
      type: actionTypes.FETCH_MESSAGES_SUCCESS,
      messagesToShow: messagesToShow
  };
};

export const fetchMessagesFail = ( error ) => {
  return {
      type: actionTypes.FETCH_MESSAGES_FAIL,
      error: error
  };
};

export const fetchMessagesStart = () => {
  return {
      type: actionTypes.FETCH_MESSAGES_START
  };
};

export const fetchMessages = (token, userId) => {
  return dispatch => {
    dispatch(fetchUsersStart());
    //grabbing profile data associated to the logged in user
    const queryParams = /*'?auth=' + token + '&*/'?orderBy="userId"&equalTo="' + userId + '"';
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

          //filtering the users to only have users that are interested in the same gender as the logged in user
          const interestedUsers = fetchedUsers.filter(user => {
            return (user.interestedIn === loggedInUser[0].gender);
          });

          //filtering the users to remove the users that already swiped left on the logged in user.
          const filteredUsers = interestedUsers.filter( interestedUser => {
            //if the user hasn't disliked the logged in user, then we return true and the filter function keeps this user in the array
            //if the user has disliked the logged in user, then we return false and the filter function removes this user from the array
            return (interestedUser.disliked.hasOwnProperty(userId) === false);
          });

          //filtering the user to remove the users that the logged in user already swiped left on
          const filteredUsersArray = filteredUsers.filter( filteredUser => {
            //if the logged in user hasn't disliked user, then we return true and the filter function keeps this user in the array
            //if the logged in user has disliked user, then we return false and the filter function removes this user from the array
            return (filteredUser.dislikedBy.hasOwnProperty(userId) === false);
          });

          //filtering the users to remove the users that the logged in user already matched with
          const usersFinalArray = filteredUsersArray.filter( user => {
            //if the logged in user hasn't matched the user, then we return true and the filter function keeps this user in the array
            //if the logged in user has matched the user, then we return false and the filter function removes this user from the array
            return (user.matches.hasOwnProperty(userId) === false);
          });

          //filtering the users to remove our selves if we're interested in the same gender as we are, so we don't show ourselves to ourselves (if we're gay, we're male and looking for males
          //or females looking for females, so we don't want to get our profile to swipe on)
          const finalUsers = usersFinalArray.filter( user => {
            //if the logged in user isn't the same as the user, then we return true and the filter function keeps this user in the array
            //if the logged in user is the same as the user, then we return false and the filter function removes this user from the array
            return (user.userId !== userId);
          });
          

          dispatch(fetchUsersSuccess(finalUsers));
        })
        .catch( err => {
          dispatch(fetchUsersFail(err));
        });

    })
    .catch( err => {
      dispatch(fetchUsersFail(err));
    });
  };
};