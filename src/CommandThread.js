import RingHashArray from './RingHashArray';

class CommandThread extends RingHashArray {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(id, commandThreadFactory, options) {
    super(id);

    this.options = options;
    this.commandThreadFactory = commandThreadFactory;

    this.running = false;

    // TODO: a command thread can potentially spawn child command threads
    this.children = [];
  }

  get controller() {
    return this.commandThreadFactory.controller;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  buildCommands() {
    this.commandThreadFactory.forEach((commandFactory) => {
      let command = commandFactory.build(this.ringEvent);

      this.add(command);
    });
  }

  run(ringEvent, completedHandler) {
    if (this.running) {
      throw Error('CommandThread::run(): you cannot start a thread while it is already running!');
    }

    this.ringEvent = ringEvent;
    this.completedHandler = completedHandler;

    buildCommands();

    // The current command we are running
    this.index = 0;

    this.executeNext();
  }

  executeNext() {
    let command = this._list(this.index);

    command._execute(this.ringEvent);
  }

  kill() {
    this.running = false;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  _commandDoneHandler(error) {
    this.index++;

    setTimeout(this.executeNext.bind(this), 0);
  }
}

export default CommandThread;