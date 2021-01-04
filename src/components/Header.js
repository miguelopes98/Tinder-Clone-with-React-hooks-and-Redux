import React from 'react';

import PersonIcon from '@material-ui/icons/Person';
import ForumIcon from '@material-ui/icons/Forum';

const Header = () => {
  return (
    <div className="header">
      <PersonIcon/>
      <ForumIcon/>
      <h2>Header component</h2>
    </div>
  );
};

export default Header;