import RingaHashArray from './RingaHashArray';
import Thread from './Thread';
import ExecutorFactory from './ExecutorFactory';

class ThreadFactory extends RingaHashArray {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name, executorFactories, options) {
    super(name || 'commandFactory');

    options = options || {};
    options.synchronous = options.synchronous === undefined ? false : options.synchronous;

    let addOne = this._hashArray.addOne;
    this._hashArray.addOne = function(obj) {
      if (!obj) {
        console.error(`ThreadFactory():: Attempting to add an empty executee! This probably happened because you attempt to add an event (e.g. SomeController.MY_EVENT) before SomeController::addListener('myEvent') was called.`, executorFactories);
      }

      if (!(obj instanceof ExecutorFactory)) {
        obj = new ExecutorFactory(obj);
      }

      addOne.call(this, obj);
    }

    if (executorFactories) {
      this.addAll(executorFactories);
    }

    this.threadId = 0;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  build(ringaEvent) {
    if (__DEV__ && !this.controller) {
      throw Error('ThreadFactory::build(): controller was not set before the build method was called.');
    }

    let commandThread = new Thread(this.id + '_Thread' + this.threadId, this);

    this.threadId++;

    return commandThread;
  }
}

export default ThreadFactory;