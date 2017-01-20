import Ring from '../../src/index';

class CommandSimple extends Ring.Command {
  execute(testObject) {
    testObject.executed = true;
    testObject.count = testObject.count ? testObject.count : 0;
    testObject.count++;

    return true;
  }
}

export default CommandSimple;