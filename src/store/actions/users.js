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

    const userId = localStorage.getItem('userId');
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