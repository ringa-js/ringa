import ExecutorAbstract from '../ExecutorAbstract';
import ExecutorFactory from '../ExecutorFactory';
import {getArgNames} from '../util/function';
import {buildArgumentsFromRingaEvent} from '../util/executors';

class IntervalExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new IntervalExecutor.
   *
   * @param thread The parent thread that owns this command.
   * @param condition The interval keeps looping so long as this returns truthy
   * @param executor  The executor that runs on every loop
   * @param milliseconds The time between each loop
   * @param options Defaults are provided, so this is optional.
   * @param options.maxLoops Maximum number of loops before killing IntervalExecutor
   */
  constructor(thread, { condition, executor, milliseconds, options = {} }) {
    super(thread);

    this.condition = condition;
    this.executor = executor;
    this.executorFactory = this.wrapExecutor(executor);
    this.milliseconds = milliseconds;
    this.maxLoops = options.maxLoops || 100;
    this.loops = 0;
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

    let argNames = getArgNames(this.condition);
    this.args = buildArgumentsFromRingaEvent(this, argNames, this.ringaEvent);

    this._interval();
  }

  /**
   * Internal loop function.
   * Calls itself every (this.milliseconds) so long as the condition returns true and loops is less than maxLoops
   *
   * @private
   */
  _interval() {
    this.loops += 1;
    if (!this.condition.apply(this, this.args) || this.loops > this.maxLoops) {
      this.done();
    } else {
      this.resetTimeout();
      this.executorFactory.build(this.thread)._execute(this._intervalDone.bind(this), this._intervalFail.bind(this));
      setTimeout(this._interval.bind(this), this.milliseconds);
    }
  }

  resetTimeout() {
    // TODO: add more intelligent timeout management
    this.endTimeoutCheck();
    this.startTimeoutCheck();
  }

  _intervalDone() {
    // TODO: remove or add useful functionality (discuss)
  }

  _intervalFail(error, kill) {
    this.fail(error, kill);
  }


  wrapExecutor(executor) {
    if (!(executor instanceof ExecutorFactory)) {
      executor = new ExecutorFactory(executor);
    }

    return executor;
  }

  toString() {
    return this.id + ': ' + this.condition.toString().substring(0,64);
  }
}

export default IntervalExecutor;