import ExecutorAbstract from '../ExecutorAbstract';
import ExecutorFactory from '../ExecutorFactory';
import {getArgNames} from '../util/function';
import {buildArgumentsFromRingaEvent} from '../util/executors';
import {wrapIfNotInstance} from '../util/type';

class IntervalExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new IntervalExecutor, which recursively uses the setTimeout function to run an executor repeatedly.
   *
   * @param thread The parent thread that owns this executor.
   * @param condition Interval is halted when this callback returns falsey.
   * @param executor  The executor that runs on every interval
   * @param milliseconds The time between each interval
   * @param options Defaults are provided, so this is optional.
   * @param [options.maxLoops=-1] When maximum loops is exceeded, done() is called on the executor. -1 for no maximum.
   */
  constructor(thread, { condition, executor, milliseconds, options = {} }) {
    super(thread);

    this.condition = condition;
    this.executor = executor;
    this.executorFactory = wrapIfNotInstance(executor, ExecutorFactory);
    this.milliseconds = milliseconds;
    this.maxLoops = options.maxLoops || -1;
    this.loops = 0;
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

    let argNames = getArgNames(this.condition);
    this.args = buildArgumentsFromRingaEvent(this, argNames, this.ringaEvent);

    this._interval();
  }

  /**
   * Internal recursive loop method.  Runs executor every `milliseconds` provided
   * that the condition callback still evaluates truthy and `maxLoops` is not exceeded
   *
   * @private
   */
  _interval() {
    this.loops += 1;
    if (!this.condition.apply(this, this.args) || this._hasExceededMaxLoops()) {
      this.done();
    } else {
      this.resetTimeout();
      this.childExecutor = this.executorFactory.build(this.thread);
      this.childExecutor._execute(this._intervalDone.bind(this), this._intervalFail.bind(this))
      setTimeout(this._interval.bind(this), this.milliseconds);
    }
  }

  _hasExceededMaxLoops() {
    return (this.maxLoops > -1) && (this.loops > this.maxLoops);
  }

  resetTimeout() {
    // TODO: add more intelligent timeout management
    this.endTimeoutCheck();
    this.startTimeoutCheck();
  }

  _intervalDone() {
    this.killChildExecutor(this.childExecutor);
  }

  _intervalFail(error, kill) {
    this.killChildExecutor(this.childExecutor);
    this.fail(error, kill);
  }

  toString() {
    return this.id + ': ' + this.condition.toString().substring(0,64);
  }
}

export default IntervalExecutor;