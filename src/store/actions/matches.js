import axios from 'axios';

import * as actionTypes from './actionTypes';

export const fetchMatchesStart = () => {
  return {
      type: actionTypes.FETCH_MATCHES_START
  };
};

export const fetchMatchesSuccess = ( usersToShow ) => {
  return {
      type: actionTypes.FETCH_MATCHES_SUCCESS,
      usersToShow: usersToShow
  };
};

export const fetchMatchesFail = (error) => {
  return {
      type: actionTypes.FETCH_MATCHES_FAIL,
      error: error
  };
};

export const fetchMatches = (userId) => {
  return dispatch => {
    dispatch(fetchMatchesStart());
    //grabbing profile data associated to the logged in user
    const queryParams = /*'?auth=' + token + '&*/'?orderBy="userId"&equalTo="' + userId + '"';
    axios.get( 'https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams)
    .then( res => {
      let fetchedUser = [];
      //even though we are only grabbing one user for sure, we still don't have a way to know the firebase key that comes in the response.
      //that is why we still loop through something that we know that has only one key, that is why we still keep an array, just for good practice
      for ( let key in res.data ) {
        fetchedUser.push( {
          ...res.data[key],
          id: key
        });
      }
      const loggedInUser = fetchedUser[0];

      // grabbing the id of the users the logged in user matched with
      const matchesInfo = [];
      for ( let id in loggedInUser.matches) {
        //making sure we don't grab the 'exists: true' since that is not a user
        if(id !== 'exists') {
          matchesInfo.push(loggedInUser.matches[id]);
        }
      }

      dispatch(fetchMatchesSuccess(matchesInfo));

      //we're now going to grab the info of the users the logged in user matched with
      //this is going to be an array of objects where each object has the info of the matched users
      //let err = null;
      //let matchesInfo = matchesId.map(id => {
        //const queryParams = /*'?auth=' + token + '&*/'?orderBy="userId"&equalTo="' + id + '"';
        //this will contain the info of each matched user that we're going to push to the matchesInfo array
        /*let userInfo = null;
        console.log("map function id " + id);
        axios.get('https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams)
        .then( res => {
          //even though we are only grabbing one user for sure, we still don't have a way to know the firebase key that comes in the response.
          //that is why we still loop through something that we know that has only one key, that is why we still keep an array, just for good practice
          //push the user info object to the matchesInfo array
          for (let key in res.data) {
            userInfo = {
              ...res.data[key],
              id: [key]
            };
          }

          console.log("then block ran, userInfo " + userInfo);
          
          
        })
        .catch(error => {
          err= error;
        })
        
        //this is what gets added to the array that will contain the objects with the users info
        console.log("userInfo " + userInfo);
        return userInfo;

      });
      // Wait for all requests, and then setState
      Promise.all(matchesInfo).then(() => {
        console.log("matchesInfo " + matchesInfo);
        //handling the error of the requests we made in the loop above, if we got an error while grabbing one of the users, we don't want to dispatch success, but rather fail.
        if(!err) {
          dispatch(fetchMatchesSuccess(matchesInfo));
        }
        else {
          dispatch(fetchMatchesFail(err));
        }
      });*/
      

    })
    .catch(error => {
      dispatch(fetchMatchesFail(error));
    });
  };
};