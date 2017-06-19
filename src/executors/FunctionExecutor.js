import ExecutorAbstract from '../ExecutorAbstract';
import {buildArgumentsFromRingaEvent} from '../util/executors';
import {getArgNames} from '../util/function';

/**
 * FunctionExecutor is a wrapper for a single function. As a general rule you will not use this directly.
 */
class FunctionExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param thread The parent thread that owns this command.
   * @param func The function that is run when the CommandThread calls _execute().
   */
  constructor(thread, func) {
    super(thread);

    this.func = func;
    this.expectedArguments = getArgNames(func);
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
    let promise;

    super._execute(doneHandler, failHandler);

    const args = buildArgumentsFromRingaEvent(this, this.expectedArguments, this.ringaEvent);

    // If the function requested that 'done' be passed, we assume it is an asynchronous
    // function and let the function determine when it will call done.
    const donePassedAsArg = this.expectedArguments.indexOf('done') !== -1;

    try {
      // Functions can return a promise and if they do, our Thread will wait for the promise to finish.
      promise = this.func.apply(undefined, args);
    } catch (error) {
      console.error(`Error in ${this.controller.name} for event '${this.ringaEvent.type}' in FunctionExecutor ${this.func.toString().substr(0, 512)}.\nError Below:`);
      this.fail(error, true);
      return;
    }

    // We call done if:
    // 1) A promise is not returned AND
    // 2) 'done' was not passed as an argument
    if (!promise && !donePassedAsArg) {
      this.done();
    }

    if (promise) {
      this.waitForPromise(promise);
    }

    return promise;
  }

  toString() {
    return this.id + ': ' + this.func.toString().substr(0, 128);
  }
}

export default FunctionExecutor;