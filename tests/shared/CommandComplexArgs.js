import Ring from '../../src/index';

class CommandComplexArgs extends Ring.Command {
  execute(ringEvent, target, controller, commandThread, testObject, a, b, c) {
    for (var i = 0; i < 8; i++) {
      if (arguments[i] === undefined) {
        throw new Error('CommandComplexArgs: invalid arguments');
      }
    }

    return true;
  }
}

export default CommandComplexArgs;