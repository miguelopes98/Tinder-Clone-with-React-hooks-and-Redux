import React, {useState, useEffect} from 'react';
import database from '../../firebase';

import classes from './TinderCards.css';
import TinderCard from 'react-tinder-card';

const TinderCards = () => {

  /* since we're not allowing users to be created yet, we're just going to use
  dummy data that we created here to have 'fake users' to swipe on*/
  const [people, setPeople] = useState([]);

  useEffect(() => {
    console.log(process.env.REACT_APP_API_KEY);
    //we're grabbing the people we have in our database, instead of using the dummy data we had defined in the local state of this component
    //To grab info from a collection, we use onSnapshot, this constantly listen to a document/collection, whenever something inside that document/collection changes,
    //onSnapshot is automatically re-called so that we're grabbing the updated document/collection from firebase
    //if we had used .get() we would retrieve a single document/collection only once, if something changes in that document/collection, if we want to use the updated version of it, we have to re-call .get() manually.
    
    //in this case, we grabbed a snapshot from out collection, then we have that snapshot and we access the documents we have inside it using .docs and then we loop through them using map
    database.collection('people').onSnapshot(snapshot => {
      return (
        //whatever is in the return statement inside the map function is added to an array which is returned by the map function when we finish looping through the documents.
        //in the database we have all the users we want to loop through, therefore we just replace the whole local state with what we grabbed from the database.
        //we didn't use the spread operator to preserve parts of the previous local state.
        setPeople(snapshot.docs.map(document => {
          return document.data();
        }))
      );
    });
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

export default TinderCards;