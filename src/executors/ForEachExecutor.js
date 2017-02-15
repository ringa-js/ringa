import ExecutorAbstract from '../ExecutorAbstract';
import ExecutorFactory from '../ExecutorFactory';
import {wrapIfNotInstance} from '../util/type';
import {getInjections} from '../util/executors';

class ForEachExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new ForEachExecutor.
   *
   * @param thread The parent thread that owns this executor.
   * @param arrayProperty The property (found via the available injections) to do a forEach on.
   * @param property The name property for each element in the loop to add to the event detail for the executor.
   * @param executor  The executor to run for each item.
   * @param sequential True if we should wait for each previous executor to run before running the next. Default is true.
   */
  constructor(thread, { arrayProperty, property, executor, sequential = true }) {
    super(thread);

    this.arrayProperty = arrayProperty;
    this.property = property;
    this.executor = executor;
    this.sequential = sequential;
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

    let executorFactory = wrapIfNotInstance(this.executor, ExecutorFactory);
    let injections = getInjections(this.ringaEvent, this);
    let array = injections[this.arrayProperty];

    if (!array) {
      throw new Error(`ForEachExecutor::_execute(): Could not find an array with the name ${this.arrayProperty}`);
    }

    this.executors = array.map((item, ix) => {
      let executor = executorFactory.build(this.thread);
      executor._injections = {};
      executor._injections[this.property] = item;
      return executor;
    });

    if (this.sequential) {
      let ix = 0;

      let _next = () => {
        if (ix === this.executors.length) {
          return this.done();
        }

        this.executors[ix]._execute(() => {
          setTimeout(_next, 0);
        }, (error, kill = false) => {
          this.fail(error, kill);

          if (!kill) {
            _next();
          }
        });

        ix++;
      };

      _next();
    } else {
      let count = this.executors.length;

      let _fin = () => {
        count--;
        if (count === 0) {
          this.done();
        }
      };

      let _fail = (error, kill = false) => {
        this.fail(error, kill);

        _fin();
      };

      this.executors.forEach(executor => {
        executor._execute(_fin, _fail);
      });
    }
  }
}

export default ForEachExecutor;