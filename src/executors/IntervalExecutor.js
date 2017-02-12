import ExecutorAbstract from '../ExecutorAbstract';
import ExecutorFactory from '../ExecutorFactory';
import {getArgNames} from '../util/function';
import {buildArgumentsFromRingaEvent} from '../util/executors';
import {wrapIfNotInstance} from '../util/type';

class IntervalExecutor extends ExecutorAbstract {
  constructor(thread, { condition, executor, milliseconds, options = {} }) {
    super(thread);

    this.condition = condition;
    this.executor = executor;
    this.executorFactory = wrapIfNotInstance(executor, ExecutorFactory);
    this.milliseconds = milliseconds;
    this.maxLoops = options.maxLoops || 100;
    this.loops = 0;
  }

  _execute(doneHandler, failHandler) {
    super._execute(doneHandler, failHandler);

    let argNames = getArgNames(this.condition);
    this.args = buildArgumentsFromRingaEvent(this, argNames, this.ringaEvent);

    this._interval();
  }

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

  toString() {
    return this.id + ': ' + this.condition.toString().substring(0,64);
  }
}

export default IntervalExecutor;