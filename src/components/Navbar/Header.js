import React from 'react';
import { connect } from 'react-redux';
import {NavLink} from 'react-router-dom';

import PersonIcon from '@material-ui/icons/Person';
import ForumIcon from '@material-ui/icons/Forum';
/*we want to add effects to the buttons when we click them (like we did in the header)
the problem was that the icons in the header were icons, not buttons, and
materialUI doesn't allow us to add animations to icons, but we can turn
the icons into buttons by using the Icon Button component and wrapping the
icons around with this component to turn it into a button, this way we 
still have them as icons and add the functionalities of a button*/
//note that when we do this, it already sets up a default animation on click, which we left it there as it was
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

import classes from './Header.css';

const Header = (props) => {

  let leftIcon = (
    <NavLink to ={"/user/" + props.userId}>
      <IconButton>
        <PersonIcon className={classes.icon} fontSize="large"/>
      </IconButton>
    </NavLink>
  );

  if(props.backButton) {
    leftIcon = (
      <NavLink to={props.backButton}>
        <IconButton>
          <ArrowBackIosIcon className={classes.icon} fontSize="large"/>
        </IconButton>
      </NavLink>
    )
  }

  //if the user isn't authenticated, we show the authentication button
  let rightIcon = (
    <NavLink to="/auth">
        <IconButton>
          <LockOpenIcon className={classes.icon} fontSize="large"/>
        </IconButton>
      </NavLink>
  );

  //if the user is authenticated, we show the logout button
  if(props.isAuthenticated) {
    rightIcon = (
      <React.Fragment>
        <NavLink to="/chat">
          <IconButton>
            <ForumIcon className={classes.icon} fontSize="large"/>
          </IconButton>
        </NavLink>

        <NavLink to="/logout">
          <IconButton>
            <MeetingRoomIcon className={classes.icon} fontSize="large"/>
          </IconButton>
        </NavLink>
      </React.Fragment>
    );
  }

  return (

    <div className={classes.header}>
      
      {leftIcon}

      <NavLink to="/">
        <img
          className={classes.logo}
          src="https://1000logos.net/wp-content/uploads/2018/07/tinder-logo.png"
          alt="tinderLogo"/>
      </NavLink>

      

      {rightIcon}

    </div>

  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    userId: state.auth.userId
  };
};

export default connect( mapStateToProps )(Header);