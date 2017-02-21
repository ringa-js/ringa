import ExecutorAbstract from '../ExecutorAbstract';

class PromiseExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new PromiseExecutor
   *
   * @param thread The parent thread that owns this executor.
   * @param promise The promise to execute
   */
  constructor(thread, promise) {
    super(thread);

    this.promise = promise;
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

    this.promise.then(this.done);
  }
}

export default PromiseExecutor;