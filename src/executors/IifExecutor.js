import ExecutorAbstract from '../ExecutorAbstract';
import ExecutorFactory from '../ExecutorFactory';
import {getArgNames} from '../util/function';
import {buildArgumentsFromRingaEvent} from '../util/executors';
import {wrapIfNotInstance} from '../util/type';

class IifExecutor extends ExecutorAbstract {
  constructor(thread, { condition, trueExecutor, falseExecutor }) {
    super(thread);

    this.condition = condition;
    this.trueExecutor = trueExecutor;
    this.falseExecutor = falseExecutor;
  }

  _execute(doneHandler, failHandler) {
    super._execute(doneHandler, failHandler);
    
    let argNames = getArgNames(this.condition);
    let args = buildArgumentsFromRingaEvent(this, argNames, this.ringaEvent);
    let conditionResult = this.condition.apply(this, args);
    let executorFactory = wrapIfNotInstance(!!conditionResult ? this.trueExecutor : this.falseExecutor, ExecutorFactory);

    executorFactory.build(this.thread)._execute(this.done, this.fail);
  }

  toString() {
    return this.id + ': ' + this.condition.toString().substring(0,64);
  }
}

export default IifExecutor;