import Ringa from '../../../index';

class CmdRC_GetUsers extends Ringa.Command {
  execute(event, controller, filter) {
    // Do some stuff
    this.done();
  }
}

export default CmdRC_GetUsers;