import React, {useState} from 'react';

import classes from './TinderCards.css';
import TinderCard from 'react-tinder-card';

const TinderCards = () => {

  /* since we're not allowing users to be created yet, we're just going to use
  dummy data that we created here to have 'fake users' to swipe on*/
  const [people, setPeople] = useState([
    {
      name: "Sonic",
      url:"https://cdn.vox-cdn.com/thumbor/pJcxMFhEAZ2cvnflEqMFD6z-OiU=/1400x1400/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/20007968/Screen_Shot_2020_05_28_at_4.34.01_PM.png",
      age: "Immortal"
    },
    {
      name: "Steve Jobs",
      url: "https://cdn.vox-cdn.com/thumbor/rES5fxTJl-z014NcJV7Rradtxrc=/0x86:706x557/1400x1400/filters:focal(0x86:706x557):format(png)/cdn.vox-cdn.com/imported_assets/847184/stevejobs.png",
      age: "Dead"
    }
  ]);

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