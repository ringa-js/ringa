import ExecutorAbstract from '../ExecutorAbstract';
import {sleep} from '../util/function';

class SleepExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new SleepExecutor, which will wait `milliseconds` before calling `this.done()`
   *
   * @param thread The parent thread that owns this executor.
   * @param milliseconds The number of milliseconds to sleep
   */
  constructor(thread, milliseconds) {
    super(thread);

    this.milliseconds = milliseconds;
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

    sleep(this.milliseconds).then(this.done);
  }

  toString() {
    return this.id + ': Sleep for ' + this.milliseconds + 'milliseconds';
  }
}

export default SleepExecutor;