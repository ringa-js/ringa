import Ring from '../../index.js';
import CmdRC_GetUsers from 'commands/CmdRC_GetUsers';
import GET_USER from '../Events';

class RC_Users extends Ring.Controller {
  constructor(domNode) {
    super(domNode);

    this.addListener(GET_USER, new Ring.CommandThreadFactory([
      CmdRC_GetUsers
    ]));
  }
}

export default RC_Users;