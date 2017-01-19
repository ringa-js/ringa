import RingHashArray from './RingHashArray';
import CommandThread from './CommandThread';

class CommandThreadFactory extends RingHashArray {
  constructor(id, commandFactories, options) {
    super(id || 'commandFactory');

    options = options || {};
    options.synchronous = options.synchronous === undefined ? false : options.synchronous;

    this.commandThreads = new HashArray('id');

    if (commandFactories) {
      this.commandThreads.addAll(commandFactories);
    }
  }

  build(ringEvent, runImmediately = true) {
    if (!this.controller) {
      console.log('CommandThreadFactory::build(): controller was not set before the build method was called.');
    }

    let commandThread = new CommandThread(this.controller.id + '_CommandThread', this);

    if (runImmediately) {
      commandThread.run();
    }

    return commandThread;
  }
}

export default CommandThreadFactory;