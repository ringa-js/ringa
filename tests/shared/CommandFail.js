import Ringa from '../../src/index';

class CommandFail extends Ringa.Command {
  execute(error, kill) {
    this.fail(error, kill);
  }
}

export default CommandFail;