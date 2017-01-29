import Ringa from '../../src/index';

class CommandSimple extends Ringa.Command {
  execute(shouldFail) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) reject('someError');
        else resolve({someValue: 'someValue'});
      }, 10);
    });
  }
}

export default CommandSimple;