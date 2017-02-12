import ExecutorAbstract from '../ExecutorAbstract';
import ExecutorFactory from '../ExecutorFactory';
import {wrapIfNotInstance} from '../util/type';

class ParallelExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new ParallelExecutor
   *
   * @param thread The parent thread that owns this executor.
   * @param executorArray The executors to run in parallel
   */
  constructor(thread, executorArray) {
    super(thread);

    this.executorArray = executorArray;
    this.executorFactoryArray = executorArray.map((e) => wrapIfNotInstance(e, ExecutorFactory));
    this.awaitingExecutors = executorArray.length;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Internal execution method called by Thread only.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */
  _execute(doneHandler, failHandler) {
    super._execute(doneHandler, failHandler);
    this.executorFactoryArray.forEach((executorFactory) => {
      executorFactory.build(this.thread)._execute(this._parallelDone, this._parallelFail);
    });
  }

  _parallelDone() {
    this.awaitingExecutors -= 1;

    if (this.awaitingExecutors === 0) {
      this.done();
    }
  }

  _parallelFail(error) {
    this.fail(error);
  }
}

export default ParallelExecutor;