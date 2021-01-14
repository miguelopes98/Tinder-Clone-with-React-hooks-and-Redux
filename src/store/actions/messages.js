import axios from 'axios';

import * as actionTypes from './actionTypes';

export const fetchLastMessagesSuccess = ( messagesToShow ) => {
  return {
      type: actionTypes.FETCH_LAST_MESSAGES_SUCCESS,
      messagesToShow: messagesToShow
  };
};

export const fetchLastMessagesFail = ( error ) => {
  return {
      type: actionTypes.FETCH_LAST_MESSAGES_FAIL,
      error: error
  };
};

export const fetchLastMessagesStart = () => {
  return {
      type: actionTypes.FETCH_LAST_MESSAGES_START
  };
};

export const fetchLastMessages = (userId) => {
  return dispatch => {
    dispatch(fetchLastMessagesStart());
    //grabbing profile data associated to the logged in user
    const queryParams = /*'?auth=' + token + '&*/'?orderBy="userId"&equalTo="' + userId + '"';
    axios.get( 'https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams)
    .then(res => {
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

      //this will contain a list of objects with the matched user's info and the last message of the conversation with him.
      const messagesToShow = [];

      //this will contain the info of each object we're going to push to the array above
      let userInfo = null;

      for( let id in loggedInUser.chats){
        //just so we don't grab the 'exists': true key-value pair
        if( id !== 'exists'){
          userInfo = {
            name: loggedInUser.chats.id.firstName,
            profilePicture: loggedInUser.chats.id.profilePicture,
            lastMessage: loggedInUser.chats.id.messages.lastMessage
          }

          messagesToShow.push(userInfo);
        }
      }

      dispatch(fetchLastMessagesSuccess(messagesToShow))

    })
    .catch(err => {
      dispatch(fetchLastMessagesFail(err));
    })
  };
};




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

export const fetchMessages = (userId) => {
  return dispatch => {
    dispatch(fetchMessagesStart());
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

      const messagesToShow = [];

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

          
          

          dispatch(fetchMessagesSuccess());
        })
        .catch( err => {
          dispatch(fetchMessagesFail(err));
        });

    })
    .catch( err => {
      dispatch(fetchMessagesFail(err));
    });
  };
};





export const sendMessageSuccess = () => {
  return {
      type: actionTypes.SEND_MESSAGE_SUCCESS
  };
};

export const sendMessageFail = ( error ) => {
  return {
      type: actionTypes.SEND_MESSAGE_FAIL,
      error: error
  };
};

export const sendMessageStart = () => {
  return {
      type: actionTypes.SEND_MESSAGE_START
  };
};

export const sendMessage = ( recipientUserId, textSent) => {
  return dispatch => {
    dispatch(sendMessageStart());
    //grabbing profile data associated to the logged in user
    const userId = localStorage.getItem("userId");
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

      //grabbing profile data of the recipient user
      const queryParams1 = /*'?auth=' + token + '&*/'?orderBy="userId"&equalTo="' + recipientUserId + '"';
      axios.get( 'https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams1)
      .then(response => {


        let fetchedUser = [];
        //even though we are only grabbing one user for sure, we still don't have a way to know the firebase key that comes in the response.
        //that is why we still loop through something that we know that has only one key, that is why we still keep an array, just for good practice
        for ( let key in response.data ) {
          fetchedUser.push( {
            ...response.data[key],
            id: key
          });
        }
        const recipientUser = fetchedUser[0];

        //preparing the data we want to add to the chats field of the logged in user
        const recipientData = {
          name: recipientUser.firstName,
          profilePicture: recipientUser.profilePicture,
          userId: recipientUser.userId,
          messages: {
            text: textSent
          }
        }

        //now we're going to add the chat of the respective recipient user to the chats field in the logged in user
        /* loggedInUser.id is the firebase key of the logged in user*/
        axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + loggedInUser.id + '/chats.json', {[recipientUserId]: recipientData})
        .then(res => {

          //now we're preparing the data to add the chat of the logged in user to the chats field of the recipient user
          const senderData = {
            name: loggedInUser.firstName,
            profilePicture: loggedInUser.profilePicture,
            userId: loggedInUser.userId,
            messages: {
              name: loggedInUser.firstName,
              text: textSent
            }
          }

          //now we're going to add the chat of the logged in user to the chats field of the recipient user
          //recipientUser.id is the firebase key of the recipient user
          axios.patch('https://tinder-9d380-default-rtdb.firebaseio.com/users/' + recipientUser.id + '/chats.json', {[loggedInUser.userId]: senderData})
          .then(response => {
            dispatch(sendMessageSuccess());
          })
          .catch(err => {
            dispatch(sendMessageFail(err));
          })

          
        })
        .catch( err => {
          dispatch(sendMessageFail(err));
        });


      })
      .catch( err => {
        dispatch(sendMessageFail(err));
      })

      

    })
    .catch( err => {
      dispatch(sendMessageFail(err));
    });
  };
};