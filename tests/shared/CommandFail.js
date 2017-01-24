import Ring from '../../src/index';

class CommandFail extends Ring.Command {
  execute(error, kill) {
    this.fail(error, kill);
  }
}

export default CommandFail;