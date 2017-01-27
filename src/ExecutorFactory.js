import CommandAbstract from './ExecutorAbstract';
import FunctionExecutor from './executors/FunctionExecutor';
import PromiseExecutor from './executors/PromiseExecutor';
import EventExecutor from './executors/EventExecutor';
import ParallelExecutor from './executors/ParallelExecutor';
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
   *   CommandAbstract to build based on what is passed in. This makes things extensible.
   */
  constructor(executee) {
    this.executee = executee;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  cacheArguments(instance) {
    this.argNames = getArgNames(instance.execute);
  }

  build(thread) {
    if (typeof this.executee === 'string') {
      let ringaEventFactory = new RingaEventFactory(this.executee);
      return new EventExecutor(thread, ringaEventFactory);
    } else if (typeof this.executee.then === 'function') {
      return new PromiseExecutor(thread, this.executee);
    } else if (typeof this.executee === 'function') {
      if (this.executee.prototype instanceof CommandAbstract) {
        let instance = new this.executee(thread, this.argNames);

        if (!this.argNames) {
          this.cacheArguments(instance);
          instance.argNames = this.argNames;
        }

        return instance;
      } else {
        return new FunctionExecutor(thread, this.executee);
      }
    } else if (this.executee instanceof Array) {
      // This might be a group of CommandAbstracts that should be run synchronously
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