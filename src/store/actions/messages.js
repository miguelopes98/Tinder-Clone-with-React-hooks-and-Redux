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

      for( let id in loggedInUser.chats){
        
        //console.log("userInfo " + userInfo);
        //just so we don't grab the 'exists': true key-value pair
        if( id !== 'exists'){
          let textInfo = {
            name: loggedInUser.chats[id].firstName,
            profilePicture: loggedInUser.chats[id].profilePicture,
            lastMessage: loggedInUser.chats[id].messages.lastMessage,
            //this is just so we can assign a react key to each component we output when we loop through the last messages to render them, since we're going to be outputting a list of items
            userId: id
          };
          messagesToShow.push(textInfo);
          
        }
      }

      dispatch(fetchLastMessagesSuccess(messagesToShow))

    })
    .catch(err => {
      dispatch(fetchLastMessagesFail(err));
    })
  };
};




export const fetchMessagesSuccess = ( messagesToShow, recipientInfo ) => {
  return {
      type: actionTypes.FETCH_MESSAGES_SUCCESS,
      messagesToShow: messagesToShow,
      recipientInfo: recipientInfo
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

export const fetchMessages = (userId, recipientUserId) => {
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
      const loggedInUser = fetchedUser[0];
      const messagesToShow = [];

      //getting profile data of the recipient info
      const queryParams1 = /*'?auth=' + token + '&*/'?orderBy="userId"&equalTo="' + recipientUserId + '"';
      axios.get( 'https://tinder-9d380-default-rtdb.firebaseio.com/users.json' + queryParams1)
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
        const recipientUser = fetchedUser[0];

        const recipientInfo = {
          name: recipientUser.firstName,
          profilePicture: recipientUser.profilePicture
        }

        //this will contain the info of each object we're going to push to the array above

        for( let key in loggedInUser.chats[recipientUserId].messages){

          //we don't include the lastMessage, that isn't for the chat screen component, but for the chats component.
          if(key !== 'lastMessage'){
            let textInfo = {
              name: loggedInUser.chats[recipientUserId].messages[key].name,
              text: loggedInUser.chats[recipientUserId].messages[key].text
            };
            messagesToShow.push(textInfo);
          }
        }
        dispatch(fetchMessagesSuccess(messagesToShow, recipientInfo))
      })
      .catch(err => {
        dispatch(fetchMessagesFail(err));
      })        

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
            text: textSent,
            lastMessage: textSent
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
              text: textSent,
              lastMessage: textSent
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