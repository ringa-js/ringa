import Ringa from '../../src/index';

class CommandPromise extends Ringa.Command {
  execute(shouldFail) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) reject('CommandPromise:someError');
        else resolve({someValue: 'CommandPromise:someValue'});
      }, 10);
    });
  }
}

export default CommandPromise;