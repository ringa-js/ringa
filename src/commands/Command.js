import CommandAbstract from '../CommandAbstract';
import {buildArgumentsFromRingEvent} from '../util/command';

/**
 * Command is the base class for all command objects that are run in a Ring application or module.
 */
class Command extends CommandAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param commandThread The parent thread that owns this command.
   * @param argNames For efficiency, the CommandFactory instrospects this Command's execute(...) arguments.
   */
  constructor(commandThread, argNames) {
    super(commandThread);

    this.argNames = argNames;
    this.finished = false;
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

    try {
      let args = buildArgumentsFromRingEvent(this, this.argNames, this.commandThread.ringEvent);

      const donePassedAsArg = this.argNames.indexOf('done') !== -1;

      // If the function returns true, we continue on the next immediate cycle.
      // If, however the function requested that 'done' be passed, we assume it is an asynchronous
      // function and let the function determine when it will call done.
      if (this.execute.apply(this, args) && !donePassedAsArg) {
        this.done();
      }
    } catch (error) {
      failHandler(error);
    }
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
}

export default Command;