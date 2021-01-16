import React, {useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

import classes from './TinderCards.css';
import TinderCard from 'react-tinder-card';
import * as actions from '../../store/actions/index';
import Modal from '../../components/UI/Modal/Modal';
import ReplayIcon from '@material-ui/icons/Replay';
import CloseIcon from '@material-ui/icons/Close';
import StarRateIcon from '@material-ui/icons/StarRate';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import IconButton from '@material-ui/core/IconButton';

const TinderCards = (props) => {


  //initiating the refs array
  let elRefs = useRef([]);
  //if the length of the refs array isn't the same as the usersToShow, then we keep doing this. We want each element of the refs array to hold one ref for each user in the usersToShow list.
  if (elRefs.current.length !== props.usersToShow.length) {
    // add or remove refs
    elRefs = Array(props.usersToShow.length).fill().map((_, i) => elRefs.current[i] || React.createRef());
  }

  useEffect(() => {
    //we say this in case the user just created an account and gets redirected here, we want to make sure that his profile has finished being created before fetching the users to show him.
    if(props.loadingUserCreation === false && props.isAuthenticated) {
      props.onFetchUsers(props.userId);
      //console.log
    }
    //we had to add userId to the dependencies, because this was running before the useEffect hook on the app component was running for whatever reason
    //so we were fetching users before we reloggedin the user after he refreshed the app, this would fail because we would try to fetch users when no one was logged in, it would fail obviously
    //when we added the userId as a dependency, this would run the first time and fail for the same reason and then it would run a second time when the useEffect hook on the app component ran
    //and we would actually get a userId, this component should re render if the props changed and therefore this useEffect hook should run again, but this wasn't happening
    //i dont know why, when I added this as a dependency, it runs when the userId changes, even though it should regardless since it is a prop.
  },[props.loadingUserCreation, props.userId]);

  const swiped = (direction, userId) => {
    props.onUserSwiped(direction, userId);
    
    //everytime we swipe we want to grab the people we show again so that it is always updated
    //this is done in the onUserSwipe action, everytime we successfully swipe someone, we call for the users to be fetched.
  }

  const swipe = (dir) => {
    if (props.usersToShow.length) {
      const toBeRemoved = props.usersToShow[props.usersToShow.length - 1].userId // Find the card object to be removed
      const index = props.usersToShow.map(person => person.userId).indexOf(toBeRemoved) // Find the index of which to make the reference to
      // Swipe the card! this simply triggers the onSwipe event listener of the tinder card component of the package we're using, therefore it also triggers
      //the hadndlers that are called when the card is swiped.
      elRefs[index].current.swipe(dir)
    }
  }


  let users= null;
    
  // we need the searched for users props because without it, we start with loading as false by default, before trying to grab the users and the usersToShow array is by default length zero as well
  //therefore, we would render a spinner, then the paragraph saying we have no users and then the users, because it wouldn't give enough time to search for users,
  //this way we fix that problem
  if(props.searchedForUsers === true) {
     users = (
      <div className={classes.cardContainer}>
        {/* we're looping through the users we have and outputting them*/}
        {props.usersToShow.map((person, index) => {
          return (
            //this component is from a package we installed, the documentation can be found in https://www.npmjs.com/package/react-tinder-card 
            <TinderCard
              ref={elRefs[index]}
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
    );
    if(props.usersToShow.length === 0 && props.searchedForUsers) {
      users = (
        <h1 className={classes.noUsers}>There are currently no people around you, come back later to keep swiping!</h1>
      )
    }
  }
    
  //we're going to render a modal to ask the user to login if they're not logged in
  let modal = null;

  //if the user isn't authenticated, we render the modal
  if(!props.isAuthenticated){
    modal = (
      <Modal show={true}>
        <div className={classes.divModal}>
          <h2 className={classes.Login}>You need to have an account to start swipping!</h2>
          <Link className={classes.LoginButton} to="/auth">Login/Sign Up</Link>
        </div>
      </Modal>
    );
  }

  return (
    <div>
      {users}

      {modal}

      <div className={classes.swipeButtons}>
        <IconButton id={classes.repeat}>
          <ReplayIcon fontSize="large"/> 
        </IconButton>
        
        <IconButton onClick={() => swipe('left')} id={classes.left}>
          <CloseIcon fontSize="large"/>
        </IconButton>
        
        <IconButton id={classes.star}>
          <StarRateIcon fontSize="large"/>
        </IconButton>
        
        <IconButton onClick={() => swipe('right')} id={classes.right}>
          <FavoriteIcon fontSize="large"/>
        </IconButton>

        <IconButton id={classes.lightning}>
          <FlashOnIcon fontSize="large"/>
        </IconButton>
      </div>

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
    lastDirection: state.users.lastDirection,
    searchedForUsers: state.users.searchedForUsers,
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchUsers: (token, userId) => dispatch( actions.fetchUsers(token, userId)),
    onUserSwiped: (direction, userId) => dispatch( actions.userSwiped(direction, userId))
  };
};

export default connect( mapStateToProps, mapDispatchToProps )(TinderCards);