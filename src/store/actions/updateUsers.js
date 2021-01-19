import axios from '../../axios-instance';

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

export const updateUser = (profilePicture1, profilePicture2, profilePicture3, profilePicture4, profilePicture5, age, firstName, lastName, gender, interestedIn, bio) => {
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

      //preparing data structure to update the user info of the logged in user
      const userData = {
        profilePicture: updatedProfilePicture,
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
            //here we only need the first picture, we don't need every picture that the user inputted
            profilePicture: userData.profilePicture[0],
            firstName: userData.firstName,
            userId: userData.userId
          }

          //preparing the data we need to updated in the chats field
          const userChatsData = {
            //here we only need the first picture, we don't need every picture that the user inputted
            profilePicture: userData.profilePicture[0],
            name: userData.firstName,
            userId: userData.userId
          }

          //now we're going to loop through those users and update their matches field that holds the info of the logged in user
          matchedUsers.map(user => {
            return axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + user.id + '/matches/' + userId + '.json?auth=' + token, userMatchesData)
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