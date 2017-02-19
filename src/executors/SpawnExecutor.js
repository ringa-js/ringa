import ExecutorAbstract from '../ExecutorAbstract';
import ExecutorFactory from '../ExecutorFactory';
import {wrapIfNotInstance} from '../util/type';

class SpawnExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new SpawnExecutor, which will fire off the executor and call `this.done()` immediately
   *
   * @param thread The parent thread that owns this executor.
   * @param executor The executor to spawn
   */
  constructor(thread, executor) {
    super(thread);

    this.executor = executor;
    this.executorFactory = wrapIfNotInstance(executor, ExecutorFactory);
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

    this.executorFactory.build(this.thread)._execute(this._dummyDone, this._dummyFail);

    this.done();
  }

  _dummyDone() {
    
  }

  _dummyFail(error) {
    throw new Error('SpawnExecutor::_dummyFail(): Error caught from spawned executor', error);
  }
}

export default SpawnExecutor;