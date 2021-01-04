import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import classes from './App.css';
import Header from './components/Navbar/Header';
import TinderCards from './components/TinderCards/TinderCards';

const App = () => {
  return (
    <div className={classes.App}>
      <h1>App Component</h1>

      <Header/>

      <Router>

        <Switch>

          <Route path="/chat">
            <p>chatPage</p>
          </Route>

          <Route path="/">

            {/* when we swipe the cards off the screen, the component remains there, if we want to change this, we have to
            do this in the onCardLeftScreen callback, checkout documentation of this package here (https://www.npmjs.com/package/react-tinder-card) and look at th react course*/}
            <TinderCards/>
          </Route>
          
        </Switch>

        {/*Tinder Cards*/}

        {/*Buttons below tinder cards*/}


        {/*Chats screen*/}

        {/*Individual chat screen*/}
      </Router>

      


    </div>
  );
}

export default App;
