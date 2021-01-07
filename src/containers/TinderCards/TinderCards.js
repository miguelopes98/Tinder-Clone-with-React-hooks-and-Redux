import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';

import classes from './TinderCards.css';
import TinderCard from 'react-tinder-card';
import * as actions from '../../store/actions/index';

const TinderCards = (props) => {

  /* since we're not allowing users to be created yet, we're just going to use
  dummy data that we created here to have 'fake users' to swipe on*/
  const [people, setPeople] = useState([]);

  useEffect(() => {
    console.log(props.userId);
    props.onFetchUsers(props.token, props.userId);
    /*//we're grabbing the people we have in our database, instead of using the dummy data we had defined in the local state of this component
    //To grab info from a collection, we use onSnapshot, this constantly listen to a document/collection, whenever something inside that document/collection changes,
    //onSnapshot is automatically re-called so that we're grabbing the updated document/collection from firebase
    //if we had used .get() we would retrieve a single document/collection only once, if something changes in that document/collection, if we want to use the updated version of it, we have to re-call .get() manually.
    
    //in this case, we grabbed a snapshot from out collection, then we have that snapshot and we access the documents we have inside it using .docs and then we loop through them using map
    const unsubscribe = database.collection('people').onSnapshot(snapshot => {
      return (
        //whatever is in the return statement inside the map function is added to an array which is returned by the map function when we finish looping through the documents.
        //in the database we have all the users we want to loop through, therefore we just replace the whole local state with what we grabbed from the database.
        //we didn't use the spread operator to preserve parts of the previous local state.
        setPeople(snapshot.docs.map(document => {
          return document.data();
        }))
      );
    });

    //this is the cleanup function
    //what onSnapshot does is it sets up a listener, every time useEffect runs, we would set up a new listener, now
    //if we had people as a dependency, everytime we swiped someone, we would add another listener, which would end up creating hundreds of listeners, which would slow down our app
    //because of that we use the cleanup function, where we unsubscribe from the previous listener we set up (we delete the previous listener before creating a new one)
    //onSnapshot returns a function as well which is the unsubscribe function, to exactly unsubscribe from the listener, that is why we ran unsubscribe.
    //in this case we don't have people as a dependency, so use effect will only run when the component mounts for the first time, so we will not create a bunch of listeners, only one
    //but it is a good practice to do this, that is why we did it here, even though it doesn't make a difference because the cleanup function will never run since useEffect will only run once
    //the cleanup function would only run right before we would call the useEffect for the second time, but that doesn't happen here, so it doesn't make a difference.
    return () => {
      unsubscribe();
    }
*/
  }, []);

  return (
    <div>
      <h1>Tinder Cards</h1>

      <div className={classes.cardContainer}>
        {/* we're looping through the users we have and outputting them*/}
        {people.map(person => {
          return (
            //this component is from a package we installed, the documentation can be found in https://www.npmjs.com/package/react-tinder-card 
            <TinderCard
              className={classes.swipe}
              //change this to the firebase id when we start grabbing the users from there
              key={person.name}
              //this doesn't allow the user to swipe up and down, if we want to include the super like we have to change this to not include up
              preventSwipe={['up', 'down']}
            >
              <div 
                //we're setting a backgroundImage css style to be url(something); this syntax is recognized by css, then we just used ${} to output something dynamic,
                //we used backticks instead of regular quotes ("") because that allows us to input something dynamic, while the regular quotes doesnt, not even if we had used "url(" + {person.url} + ");"
                style={{ backgroundImage: `url("${person.url}")` }}
                className={classes.card}>
                  <h3>{person.name}, {person.age}</h3>
              </div>
            </TinderCard>
          );
        })}
      </div>
      
    </div>
  );

};

const mapStateToProps = state => {
  return {
    users: state.users.users,
    loading: state.users.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchUsers: (token, userId) => dispatch( actions.fetchUsers(token, userId) )
  };
};

export default connect( mapStateToProps, mapDispatchToProps )(TinderCards);