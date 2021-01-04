import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Header from './components/Header';
import classes from './App.css';

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
            <p>HomePage</p>
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
