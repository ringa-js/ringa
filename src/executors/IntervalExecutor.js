import ExecutorAbstract from '../ExecutorAbstract';
import ExecutorFactory from '../ExecutorFactory';
import {getArgNames} from '../util/function';
import {buildArgumentsFromRingaEvent} from '../util/executors';

class IntervalExecutor extends ExecutorAbstract {
  constructor(thread, { condition, executor, milliseconds }) {
    super(thread);

    this.condition = condition;
    this.executor = executor;
    this.executorFactory = this.wrapExecutor(executor);
    this.milliseconds = milliseconds;
  }

  _execute(doneHandler, failHandler) {
    super._execute(doneHandler, failHandler);

    let argNames = getArgNames(this.condition);
    this.args = buildArgumentsFromRingaEvent(this, argNames, this.ringaEvent);

    this._interval();
  }

  _interval() {
    if (!this.condition.apply(this, this.args)) {
      this.done();
      return;
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