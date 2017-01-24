import Ringa from '../../src/index';

class CommandThrow extends Ringa.Command {
  execute(error) {
    throw Error(error);
  }
}

export default CommandThrow;