import React, {useEffect, useRef, useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import AddIcon from '@material-ui/icons/Add';
import axios from '../../axios-instance';
import withErrorHandler from '../../hoc/withErrorHandler';

const TinderCards = (props) => {


  const dispatch = useDispatch();
  const usersToShow = useSelector( state => state.users.usersToShow );
  const userId = useSelector( state => state.auth.userId );
  const loadingUserCreation = useSelector( state => state.auth.loadingUserCreation );
  const searchedForUsers = useSelector( state => state.users.searchedForUsers );
  const isAuthenticated = useSelector( state => state.auth.token !== null );
  const error = useSelector( state => state.users.error );
  const onFetchUsers = useCallback((token, userId) => dispatch( actions.fetchUsers(token, userId)), [dispatch]);
  const onUserSwiped = useCallback((direction, userId) => dispatch( actions.userSwiped(direction, userId)), [dispatch]);


  const [showBio, setShowBio] = useState(false);

  const [clickedBioPerson, setClickedBioPerson] = useState();


  //initiating the refs array
  let elRefs = useRef([]);
  //if the length of the refs array isn't the same as the usersToShow, then we keep doing this. We want each element of the refs array to hold one ref for each user in the usersToShow list.
  if (elRefs.current.length !== usersToShow.length) {
    // add or remove refs
    elRefs = Array(usersToShow.length).fill().map((_, i) => elRefs.current[i] || React.createRef());
  }

  useEffect(() => {
    //we say this in case the user just created an account and gets redirected here, we want to make sure that his profile has finished being created before fetching the users to show him.
    if(loadingUserCreation === false && isAuthenticated) {
      onFetchUsers(userId);
      //console.log
    }
    //we had to add userId to the dependencies, because this was running before the useEffect hook on the app component was running for whatever reason
    //so we were fetching users before we reloggedin the user after he refreshed the app, this would fail because we would try to fetch users when no one was logged in, it would fail obviously
    //when we added the userId as a dependency, this would run the first time and fail for the same reason and then it would run a second time when the useEffect hook on the app component ran
    //and we would actually get a userId, this component should re render if the props changed and therefore this useEffect hook should run again, but this wasn't happening
    //i dont know why, when I added this as a dependency, it runs when the userId changes, even though it should regardless since it is a prop.
  },[loadingUserCreation, userId]);

  const swiped = (direction, userId) => {
    onUserSwiped(direction, userId);
    setNumber(0);
    //everytime we swipe we want to grab the people we show again so that it is always updated
    //this is done in the onUserSwipe action, everytime we successfully swipe someone, we call for the users to be fetched.
  }

  const swipe = (dir) => {
    if (usersToShow.length) {
      const toBeRemoved = usersToShow[usersToShow.length - 1].userId // Find the card object to be removed
      const index = usersToShow.map(person => person.userId).indexOf(toBeRemoved) // Find the index of which to make the reference to
      // Swipe the card! this simply triggers the onSwipe event listener of the tinder card component of the package we're using, therefore it also triggers
      //the hadndlers that are called when the card is swiped.
      elRefs[index].current.swipe(dir)
    }
  }


  const bioClickHandler = (person) => {
    //if show bio was true, we turn it to false, if it was false, we turn it to true
    setShowBio(prevState => {
      return !prevState;
    });
    setClickedBioPerson(person);
  }

  const [number, setNumber] = useState(0);

  const pictureClickHandler = (clickSide, numberPictures) => {
    if(clickSide === "left" && number > 0) {
      setNumber(prevState => {
        return prevState - 1;
      });
    }
    if(clickSide === "right" && number < numberPictures) {
      setNumber(prevState => {
        return prevState + 1;
      });
    }
  }


  let users= null;
    
  // we need the searched for users props because without it, we start with loading as false by default, before trying to grab the users and the usersToShow array is by default length zero as well
  //therefore, we would render a spinner, then the paragraph saying we have no users and then the users, because it wouldn't give enough time to search for users,
  //this way we fix that problem
  if(searchedForUsers === true) {
    users = (
      <div className={classes.cardContainer}>
        {/* we're looping through the users we have and outputting them*/}
        {usersToShow.map((person, index) => {

          let divPictures = [];
          
          for(let key in person.profilePicture) {
            divPictures.push(0);
          }

          divPictures[number] = <div className={classes.pictureLineActive}></div>;

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
                style={{ backgroundImage: `url("${person.profilePicture[number]}")` }}
                className={classes.card}>
                  <div className={classes.parent}>
                    {divPictures.map((arrElement, index) => {
                      if(index === number){
                        return <div key={index} className={classes.pictureLineActive}></div>;
                      }
                      else {
                        return <div key={index} className={classes.pictureLine}></div>
                      }
                    })}
                  </div>
                  <div onClick={() => pictureClickHandler('left', divPictures.length - 1 )} className={classes.left}></div>
                  <div onClick={() => pictureClickHandler('right', divPictures.length - 1)} className={classes.right}></div>
                  <h3>{person.firstName}, {person.age}</h3>
              </div>
              <IconButton onClick={() => bioClickHandler(person)} id={classes.plus}>
                <AddIcon fontSize="large"/> 
              </IconButton>
            </TinderCard>
          );
        })}
          
      </div>
    );
    if(usersToShow.length === 0 && searchedForUsers) {
      users = (
        <h1 className={classes.noUsers}>There are currently no people around you, come back later to keep swiping!</h1>
      )
    }
  }
    
  //we're going to render a modal to ask the user to login if they're not logged in
  let modal = null;

  //if the user isn't authenticated, we render the modal
  if(!isAuthenticated){
    modal = (
      <Modal show={true}>
        <div className={classes.divModal}>
          <h2 className={classes.Login}>You need to have an account to start swipping!</h2>
          <Link className={classes.LoginButton} to="/auth">Login/Sign Up</Link>
        </div>
      </Modal>
    );
  }

  //we're going to render a modal with the user bio and more if they click the plus button in the tinder card component
  let bio = null;

  //if they clicked the plus button to see more
  if(showBio) {
    bio = (
      <Modal show={true}>
        <div className={classes.divModal}>
          <h1 className={classes.bioTitle}>User's Bio</h1>
          <hr/>
          <h3>{clickedBioPerson.firstName} {clickedBioPerson.lastName}, {clickedBioPerson.age}</h3>

          <p className={classes.bioText}>{clickedBioPerson.bio}</p>

          <button className={classes.dismissBio} onClick={bioClickHandler}>Dismiss</button>
        </div>
      </Modal>
    );
  }

  return (
    <div>
      {error? 
        <h1 style={{'textAlign': 'center', 'position': 'absolute', 'top': '50%', 'left': '50%', 'marginRight': '-50%', 'transform': 'translate(-50%, -50%)'}}>Something went wrong!</h1> 
        : 
        <div>
          {users}

          {modal}

          {bio}
        </div>
      }
        

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

export default withErrorHandler(TinderCards, axios);
