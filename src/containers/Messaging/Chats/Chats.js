import React, {useEffect, createRef} from 'react';
import { connect } from 'react-redux';
import ScrollContainer from 'react-indiana-drag-scroll'

import classes from './Chats.css';
import Chat from './Chat/Chat';
import * as actions from '../../../store/actions/index';
import Match from './Match/Match';

const Chats = (props) => {

  const numbers = new Array(20).fill(1).map((_, index) => index + 1);

  const scrollRef = createRef();

  const enableKeyboardCursorToScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.focus();
    }
  };


  return(
    <div>

      <h2 className={classes.newMatches}>New Matches</h2>

      <ScrollContainer className={classes.container} vertical={false}>
        <section
          className={classes.tiles}
          onFocus={enableKeyboardCursorToScroll}
          ref={scrollRef}
        >
          {numbers.map((el) => (
            <div
              key={el}
              className={classes.row}
            >
              <Match
                profilePic="https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
                name="Alexandra"
              />
            </div>
          ))}
        </section>
      </ScrollContainer>

      <h2 className={classes.messages}>Messages</h2>

      <div className={classes.chats}>
        <Chat
          name="Àstrid Bergès-Frisbey"
          message="Heyy whats up?"
          timestamp="40 seconds ago"
          profilePic="https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
        />
        <Chat
          name="Juultje Tieleman"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://taddlr.com/wp-content/uploads/Screenshot-2020-06-25-at-11.47.45.png"
        />
        <Chat
          name="Mikky Kiemeney"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://www.paraeles.pt/wp-content/uploads/2019/03/mikkykiemeney_35338988_231560977655444_5072636146450694144_n.jpg"
        />
        <Chat
          name="Scarlett Johanson"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-179427791-1580485545.jpg?crop=1xw:0.6665776828617191xh;center,top&resize=480:*"
        />
        <Chat
          name="Àstrid Bergès-Frisbey"
          message="Heyy whats up?"
          timestamp="40 seconds ago"
          profilePic="https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
        />
        <Chat
          name="Juultje Tieleman"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://taddlr.com/wp-content/uploads/Screenshot-2020-06-25-at-11.47.45.png"
        />
        <Chat
          name="Mikky Kiemeney"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://www.paraeles.pt/wp-content/uploads/2019/03/mikkykiemeney_35338988_231560977655444_5072636146450694144_n.jpg"
        />
        <Chat
          name="Scarlett Johanson"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-179427791-1580485545.jpg?crop=1xw:0.6665776828617191xh;center,top&resize=480:*"
        />
        <Chat
          name="Àstrid Bergès-Frisbey"
          message="Heyy whats up?"
          timestamp="40 seconds ago"
          profilePic="https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
        />
        <Chat
          name="Juultje Tieleman"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://taddlr.com/wp-content/uploads/Screenshot-2020-06-25-at-11.47.45.png"
        />
        <Chat
          name="Mikky Kiemeney"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://www.paraeles.pt/wp-content/uploads/2019/03/mikkykiemeney_35338988_231560977655444_5072636146450694144_n.jpg"
        />
        <Chat
          name="Scarlett Johanson"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-179427791-1580485545.jpg?crop=1xw:0.6665776828617191xh;center,top&resize=480:*"
        />
        <Chat
          name="Àstrid Bergès-Frisbey"
          message="Heyy whats up?"
          timestamp="40 seconds ago"
          profilePic="https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
        />
        <Chat
          name="Juultje Tieleman"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://taddlr.com/wp-content/uploads/Screenshot-2020-06-25-at-11.47.45.png"
        />
        <Chat
          name="Mikky Kiemeney"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://www.paraeles.pt/wp-content/uploads/2019/03/mikkykiemeney_35338988_231560977655444_5072636146450694144_n.jpg"
        />
        <Chat
          name="Scarlett Johanson"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-179427791-1580485545.jpg?crop=1xw:0.6665776828617191xh;center,top&resize=480:*"
        />
        <Chat
          name="Àstrid Bergès-Frisbey"
          message="Heyy whats up?"
          timestamp="40 seconds ago"
          profilePic="https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
        />
        <Chat
          name="Juultje Tieleman"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://taddlr.com/wp-content/uploads/Screenshot-2020-06-25-at-11.47.45.png"
        />
        <Chat
          name="Mikky Kiemeney"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://www.paraeles.pt/wp-content/uploads/2019/03/mikkykiemeney_35338988_231560977655444_5072636146450694144_n.jpg"
        />
        <Chat
          name="Scarlett Johanson"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-179427791-1580485545.jpg?crop=1xw:0.6665776828617191xh;center,top&resize=480:*"
        />
        <Chat
          name="Àstrid Bergès-Frisbey"
          message="Heyy whats up?"
          timestamp="40 seconds ago"
          profilePic="https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
        />
        <Chat
          name="Juultje Tieleman"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://taddlr.com/wp-content/uploads/Screenshot-2020-06-25-at-11.47.45.png"
        />
        <Chat
          name="Mikky Kiemeney"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://www.paraeles.pt/wp-content/uploads/2019/03/mikkykiemeney_35338988_231560977655444_5072636146450694144_n.jpg"
        />
        <Chat
          name="Scarlett Johanson"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-179427791-1580485545.jpg?crop=1xw:0.6665776828617191xh;center,top&resize=480:*"
        />
        <Chat
          name="Àstrid Bergès-Frisbey"
          message="Heyy whats up?"
          timestamp="40 seconds ago"
          profilePic="https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
        />
        <Chat
          name="Juultje Tieleman"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://taddlr.com/wp-content/uploads/Screenshot-2020-06-25-at-11.47.45.png"
        />
        <Chat
          name="Mikky Kiemeney"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://www.paraeles.pt/wp-content/uploads/2019/03/mikkykiemeney_35338988_231560977655444_5072636146450694144_n.jpg"
        />
        <Chat
          name="Scarlett Johanson"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-179427791-1580485545.jpg?crop=1xw:0.6665776828617191xh;center,top&resize=480:*"
        />
        <Chat
          name="Àstrid Bergès-Frisbey"
          message="Heyy whats up?"
          timestamp="40 seconds ago"
          profilePic="https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
        />
        <Chat
          name="Juultje Tieleman"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://taddlr.com/wp-content/uploads/Screenshot-2020-06-25-at-11.47.45.png"
        />
        <Chat
          name="Mikky Kiemeney"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://www.paraeles.pt/wp-content/uploads/2019/03/mikkykiemeney_35338988_231560977655444_5072636146450694144_n.jpg"
        />
        <Chat
          name="Scarlett Johanson"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-179427791-1580485545.jpg?crop=1xw:0.6665776828617191xh;center,top&resize=480:*"
        />
        <Chat
          name="Àstrid Bergès-Frisbey"
          message="Heyy whats up?"
          timestamp="40 seconds ago"
          profilePic="https://i.mdel.net/i/db/2014/10/304436/304436-800w.jpg"
        />
        <Chat
          name="Juultje Tieleman"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://taddlr.com/wp-content/uploads/Screenshot-2020-06-25-at-11.47.45.png"
        />
        <Chat
          name="Mikky Kiemeney"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://www.paraeles.pt/wp-content/uploads/2019/03/mikkykiemeney_35338988_231560977655444_5072636146450694144_n.jpg"
        />
        <Chat
          name="Scarlett Johanson"
          message="Yo whats up?"
          timestamp="40 seconds ago"
          profilePic="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-179427791-1580485545.jpg?crop=1xw:0.6665776828617191xh;center,top&resize=480:*"
        />
      </div>

      </div>
  );
};

const mapStateToProps = state => {
  return {
    //usersToShow: state.matches.usersToShow,
    //loading: state.matches.loading,
    //userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchMatches: (userId) => dispatch( actions.fetchMatches(userId))
  };
};

export default connect( mapStateToProps, mapDispatchToProps )(Chats);