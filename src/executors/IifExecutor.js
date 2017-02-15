import ExecutorAbstract from '../ExecutorAbstract';
import ExecutorFactory from '../ExecutorFactory';
import {getArgNames} from '../util/function';
import {buildArgumentsFromRingaEvent} from '../util/executors';
import {wrapIfNotInstance} from '../util/type';

class IifExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new IifExecutor.
   *
   * @param thread The parent thread that owns this executor.
   * @param condition A callback function whose return value can be truthy or falsey, determining whether to run the trueExecutor or the falseExecutor.
   * @param trueExecutor  The executor run if condition returns a truthy value
   * @param falseExecutor The executor run if condition returns a falsey value
   */
  constructor(thread, { condition, trueExecutor, falseExecutor }) {
    super(thread);

    this.condition = condition;
    this.trueExecutor = trueExecutor;
    this.falseExecutor = falseExecutor;
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