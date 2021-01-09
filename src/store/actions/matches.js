import axios from 'axios';

import * as actionTypes from './actionTypes';

export const fetchMatchesStart = () => {
  return {
      type: actionTypes.FETCH_MATCHES_START
  };
};

export const fetchMatchesSucess = ( usersToShow ) => {
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
  };
};