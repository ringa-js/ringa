import RingaHashArray from './RingaHashArray';

class CommandThread extends RingaHashArray {
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

  run(ringaEvent, doneHandler, failHandler) {
    if (this.running) {
      throw Error('CommandThread::run(): you cannot start a thread while it is already running!');
    }

    if (this.commandThreadFactory.all.length === 0) {
      throw Error('CommandThread::run(): attempting to run a thread with no commands!');
    }

    if (!ringaEvent) {
      throw Error('CommandThread::run(): cannot run a thread without a RingaEvent!');
    }

    this.ringaEvent = ringaEvent;
    this.doneHandler = doneHandler;
    this.failHandler = failHandler;

    this.buildCommands();

    // The current command we are running
    this.index = 0;

    this.executeNext();
  }

  executeNext() {
    let command = this.all[this.index];

    try {
      command._execute(this._commandDoneHandler.bind(this), this._commandFailHandler.bind(this));
    } catch (error) {
      this._commandFailHandler(error);
    }
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

  _commandFailHandler(error, kill) {
    this.error = error;

    this.failHandler(this, error, kill);

    if (!kill) {
      this._commandDoneHandler(error);
    }
  }
}

export default CommandThread;