import ExecutorAbstract from '../ExecutorAbstract';
import ExecutorFactory from '../ExecutorFactory';
import {getArgNames} from '../util/function';
import {buildArgumentsFromRingaEvent} from '../util/executors';

class IifExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new IifExecutor.
   *
   * @param thread The parent thread that owns this command.
   * @param condition The result of this function determines which executor to run
   * @param trueExecutor  The executor run if condition returns a truthy value
   * @param falseExecutor The executor run if condition returns a falsy value
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
   * Internal execution method called by CommandThread only.
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
    let executorFactory = this.wrapExecutor(!!conditionResult ? this.trueExecutor : this.falseExecutor);

    executorFactory.build(this.thread)._execute(this.done, this.fail);
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

export default IifExecutor;