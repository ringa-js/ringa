import ExecutorAbstract from '../ExecutorAbstract';
import ExecutorFactory from '../ExecutorFactory';
import {getArgNames} from '../util/function';
import {buildArgumentsFromRingaEvent} from '../util/executors';
import {wrapIfNotInstance} from '../util/type';

class WhileExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new WhileExecutor, which runs `executor` while 'condition' returns true
   *
   * @param thread The parent thread that owns this executor.
   * @param condition While loop is halted when this callback returns falsey.
   * @param executor  The executor that runs on every loop
   * @param options Defaults are provided, so this is optional.
   * @param [options.maxLoops=-1] When maximum loops is exceeded, done() is called on the executor. -1 for no maximum.
   */
  constructor(thread, { condition, executor, options = {} }) {
    super(thread);

    this.condition = condition;
    this.executor = executor;
    this.executorFactory = wrapIfNotInstance(executor, ExecutorFactory);
    this.maxLoops = options.maxLoops || -1;
    this.loops = 0;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------

  /**
   * While execution method called by Thread only.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */
  _execute(doneHandler, failHandler) {
    super._execute(doneHandler, failHandler);

    let argNames = getArgNames(this.condition);
    this.args = buildArgumentsFromRingaEvent(this, argNames, this.ringaEvent);

    this._loop();
  }

  /**
   * Internal recursive loop method.  Runs executor every `milliseconds` provided
   * that the condition callback still evaluates truthy and `maxLoops` is not exceeded
   *
   * @private
   */
  _loop() {
    this.loops += 1;
    if (!this.condition.apply(this, this.args) || this._hasExceededMaxLoops()) {
      this.done();
    } else {
      this.resetTimeout();
      this.executorFactory.build(this.thread)._execute(this._done.bind(this), this._fail.bind(this));
      this._loop.bind(this)
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

  _done() {
    // TODO: remove or add useful functionality (discuss)
  }

  _fail(error, kill) {
    this.fail(error, kill);
  }

  toString() {
    return this.id + ': ' + this.condition.toString().substring(0,64);
  }
}

export default WhileExecutor;