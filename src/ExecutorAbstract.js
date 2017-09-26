import RingaObject from './RingaObject';
import {inspectorDispatch} from './debug/InspectorController';
import {now} from './util/debug';
import {isPromise} from './util/type';

export const executorCounts = {
  map: new Map()
};

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

    this.hasBeenRun = false;

    if (__DEV__ && !thread.controller) {
      throw Error('ExecutorAbstract(): attempting to build an executor connected to a Thread without a controller.');
    }

    let i = executorCounts.map[this.constructor] = (executorCounts.map[this.constructor] ? executorCounts.map[this.constructor] + 1 : 1);
    this.id = thread.controller.id + '_' + this.constructor.name + i;

    this.thread = thread;

    this.startTime = this.endTime = undefined;

    this.done = this.done.bind(this);
    this.fail = this.fail.bind(this);
    this.stop = this.stop.bind(this);
    this.resume = this.resume.bind(this);
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
    if (!this._timeout && !this.controller.options.timeout) {
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
    if (this.hasBeenRun) {
      throw new Error('ExecutorAbstract::_execute(): an executor has been run twice!');
    }

    if (__DEV__ && !this.controller.__blockRingaEvents) {
      inspectorDispatch('ringaExecutorStart', {
        executor: this
      });
    }

    this.hasBeenRun = true;

    this.doneHandler = doneHandler;
    this.failHandler = failHandler;

    this.startTime = now();

    this.startTimeoutCheck();
  }

  /**
   * Tells this executor to suspend its normal timeout operation and done/fail handler and wait for a promise instead.
   * @param promise
   */
  waitForPromise(promise) {
    if (isPromise(promise)) {
      this.ringaEvent.detail._promise = promise;

      promise.then(_result => {
        this.ringaEvent.lastPromiseResult = _result;

        this.done();
      });
      promise.catch(error => {
        this.ringaEvent.lastPromiseError = error;

        this.fail(error, false);
      });
    } else if (__DEV__) {
      throw Error(`ExecutorAbstract::waitForPromise(): command ${this.toString()} returned something that is not a promise, ${promise}`);
    }
  }

  /**
   * Call this method when the Command is ready to hand off control back to the parent Thread.
   */
  done() {
    if (__DEV__ && this.error) {
      console.error('ExecutorAbstract::done(): called done on a executor that has already failed! Original error:', this.error);
    }

    let _done = () => {
      this.endTimeoutCheck();

      this.endTime = now();

      this.doneHandler(true);
    };

    if (__DEV__ && this.controller.options.throttle) {
      this.doneThrottled(_done);
    } else {
      _done();
    }
  }

  doneThrottled(done) {
    let elapsed = new Date().getTime() - this.startTime;
    let { min, max } = this.controller.options.throttle;

    if (min && max && !isNaN(min) && !isNaN(max) && max > min) {
      let millis = (Math.random() * (max - min)) + min - elapsed;

      // Make sure in a state of extra zeal we don't throttle ourselves into a timeout
      if (millis < 5) {
        done();
      } else {
        setTimeout(done, millis);
      }
    } else {
      if (__DEV__ && min && max && !isNaN(min) && !isNaN(max)) {
        console.warn(`${this} invalid throttle settings! ${min} - ${max} ${typeof min} ${typeof max}`);
      }
      done();
    }
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
   * Stops the timeout check.
   */
  stop() {
    this.endTimeoutCheck();
  }

  /**
   * Resumes the timeout check.
   */
  resume() {
    this.startTimeoutCheck();
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
      message = `ExecutorAbstract::_timeoutHandler(): the timeout (${this.timeout} ms) for this executor was exceeded:\n\t${this.toString()}`;
    }

    if (!__DEV__) {
      message = `Ringa: executor timeout (${this.timeout} ms) exceeded:\n\t${this.toString()}`;
    }

    this.ringaEvent._threadTimedOut = true;

    this.error = new Error(message);

    this.failHandler(this.error, true);
  }

  /**
   * This method is used to destroy a child executor that is *not* attached to the original thread. For example,
   * the IifExecutor runs a child executor and manages its done and fail.
   *
   * @param childExecutor
   */
  killChildExecutor(childExecutor) {
    if (__DEV__ && !this.controller.__blockRingaEvents) {
      inspectorDispatch('ringaExecutorEnd', {
        executor: childExecutor
      });
    }
    childExecutor.destroy(true);
  }
}

export default ExecutorAbstract;