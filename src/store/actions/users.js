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

export const userSwipedDirection = (direction) => {
  return {
    type: actionTypes.USER_SWIPED_DIRECTION,
    direction: direction
  };
};

export const match = (authenticatedUser, swipedUserId, direction) => {
  return dispatch => {
    //getting the user that was swiped on so that we can grab the firebase key and save it

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

      //now that we have the key saved in id, we can use the patch request to update the matches filed and use the key in the url
      //we will add the id of the logged in user to the matches field of the swiped user.
      const urlParams = fetchedUsers[0].id 
      axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + urlParams + '/matches.json', {[authenticatedUser.userId]: authenticatedUser})
      .then( response => {

        //now we need to add the match to the logged in user, for that we need the key to the object that represents the logged in user,
        //for that we need to grab the logged in user
        const queryParams1 = /*'?auth=' + token + '&*/'?orderBy="userId"&equalTo="' + authenticatedUser.userId + '"';
        axios.get('https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams1)
        .then( res => {

          const authenticatedUser = [];
          for ( let key in res.data ) {
            authenticatedUser.push( {
              ...res.data[key],
              id: key
            });
          }

          //now that we have the firebase key, we need to add the match to the logged in user
          const urlParams1 = authenticatedUser[0].id;
          axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + urlParams1 + '/matches.json', {[swipedUserId]: fetchedUsers[0]})

            .then( response => {
              console.log("THIS RAN");
              dispatch(userSwipedDirection(direction));
            })
            .catch(err => {
              dispatch(fetchUsersFail(err));
            })

        })
        .catch(err => {
          dispatch(fetchUsersFail(err));
        })

      })
      .catch(err => {
        dispatch(fetchUsersFail(err));
      })

    })
    .catch(err => {
      dispatch(fetchUsersFail(err));
    })
  }
    
}

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

      //getting the user that was swiped on so that we can grab the firebase key and save it.
      //adding the logged in user to the likedBy field on the swipedUserId
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

          //now that we have the key saved in id, we can use the patch request to update the likedBy filed and use the key in the url
          //we will add the id of the logged in user to the likedBy field, therefore, we need to grab that id from the localStorage.
          const userId = localStorage.getItem("userId");
          const urlParams = fetchedUsers[0].id 
          axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + urlParams + '/likedBy.json', {[userId]: true})
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

                  //now that we have the firebase key, we need to to the logged in user saying that we liked the user that was being shown
                  const urlParams1 = authenticatedUser[0].id;
                  axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + urlParams1 + '/liked.json', {[swipedUserId]: true})

                    .then( response => {

                      //now we want to check if the logged in user swiped right on someone, we want to check if the logged in user was already swiped right by the person he swiped right on
                      //if it has, then we want to add the match to both of them
                      if(authenticatedUser[0].likedBy.hasOwnProperty(swipedUserId) === true){
                        dispatch(match(authenticatedUser[0], swipedUserId, direction));
                      }
                      
                      //if it hasn't then we just proceed normally
                      else{
                        dispatch(userSwipedDirection(direction));
                      }

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



      dispatch(userSwipedDirection(direction));
    }
  }
}