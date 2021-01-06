import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../sharedFunctions/utilityFunctions';

const auth = (props) => {

  //authForm state, where we setup the authentication form/sign in form
  const [ authForm, setAuthForm] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Mail Address'
      },
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Password'
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  });

  //registerForm state, where we setup the sign up part of the form, its only rendered if the user is registering, not signing in
  const [registerForm, setRegisterForm] = useState({
    profilePicture: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Profile Picture URL'
      },
      value: '',
      validation: {
        required: true,
        isImageUrl: true
      },
      valid: false,
      touched: false
    },
    age: {
      elementType: 'input',
      elementConfig: {
        type: 'number',
        placeholder: 'Age',
        min: '18',
        max: '99'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    firstName: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'First Name'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    lastName: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Last Name'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    }
  })

  const [ isSignup, setIsSignup] = useState(true);

  useEffect(() => {
    /*if ( isregistering? && props.authRedirectPath !== '/' ) {
      props.onSetAuthRedirectPath();
    }*/
  }, []);

  const inputChangedHandler = ( event, controlName, form ) => {
    const updatedControls = updateObject( form, {
      [controlName]: updateObject( form[controlName], {
        value: event.target.value,
        valid: checkValidity( event.target.value, form[controlName].validation ),
        touched: true
      })
    });
    if(form == authForm) {
      setAuthForm(updatedControls);
    }
    else {
      setRegisterForm(updatedControls);
    }
  }

  const submitHandler = ( event ) => {
    event.preventDefault();
    props.onAuth( authForm.email.value, authForm.password.value, registerForm.profilePicture.value, registerForm.age.value,
      registerForm.firstName.value, registerForm.lastName.value, isSignup );
  }

  const switchAuthModeHandler = () => {
    setIsSignup((prevIsSignup) => {
      return !prevIsSignup
    });
  }

  //BUILDING AUTH FORM

  const formElementsArray = [];
  for ( let key in authForm ) {
    formElementsArray.push( {
      id: key,
      config: authForm[key]
    });
  }

  let form = formElementsArray.map( formElement => (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      changed={( event ) => inputChangedHandler( event, formElement.id, authForm )} />
  ));

  //BUILDING REGISTER FORM, IS ONLY RENDERED IF THE USER IS SIGNING UP

  let registerInfo = null;

  if(isSignup){
    const registerFormElemArray = [];
    for ( let key in registerForm ) {
      registerFormElemArray.push( {
        id: key,
        config: registerForm[key]
      });
    }

    registerInfo = registerFormElemArray.map( registerFormElem => (
      <Input
        key={registerFormElem.id}
        elementType={registerFormElem.config.elementType}
        elementConfig={registerFormElem.config.elementConfig}
        value={registerFormElem.config.value}
        invalid={!registerFormElem.config.valid}
        shouldValidate={registerFormElem.config.validation}
        touched={registerFormElem.config.touched}
        changed={( event ) => inputChangedHandler( event, registerFormElem.id, registerForm )} />
    ));
  };

  if ( props.loading ) {
    form = <Spinner />
  }

  let errorMessage = null;

  if ( props.error ) {
    errorMessage = (
      <p>{props.error.message}</p>
    );
  }

  let authRedirect = null;
  if ( props.isAuthenticated ) {
    authRedirect = <Redirect to="/" />
  }

  return (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        {registerInfo}
        <Button btnType="Success">SUBMIT</Button>
      </form>
      <Button
        clicked={switchAuthModeHandler}
        btnType="Danger">SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null//,
    //authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: ( email, password, profilePicture, age, firstName, lastName, isSignup ) => dispatch( actions.auth( email, password, profilePicture, age, firstName, lastName, isSignup ) )//,
    //onSetAuthRedirectPath: () => dispatch( actions.setAuthRedirectPath( '/' ) )
  };
};

export default connect( mapStateToProps, mapDispatchToProps )( auth );