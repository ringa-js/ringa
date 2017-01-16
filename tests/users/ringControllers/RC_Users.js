import Ring from '../../index.js';
import CmdRC_GetUsers from 'commands/CmdRC_GetUsers';

class RC_Users extends Ring.Controller {
  constructor() {
    super();
  }

  initialize() {
    super.initialize();

    let getUsers = new Ring.CommandGroup([
      CmdRC_GetUsers
    ]);
  }
}

export default RC_Users;