import Ring from '../../src/index';

class CommandThrow extends Ring.Command {
  execute(error) {
    throw Error(error);
  }
}

export default CommandThrow;