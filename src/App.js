import React, {useEffect, Suspense} from 'react';
import { Switch, Route, withRouter, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './App.css';
import Header from './components/Navbar/Header';
import TinderCards from './containers/TinderCards/TinderCards';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';


const UserProfile = React.lazy(() => {
  return import('./containers/UserProfile/UserProfile');
});

const Chats = React.lazy(() => {
  return import('./containers/Messaging/Chats/Chats');
});

const ChatScreen = React.lazy(() => {
  return import('./containers/Messaging/ChatScreen/ChatScreen');
});

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});


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

        <Route path="/user/:userId">
          {/*if we pass a prop of back button, we want to replace the left icon in the header with an arrow with takes us to a previous page/route instead of the profile icon*/}
          <Header backButton="/"/>
          <UserProfile/>
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
      <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
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
