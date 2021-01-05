import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import classes from './App.css';
import Header from './components/Navbar/Header';
import TinderCards from './components/TinderCards/TinderCards';
import SwipeButtons from './components/SwipeButtons/SwipeButtons';

const App = () => {
  return (
    <div className={classes.App}>
      <h1>App Component</h1>

      

      <Router>

        {/* even though this is always shown and therefore isn't a route,
        this still has to be inside the Router/browserRouter component
        we mentioned this in the react course and we actually get an error if we
        have a navlink or a link directing somewhere inside this component and if it isn't inside the Router/browserRouter componen*/}
        <Header/>

        <Switch>

          <Route path="/chat">
            <p>chatPage</p>
          </Route>

          <Route path="/">
            {/* when we swipe the cards off the screen, the component remains there, if we want to change this, we have to
            do this in the onCardLeftScreen callback, checkout documentation of this package here (https://www.npmjs.com/package/react-tinder-card) and look at th react course*/}
            <TinderCards/>
            <SwipeButtons/>
          </Route>

        </Switch>


        {/*Chats screen*/}

        {/*Individual chat screen*/}
      </Router>

      


    </div>
  );
}

export default App;
