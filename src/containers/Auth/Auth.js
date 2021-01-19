import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../sharedFunctions/utilityFunctions';

const auth = (props) => {


  const dispatch = useDispatch();
  const loadingAuth = useSelector( state => state.auth.loading );
  const errorAuth = useSelector( state => state.auth.error );
  const loadingUserCreation = useSelector( state => state.auth.loadingUserCreation );
  const errorUserCreation = useSelector( state => state.auth.errorUserCreation );
  const isAuthenticated = useSelector( state => state.auth.token !== null );
  const onAuth = useCallback(( email, password, isSignup, profilePicture1, profilePicture2, profilePicture3, profilePicture4, profilePicture5, age, firstName, lastName, gender, interestedIn, bio ) => dispatch( actions.auth( email, password, isSignup, profilePicture1, profilePicture2, profilePicture3, profilePicture4, profilePicture5, age, firstName, lastName, gender, interestedIn, bio ) ), [dispatch]);


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
    profilePicture1: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'First Profile Picture URL'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    profilePicture2: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Second Profile Picture URL'
      },
      value: '',
      validation: {
        required: false
      },
      valid: true,
      touched: true
    },
    profilePicture3: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Third Profile Picture URL'
      },
      value: '',
      validation: {
        required: false
      },
      valid: true,
      touched: true
    },
    profilePicture4: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Fourth Profile Picture URL'
      },
      value: '',
      validation: {
        required: false
      },
      valid: true,
      touched: true
    },
    profilePicture5: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Fifth Profile Picture URL'
      },
      value: '',
      validation: {
        required: false
      },
      valid: true,
      touched: true
    },
    age: {
      elementType: 'input',
      elementConfig: {
        type: 'number',
        placeholder: 'Age',
        min: '18',
        max: '99'
      },
      value: '18',
      validation: {
        required: true
      },
      valid: true,
      touched: true
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
    },
    bio: {
      elementType: 'textarea',
      elementConfig: {
        type: 'text',
        placeholder: 'Say something about yourself...'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    gender: {
      elementType: 'select',
      elementConfig: {
        options: [
          {value: 'Male',displayValue: 'Male'}, 
          {value: 'Female',displayValue: 'Female'}
        ],
        label: "Gender"
      },
      value: 'Male',
      validation: {
        //required: true,
        isSelect: true
      },
      valid: true,
      touched: true
    },
    interestedIn: {
      elementType: 'select',
      elementConfig: {
        options: [
          {value: 'Male', displayValue: 'Male'}, 
          {value: 'Female', displayValue: 'Female'}
        ],
        label: 'Interested In'
      },
      value: 'Male',
      validation: {
        //required: true,
        isSelect: true
      },
      valid: true,
      touched: true
    }
  })

  const [ isSignup, setIsSignup] = useState(true);

  const [ registerFormIsValid, setRegisterFormIsValid ] = useState(false);

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

    //if the user changed the inputs in the authForm
    if(form === authForm) {
      setAuthForm(updatedControls);
    }
    //if the user changed the inputs in the registerForm
    else {
      setRegisterForm(updatedControls);
      let isValid = true;

      for( let key in registerForm) {
        isValid = registerForm[key].valid && isValid
      }

      setRegisterFormIsValid(isValid);
    }
    
  }

  const submitHandler = ( event ) => {
    event.preventDefault();

    //login/register the user
    onAuth( authForm.email.value, authForm.password.value, isSignup, registerForm.profilePicture1.value, registerForm.profilePicture2.value, registerForm.profilePicture3.value
      , registerForm.profilePicture4.value, registerForm.profilePicture5.value, registerForm.age.value,
      registerForm.firstName.value, registerForm.lastName.value, registerForm.gender.value, registerForm.interestedIn.value, registerForm.bio.value );
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
        label={registerFormElem.config.elementConfig.label}
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

  if ( loadingAuth || loadingUserCreation ) {
    form = <Spinner />
  }

  let errorMessage = null;

  if ( errorAuth || errorUserCreation ) {
    errorMessage = (
      <React.Fragment>
        <p>{errorAuth ? errorAuth.message : null}</p>
        <p>{errorUserCreation ? errorUserCreation.message : null}</p>
      </React.Fragment>
    );
  }
  let authRedirect = null;
  if ( isAuthenticated && loadingUserCreation === false && !errorAuth && !errorUserCreation) {
    authRedirect = <Redirect to="/" />
  }

  return (
    <div>
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={submitHandler}>
          {form}
          {registerInfo}
          <Button btnType="Success" disabled={isSignup ? !registerFormIsValid : false}>SUBMIT</Button>
        </form>
        <Button
          clicked={switchAuthModeHandler}
          btnType="Danger">SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
      </div>
    </div>
  );
}

export default auth;