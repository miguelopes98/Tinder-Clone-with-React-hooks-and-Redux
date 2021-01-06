import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import classes from './App.css';
import Header from './components/Navbar/Header';
import TinderCards from './components/TinderCards/TinderCards';
import SwipeButtons from './components/SwipeButtons/SwipeButtons';
import Chats from './components/Messaging/Chats/Chats';
import ChatScreen from './components/Messaging/ChatScreen/ChatScreen';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';

const App = () => {
  return (
    <div className={classes.App}>

      <Router>

        <Switch>

          {/*we later need to change this to be person id*/}
          <Route path="/chat/:person">
            {/*if we pass a prop of back button, we want to replace the left icon in the header with an arrow with takes us to a previous page/route instead of the profile icon*/}
            <Header backButton="/chat"/>
            <ChatScreen/>
          </Route>

          <Route path="/chat">
            {/*if we pass a prop of back button, we want to replace the left icon in the header with an arrow with takes us to a previous page/route instead of the profile icon*/}
            <Header backButton="/"/>
            <Chats/>
          </Route>

          <Route path="/auth">
            {/*if we pass a prop of back button, we want to replace the left icon in the header with an arrow with takes us to a previous page/route instead of the profile icon*/}
            <Header backButton="/"/>
            <Auth/>
          </Route>

          <Route path="/logout">
            {/*if we pass a prop of back button, we want to replace the left icon in the header with an arrow with takes us to a previous page/route instead of the profile icon*/}
            <Header backButton="/"/>
            <Logout/>
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
