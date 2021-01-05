import React from 'react';

import classes from './SwipeButtons.css'
import ReplayIcon from '@material-ui/icons/Replay';
import CloseIcon from '@material-ui/icons/Close';
import StarRateIcon from '@material-ui/icons/StarRate';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import IconButton from '@material-ui/core/IconButton';

const SwipeButtons = () => {
  return (
    <div className={classes.swipeButtons}>
      <IconButton id={classes.repeat}>
        <ReplayIcon fontSize="large"/> 
      </IconButton>
      
      <IconButton id={classes.left}>
        <CloseIcon fontSize="large"/>
      </IconButton>
      
      <IconButton id={classes.star}>
        <StarRateIcon fontSize="large"/>
      </IconButton>
      
      <IconButton id={classes.right}>
        <FavoriteIcon fontSize="large"/>
      </IconButton>

      <IconButton id={classes.lightning}>
        <FlashOnIcon fontSize="large"/>
      </IconButton>

    </div>
  );
};

export default SwipeButtons;