import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './UserProfile.css';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../sharedFunctions/utilityFunctions';
import axios from '../../axios-instance';
import withErrorHandler from '../../hoc/withErrorHandler';

const userProfile = (props) => {

  
  const dispatch = useDispatch();
  const authenticatedUser = useSelector( state => state.updateUser.authenticatedUser );
  const userId = useSelector( state => state.auth.userId );
  const loading = useSelector( state => state.updateUser.loadingFetchingUser );
  const loadingUpdateUser = useSelector( state => state.updateUser.loadingUpdateUser );
  const error = useSelector( state => state.updateUser.error );
  const errorUpdateUser = useSelector( state => state.updateUser.errorUpdateUser );
  const isAuthenticated = useSelector( state => state.auth.token !== null );
  const onFetchAuthenticatedUser = useCallback(( userId ) => dispatch( actions.fetchAuthenticatedUser( userId ) ), [dispatch]);
  const onUpdateUser = useCallback((profilePicture1, profilePicture2, profilePicture3, profilePicture4, profilePicture5, age, firstName, lastName, gender, interestedIn, bio) => dispatch( actions.updateUser(profilePicture1, profilePicture2, profilePicture3, profilePicture4, profilePicture5, age, firstName, lastName, gender, interestedIn, bio)), [dispatch]);


  //registerForm state, where we setup the sign up part of the form, its only rendered if the user is registering, not signing in
  const [registerForm, setRegisterForm] = useState()
  const [formIsReady, setFormIsReady] = useState(false);

  if(authenticatedUser && !formIsReady) {
    setFormIsReady(true);
    setRegisterForm({
      profilePicture1: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Profile Picture URL'
        },
        value: authenticatedUser.profilePicture[0],
        validation: {
          required: true
        },
        valid: true,
        touched: true
      },
      profilePicture2: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Profile Picture URL'
        },
        value: authenticatedUser.profilePicture[1] ? authenticatedUser.profilePicture[1] : '',
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
          placeholder: 'Profile Picture URL'
        },
        value: authenticatedUser.profilePicture[2] ? authenticatedUser.profilePicture[2] : '',
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
          placeholder: 'Profile Picture URL'
        },
        value: authenticatedUser.profilePicture[3] ? authenticatedUser.profilePicture[3] : '',
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
          placeholder: 'Profile Picture URL'
        },
        value: authenticatedUser.profilePicture[4] ? authenticatedUser.profilePicture[4] : '',
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
        value: authenticatedUser.age,
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
        value: authenticatedUser.firstName,
        validation: {
          required: true
        },
        valid: true,
        touched: true
      },
      lastName: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Last Name'
        },
        value: authenticatedUser.lastName,
        validation: {
          required: true
        },
        valid: true,
        touched: true
      },
      bio: {
        elementType: 'textarea',
        elementConfig: {
          type: 'text',
          placeholder: 'Say something about yourself...'
        },
        value: authenticatedUser.bio,
        validation: {
          required: true
        },
        valid: true,
        touched: true
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
        value: authenticatedUser.gender,
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
        value: authenticatedUser.interestedIn,
        validation: {
          //required: true,
          isSelect: true
        },
        valid: true,
        touched: true
      }
    })
  }

  const [ registerFormIsValid, setRegisterFormIsValid ] = useState(true);

  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {
    //fecthing authenticated user info
    onFetchAuthenticatedUser(userId);
  }, [userId]);

  const inputChangedHandler = ( event, controlName, form ) => {
    const updatedControls = updateObject( form, {
      [controlName]: updateObject( form[controlName], {
        value: event.target.value,
        valid: checkValidity( event.target.value, form[controlName].validation ),
        touched: true
      })
    });

    setRegisterForm(updatedControls);
    let isValid = true;

    for( let key in updatedControls) {
      isValid = updatedControls[key].valid && isValid
    }

    setRegisterFormIsValid(isValid);
    
  }

  const submitHandler = ( event ) => {
    event.preventDefault();
    setIsUpdating(false);
    //login/register the user
    onUpdateUser( registerForm.profilePicture1.value, registerForm.profilePicture2.value, registerForm.profilePicture3.value, registerForm.profilePicture4.value, registerForm.profilePicture5.value,
      registerForm.age.value, registerForm.firstName.value, registerForm.lastName.value, registerForm.gender.value, 
      registerForm.interestedIn.value, registerForm.bio.value );
  }


  //BUILDING REGISTER FORM
  const registerFormElemArray = [];
  for ( let key in registerForm ) {
    registerFormElemArray.push( {
      id: key,
      config: registerForm[key]
    });
  }

  let registerInfo = registerFormElemArray.map( registerFormElem => (
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

  if ( loading || props.loadingUserCreation ) {
    registerInfo = <Spinner />
  }

  let userUpdateRedirect = null;
  if ( loadingUpdateUser === false && isUpdating === false && isAuthenticated && error === null && errorUpdateUser === null) {
    userUpdateRedirect = <Redirect to="/" />
  }

  return (
    <div>
      {error || errorUpdateUser ? 
        <h1 style={{'textAlign': 'center', 'position': 'absolute', 'top': '50%', 'left': '50%', 'marginRight': '-50%', 'transform': 'translate(-50%, -50%)'}}>Something went wrong!</h1> 
        : 
        <div className={classes.UpdateForm}>
          <h1>Update your Profile Information</h1>
          {userUpdateRedirect}
          <form onSubmit={submitHandler}>
            {registerInfo}
            <Button btnType="Success" disabled={!registerFormIsValid}>SUBMIT</Button>
          </form>
        </div>
      }
    </div>
  );
}

export default withErrorHandler(  userProfile, axios);