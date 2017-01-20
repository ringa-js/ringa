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
    this.commandThreadFactory.all.forEach((commandFactory) => {
      let command = commandFactory.build(this);

      this.add(command);
    });
  }

  run(ringEvent, doneHandler, failHandler) {
    if (this.running) {
      throw Error('CommandThread::run(): you cannot start a thread while it is already running!');
    }

    if (this.commandThreadFactory.all.length === 0) {
      throw Error('CommandThread::run(): attempting to run a thread with no commands!');
    }

    if (!ringEvent) {
      throw Error('CommandThread::run(): cannot run a thread without a RingEvent!');
    }

    this.ringEvent = ringEvent;
    this.doneHandler = doneHandler;
    this.failHandler = failHandler;

    this.buildCommands();

    // The current command we are running
    this.index = 0;

    this.executeNext();
  }

  executeNext() {
    let command = this.all[this.index];

    command._execute(this._commandDoneHandler.bind(this), this._commandFailHandler.bind(this));
  }

  kill() {
    this.running = false;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  _commandDoneHandler(error) {
    this.index++;

    if (this.index < this.all.length) {
      setTimeout(this.executeNext.bind(this), 0);
    } else {
      this.doneHandler(this);
    }
  }

  _commandFailHandler(error) {
    this.error = error;

    this.failHandler(this, error);
  }
}

export default CommandThread;