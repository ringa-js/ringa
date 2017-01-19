import Ring from '../../src/index';

class CommandSimple extends Ring.Command {
  execute(testObject) {
    testObject.executed = true;
    return true;
  }
}

export default CommandSimple;