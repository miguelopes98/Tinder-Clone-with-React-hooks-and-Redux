import React, {useEffect} from 'react';
import { Switch, Route, withRouter, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './App.css';
import Header from './components/Navbar/Header';
import TinderCards from './containers/TinderCards/TinderCards';
import Chats from './containers/Messaging/Chats/Chats';
import ChatScreen from './containers/Messaging/ChatScreen/ChatScreen';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';



const App = (props) => {

  useEffect(() => {
    props.onTryAutoSignup();
  }, [props.onTryAutoSignup]);

  let routes = (
    <Switch>
      <Route path="/auth" exact>
        {/*if we pass a prop of back button, we want to replace the left icon in the header with an arrow with takes us to a previous page/route instead of the profile icon*/}
        <Header backButton="/"/>
        <Auth/>
      </Route>

      <Route path="/" exact>
        <Header/>
        {/* when we swipe the cards off the screen, the component remains there, if we want to change this, we have to
        do this in the onCardLeftScreen callback, checkout documentation of this package here (https://www.npmjs.com/package/react-tinder-card) and look at th react course*/}
        <TinderCards/>
      </Route>
      <Redirect to="/" />
    </Switch>
  );

  if(props.isAuthenticated) {
    routes = (
      <Switch>

        {/*we later need to change this to be person id*/}
        <Route path="/chat/:userId">
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
        </Route>
        
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div className={classes.App}>
        {routes}
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
