import ExecutorAbstract from '../ExecutorAbstract';

class ParallelExecutor extends ExecutorAbstract {
  constructor(thread, executorArray) {
    super(thread);

    this.executorArray = executorArray;
  }

  _execute(doneHandler, failHandler) {
    super._execute(doneHandler, failHandler);
    // throw.Error('Parallels have not been implemented yet');
  }

  toString() {
    return this.id + ': ' + this.condition.toString().substring(0,64);
  }
}

export default ParallelExecutor;