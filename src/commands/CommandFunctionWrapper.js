import CommandAbstract from '../CommandAbstract';
import {buildArgumentsFromRingEvent} from '../util/command';
import {getArgNames} from '../util/function';

/**
 * CommandFunctionWrapper is a wrapper for a single function. As a general rule you will not use this directly.
 */
class CommandFunctionWrapper extends CommandAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param commandThread The parent thread that owns this command.
   * @param func The function that is run when the CommandThread calls _execute().
   */
  constructor(commandThread, func) {
    super(commandThread);

    this.func = func;
    this.finished = false;
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
    super._execute(doneHandler, failHandler);

    const args = buildArgumentsFromRingEvent(this, this.expectedArguments, this.ringEvent);

    const donePassedAsArg = this.expectedArguments.indexOf('done') !== -1;

    try {
      // If the function requested that 'done' be passed, we assume it is an asynchronous
      // function and let the function determine when it will call done.
      this.func.apply(undefined, args);

      if (!donePassedAsArg) {
        this.done();
      }
    } catch (error) {
      console.error(error);
      failHandler(error);
    }
  }

  /**
   * Call this method when the Command is ready to hand off control back to the parent CommandThread.
   */
  done() {
    this.finished = true;

    super.done();
  }

  /**
   * Call this method if an error occurred during the processing of a command.
   *
   * @param error The error that has occurred.
   * @param kill True if you want the thread to die immediately.
   */
  fail(error, kill = false) {
    this.finished = true;

    super.fail(error, kill);
  }

  toString() {
    return this.id + ': ' + this.func.toString().substr(0, 128);
  }
}

export default CommandFunctionWrapper;