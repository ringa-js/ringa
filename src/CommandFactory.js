import RingObject from './RingObject';
import {getArgNames} from './util/function';

class CommandFactory {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(commandClass) {
    this.commandClass = commandClass;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  cacheArguments(instance) {
    this.argNames = getArgNames(instance.execute);
  }

  build(commandThread) {
    let instance = new this.commandClass(commandThread, this.argNames);

    if (!this.argNames) {
      this.cacheArguments(instance);
      instance.argNames = this.argNames;
    }

    return instance;
  }
}

export default CommandFactory;