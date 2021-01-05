import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import classes from './App.css';
import Header from './components/Navbar/Header';
import TinderCards from './components/TinderCards/TinderCards';
import SwipeButtons from './components/SwipeButtons/SwipeButtons';
import Chats from './components/Chats/Chats';

const App = () => {
  return (
    <div className={classes.App}>

      <Router>

        <Switch>

          <Route path="/chat">
            {/*if we pass a prop of back button, we want to replace the left icon in the header with an arrow with takes us to a previous page/route instead of the profile icon*/}
            <Header backButton="/"/>
            <Chats/>
          </Route>

          <Route path="/">
            <Header/>
            {/* when we swipe the cards off the screen, the component remains there, if we want to change this, we have to
            do this in the onCardLeftScreen callback, checkout documentation of this package here (https://www.npmjs.com/package/react-tinder-card) and look at th react course*/}
            <TinderCards/>
            <SwipeButtons/>
          </Route>

        </Switch>

        {/*Individual chat screen*/}
      </Router>
    </div>
  );
}

export default App;
