import React from 'react';
import { Switch, Route, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './App.css';
import Header from './components/Navbar/Header';
import TinderCards from './containers/TinderCards/TinderCards';
import SwipeButtons from './components/SwipeButtons/SwipeButtons';
import Chats from './components/Messaging/Chats/Chats';
import ChatScreen from './components/Messaging/ChatScreen/ChatScreen';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const App = () => {
  return (
    <div className={classes.App}>

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

    </div>
  );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch( actions.authCheckState() )
  };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );
