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

export const userSwipedDirection = (direction) => {
  return {
    type: actionTypes.USER_SWIPED_DIRECTION,
    direction: direction
  };
};

export const userSwiped = (direction, swipedUserId) => {
  return dispatch => {

    //if the user swiped left
    if(direction === "left") {

      //getting the user that was swiped on so that we can grab the firebase key and save it.
      //adding the logged in user to the dislikedBy field on the swipedUserId
      const queryParams = /*'?auth=' + token + '&*/'?orderBy="userId"&equalTo="' + swipedUserId + '"';
      axios.get( 'https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams)
        .then( res => {
          //even though we are only grabbing one user for sure, we still don't have a way to know the firebase key that comes in the response.
          //that is why we still loop through something that we know that has only one key, that is why we still keep an array, just for good practice
          const fetchedUsers = [];
          for ( let key in res.data ) {
            fetchedUsers.push( {
              ...res.data[key],
              id: key
            });
          }

          //now that we have the key saved in id, we can use the patch request to update the dislikedBy filed and use the key in the url
          //we will add the id of the logged in user to the dislikedBy field, therefore, we need to grab that id from the localStorage.
          const userId = localStorage.getItem("userId");
          const urlParams = fetchedUsers[0].id 
          axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + urlParams + '/dislikedBy.json', {[userId]: true})
            .then( response => {
              //now we need to add to the logged in user saying that we swiped left on the shown user, for that we need the key to the object that represents the logged in user,
              //for that we need to grab the logged in user
              const queryParams1 = /*'?auth=' + token + '&*/'?orderBy="userId"&equalTo="' + userId + '"';
              axios.get('https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams1)

                .then( response => {
                  const authenticatedUser = [];
                  for ( let key in response.data ) {
                    authenticatedUser.push( {
                      ...response.data[key],
                      id: key
                    });
                  }

                  //now that we have the firebase key, we need to to the logged in user saying that we disliked the user that was being shown
                  const urlParams1 = authenticatedUser[0].id;
                  axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + urlParams1 + '/disliked.json', {[swipedUserId]: true})

                    .then( response => {
                      dispatch(userSwipedDirection(direction));
                    })
                    .catch(err => {
                      dispatch(fetchUsersFail(err));
                    })

                })

                .catch( err => {
                  dispatch(fetchUsersFail(err));
                })
            })

            .catch( err => {
              dispatch(fetchUsersFail(err));
            });

        })
        .catch( err => {
          dispatch(fetchUsersFail(err));
        });
      
    }

    //if the user swiped right
    else {
      dispatch(userSwipedDirection(direction));
    }
  }
}