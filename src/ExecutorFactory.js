import ExecutorAbstract from './ExecutorAbstract';
import FunctionExecutor from './executors/FunctionExecutor';
import PromiseExecutor from './executors/PromiseExecutor';
import EventExecutor from './executors/EventExecutor';
import ParallelExecutor from './executors/ParallelExecutor';
import SleepExecutor from './executors/SleepExecutor';
import RingaEventFactory from './RingaEventFactory';
import {getArgNames} from './util/function';

class ExecutorFactory {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructs a ExecutorFactory.
   *
   * @param executee This can be a Class, a instance, a function... we determine what type of
   *   ExecutorAbstract to build based on what is passed in. This makes things extensible.
   */
  constructor(executee, executeeOptions) {
    if (!executee) {
      throw new Error('ExecutorFactory::build(): an internal error occurred and an executee was undefined!');
    }

    this.executee = executee;
    this.executeeOptions = executeeOptions;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------

  build(thread) {
    if (typeof this.executee === 'string') {
      let ringaEventFactory = new RingaEventFactory(this.executee);
      return new EventExecutor(thread, ringaEventFactory);
    } else if (typeof this.executee === 'number') {
      return new SleepExecutor(thread, this.executee);
    } else if (typeof this.executee.then === 'function') {
      return new PromiseExecutor(thread, this.executee);
    } else if (typeof this.executee === 'function') {
      if (this.executee.prototype instanceof ExecutorAbstract) {
        let instance = new this.executee(thread, this.executeeOptions);

        if (!this.cache && instance.cacheable) {
          this.cache = instance.cache;
        }
        
        instance.cache = this.cache;

        return instance;
      } else {
        return new FunctionExecutor(thread, this.executee);
      }
    } else if (this.executee instanceof Array) {
      // This might be a group of ExecutorAbstracts that should be run synchronously
      return new ParallelExecutor(thread, this.executee);
    } else if (typeof this.executee === 'object' && this.executee instanceof RingaEventFactory) {
      return new EventExecutor(thread, this.executee);
    }

    if (__DEV__) {
      throw Error('ExecutorFactory::build(): the type of executee you provided is not supported by Ringa: ' + typeof this.executee + ': ' + this.executee);
    }
  }
}

export default ExecutorFactory;