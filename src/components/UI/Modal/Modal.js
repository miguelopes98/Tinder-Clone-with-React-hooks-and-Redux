import React from 'react';

import classes from './Modal.css';
import Backdrop from '../Backdrop/Backdrop';

const modal = (props) => {

  return (
    <React.Fragment>
      <Backdrop show={props.show}/>
      <div className={classes.Modal}>
        {props.children}
      </div>
    </React.Fragment>
  );
}

export default React.memo(
  modal, 
  (prevProps, nextProps) => {
    return (
      nextProps.show === prevProps.show && 
      nextProps.children === prevProps.children
    );
  }
);