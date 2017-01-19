import Ring from '../../../index';

class CmdRC_GetUsers extends Ring.Command {
  execute(event, controller, filter) {
    // Do some stuff
    this.done();
  }
}

export default CmdRC_GetUsers;