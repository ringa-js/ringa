import RingObject from './RingObject';
import CommandAbstract from './CommandAbstract';
import CommandFunctionWrapper from './commands/CommandFunctionWrapper';
import CommandPromiseWrapper from './commands/CommandPromiseWrapper';
import CommandEventWrapper from './commands/CommandEventWrapper';
import CommandsParallelWrapper from './commands/CommandsParallelWrapper';
import {getArgNames} from './util/function';

class CommandFactory {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructs a CommandFactory.
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

  build(commandThread) {
    if (typeof this.executee === 'string') {
      return new CommandEventWrapper(commandThread, this.executee);
    } else if (typeof this.executee.then === 'function') {
      return new CommandPromiseWrapper(commandThread, this.executee);
    } else if (typeof this.executee === 'function') {
      if (this.executee.prototype instanceof CommandAbstract) {
        let instance = new this.executee(commandThread, this.argNames);

        if (!this.argNames) {
          this.cacheArguments(instance);
          instance.argNames = this.argNames;
        }

        return instance;
      } else {
        return new CommandFunctionWrapper(commandThread, this.executee);
      }
    } else if (this.executee instanceof Array) {
      // This might be a group of CommandAbstracts that should be run synchronously
      return new CommandsParallelWrapper(commandThread, this.executee);
    }

    throw Error('CommandFactory::build(): could not find way to build ' + this.executee);
  }
}

export default CommandFactory;