import RingaObject from './RingaObject';
import {now} from './util/debug';

/**
 * Command is the base class for all command objects that are run in a Ringa application or module.
 */
class ExecutorAbstract extends RingaObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param thread The parent thread that owns this command.
   */
  constructor(thread) {
    super();

    if (__DEV__ && !thread.controller) {
      throw Error('ExecutorAbstract(): attempting to build a command connected to a Thread that has no attached controller.');
    }

    this.id = thread.controller.id + '_' + this.constructor.name;

    this.thread = thread;

    this.startTime = this.endTime = undefined;

    this.done = this.done.bind(this);
    this.fail = this.fail.bind(this);
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get ringaEvent() {
    return this.thread.ringaEvent;
  }

  get controller() {
    return this.thread.controller;
  }

  get timeout() {
    if (this._timeout === undefined && this.controller.options.timeout === undefined) {
      return -1;
    }

    return this._timeout !== undefined ? this.timeout : this.controller.options.timeout;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  startTimeoutCheck() {
    if (this.timeout !== -1) {
      this._timeoutToken = setTimeout(this._timeoutHandler.bind(this), this.timeout);
    }
  }

  endTimeoutCheck() {
    if (this._timeoutToken !== undefined) {
      clearTimeout(this._timeoutToken);
    }

    this._timeoutToken = undefined;
  }

  /**
   * Internal execution method called by Thread only. This must be overridden in a
   * subclass to provide the appropriate functionality.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */
  _execute(doneHandler, failHandler) {
    this.doneHandler = doneHandler;
    this.failHandler = failHandler;

    this.startTime = now();

    this.startTimeoutCheck();
  }

  /**
   * Call this method when the Command is ready to hand off control back to the parent Thread.
   */
  done() {
    if (__DEV__ && this.error) {
      throw new Error('ExecutorAbstract::done(): called done on a executor that has already errored!');
    }

    this.endTimeoutCheck();

    this.endTime = now();

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

    this.endTime = now();

    this.error = error;

    this.failHandler(error, kill);
  }

  /**
   * By default is this executors id.
   *
   * @returns {string|*}
   */
  toString() {
    return this.id;
  }

  _timeoutHandler() {
    let message;

    if (__DEV__) {
      message = 'ExecutorAbstract::_timeoutHandler(): the timeout for this command was exceeded ' + this.toString();
    }

    if (!__DEV__) {
      message = 'Ringa: command timeout exceeded ' + this.toString();
    }

    this.fail(new Error(message), this);
  }
}

export default ExecutorAbstract;