import React from 'react';

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

import classes from './Header.css';

const Header = () => {

  return (

    <div className={classes.header}>

      <IconButton>
        <PersonIcon className={classes.icon} fontSize="large"/>
      </IconButton>

      <img
        className={classes.logo}
        src="https://1000logos.net/wp-content/uploads/2018/07/tinder-logo.png"
        alt="tinderLogo"/>

      <IconButton>
        <ForumIcon className={classes.icon} fontSize="large"/>
      </IconButton>

    </div>

  );
};

export default Header;