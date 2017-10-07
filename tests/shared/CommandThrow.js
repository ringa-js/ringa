import Ringa from '../../src/index';

export default class CommandThrow extends Ringa.Command {
  execute(error) {
    throw Error(error);
  }
}
