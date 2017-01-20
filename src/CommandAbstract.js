import RingObject from './RingObject';

/**
 * Command is the base class for all command objects that are run in a Ring application or module.
 */
class CommandAbstract extends RingObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param commandThread The parent thread that owns this command.
   */
  constructor(commandThread) {
    super();

    if (!commandThread.controller) {
      throw Error('Command(): attempting to build a command connected to a CommandThread that has no attached controller.');
    }

    this.id = commandThread.controller.id + '_' + this.constructor.name;

    this.commandThread = commandThread;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get ringEvent() {
    return this.commandThread.ringEvent;
  }

  get controller() {
    return this.commandThread.controller;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  startTimeoutCheck() {
    if (this.controller.options.timeout !== -1) {
      this._timeoutToken = setTimeout(this._timeoutHandler.bind(this), this.controller.options.timeout);
    }
  }

  endTimeoutCheck() {
    if (this._timeoutToken !== undefined) {
      clearTimeout(this._timeoutToken);
    }

    this._timeoutToken = undefined;
  }

  /**
   * Internal execution method called by CommandThread only. This must be overridden in a
   * subclass to provide the appropriate functionality.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */
  _execute(doneHandler, failHandler) {
    this.doneHandler = doneHandler;
    this.failHandler = failHandler;

    this.startTimeoutCheck();
  }

  /**
   * Call this method when the Command is ready to hand off control back to the parent CommandThread.
   */
  done() {
    this.endTimeoutCheck();

    this.doneHandler(true);
  }

  /**
   * Call this method if an error occurred during the processing of a command.
   *
   * @param error The error that has occurred.
   * @param kill True if you want the thread to die immediately.
   */
  fail(error, kill = false) {
    this.endTimeoutCheck();

    this.error = error;

    this.failHandler(error, kill);
  }

  /**
   * By default is this commands id.
   *
   * @returns {string|*}
   */
  toString() {
    return this.id;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  _timeoutHandler() {
    let message = 'CommandAbstract::_timeoutHandler(): the timeout for this command was exceeded ' + this.toString();

    console.error(message, this);

    this.fail(new Error(message), true);
  }
}

export default CommandAbstract;