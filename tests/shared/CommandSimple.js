import Ringa from '../../src/index';

class CommandSimple extends Ringa.Command {
  execute(testObject) {
    testObject.executed = true;
    testObject.count = testObject.count ? testObject.count : 0;
    testObject.count++;
  }
}

export default CommandSimple;