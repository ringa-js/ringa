import RingaHashArray from './RingaHashArray';
import CommandThread from './CommandThread';
import CommandFactory from './CommandFactory';

class CommandThreadFactory extends RingaHashArray {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(id, commandFactories, options) {
    super(id || 'commandFactory');

    options = options || {};
    options.synchronous = options.synchronous === undefined ? false : options.synchronous;

    let addOne = this._hashArray.addOne;
    this._hashArray.addOne = function(obj) {
      if (!(obj instanceof CommandFactory)) {
        obj = new CommandFactory(obj);
      }

      addOne.call(this, obj);
    }

    if (commandFactories) {
      this.addAll(commandFactories);
    }

    this.threadId = 0;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  build(ringaEvent) {
    if (!this.controller) {
      console.log('CommandThreadFactory::build(): controller was not set before the build method was called.');
    }

    let commandThread = new CommandThread(this.id + '_Thread' + this.threadId, this);

    this.threadId++;

    return commandThread;
  }
}

export default CommandThreadFactory;