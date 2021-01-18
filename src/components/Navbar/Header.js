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
          src="data:image/jpeg;base64,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"
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