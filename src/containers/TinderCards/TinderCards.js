import React, {useEffect} from 'react';
import { connect } from 'react-redux';

import classes from './TinderCards.css';
import TinderCard from 'react-tinder-card';
import * as actions from '../../store/actions/index';

const TinderCards = (props) => {

  useEffect(() => {
    //we say this in case the user just created an account and gets redirected here, we want to make sure that his profile has finished being created before fetching the users to show him.
    if(props.loadingUserCreation === false) {
      props.onFetchUsers(props.token, props.userId);
    }
  }, []);

  const swiped = (direction, userId) => {
    console.log('removing: ' + userId);
    props.onUserSwiped(direction, userId);

    //everytime we swipe we want to grab the people we show again so that it is always updated
    props.onFetchUsers(props.token, props.userId);
  }

  return (
    <div>
      <h1>Tinder Cards</h1>

      <div className={classes.cardContainer}>
        {/* we're looping through the users we have and outputting them*/}
        {props.usersToShow.map(person => {
          return (
            //this component is from a package we installed, the documentation can be found in https://www.npmjs.com/package/react-tinder-card 
            <TinderCard
              className={classes.swipe}
              onSwipe={(dir) => swiped(dir, person.userId)}
              key={person.userId}
              //this doesn't allow the user to swipe up and down, if we want to include the super like we have to change this to not include up
              preventSwipe={['up', 'down']}
            >
              <div 
                //we're setting a backgroundImage css style to be url(something); this syntax is recognized by css, then we just used ${} to output something dynamic,
                //we used backticks instead of regular quotes ("") because that allows us to input something dynamic, while the regular quotes doesnt, not even if we had used "url(" + {person.url} + ");"
                style={{ backgroundImage: `url("${person.profilePicture}")` }}
                className={classes.card}>
                  <h3>{person.firstName}, {person.age}</h3>
              </div>
            </TinderCard>
          );
        })}
      </div>
      {props.lastDirection ? <p className='infoText'>You swiped {props.lastDirection}</p> : <p className='infoText' />}
    </div>
  );

};

const mapStateToProps = state => {
  return {
    usersToShow: state.users.usersToShow,
    loading: state.users.loading,
    token: state.auth.token,
    userId: state.auth.userId,
    loadingUserCreation: state.auth.loadingUserCreation,
    lastDirection: state.users.lastDirection
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchUsers: (token, userId) => dispatch( actions.fetchUsers(token, userId)),
    onUserSwiped: (direction, userId) => dispatch( actions.userSwiped(direction, userId))
  };
};

export default connect( mapStateToProps, mapDispatchToProps )(TinderCards);