import RingObject from './RingObject';
import getArgNames from './util/function';

class CommandFactory {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(commandClass) {
    this.commandClass = commandClass;

    this.cacheArguments();
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  cacheArguments() {
    this.argNames = getArgNames(commandClass.prototype.execute);
  }

  build(commandThread) {
    return new this.commandClass(commandThread, this.argNames);
  }
}

export default CommandFactory;