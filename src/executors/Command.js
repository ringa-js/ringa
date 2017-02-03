import ExecutorAbstract from '../ExecutorAbstract';
import {buildArgumentsFromRingaEvent} from '../util/executors';
import {getArgNames} from '../util/function';

/**
 * Command is the base class for all command objects that are run in a Ringa application or module.
 */
class Command extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param thread The parent thread that owns this command.
   */
  constructor(thread) {
    super(thread);

    this.cacheable = true;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get cache() {
    return this._cache || getArgNames(this.execute);
  }

  set cache(value) {
    this._cache = value;
    this.argNames = value;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------

  /**
   * Internal execution method called by CommandThread only.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */
  _execute(doneHandler, failHandler) {
    let ret;

    super._execute(doneHandler, failHandler);

    let args = buildArgumentsFromRingaEvent(this, this.argNames, this.thread.ringaEvent);

    const donePassedAsArg = this.argNames.indexOf('done') !== -1;

    ret = this.execute.apply(this, args);

    if (this.error) {
      return undefined;
    }

    // If the function returns true, we continue on the next immediate cycle assuming it didn't return a promise.
    // If, however the function requested that 'done' be passed, we assume it is an asynchronous
    // function and let the function determine when it will call done.
    if (!ret && !donePassedAsArg) {
      this.done();
    }

    return ret;
  }

  /**
   * Override this method to provide functionality to the command.
   *
   * @returns {boolean}
   */
  execute() {
    // To be overridden by subclass
    return false;
  }

  /**
   * Call this method if an error occurred during the processing of a command.
   *
   * @param error The error that has occurred.
   * @param kill True if you want the thread to die immediately.
   */
  fail(error, kill = false) {
    super.fail(error, kill);
  }
}

export default Command;