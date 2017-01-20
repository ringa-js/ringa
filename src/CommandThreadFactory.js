import RingHashArray from './RingHashArray';
import CommandThread from './CommandThread';
import CommandFactory from './CommandFactory';

class CommandThreadFactory extends RingHashArray {
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
  }

  build(ringEvent) {
    if (!this.controller) {
      console.log('CommandThreadFactory::build(): controller was not set before the build method was called.');
    }

    return new CommandThread(this.controller.id + '_CommandThread', this);
  }
}

export default CommandThreadFactory;