import RingaHashArray from './RingaHashArray';

class Thread extends RingaHashArray {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name, threadFactory, options) {
    super(name);

    this.options = options;
    this.threadFactory = threadFactory;

    this.running = false;

    // TODO: a executor thread can potentially spawn child executor threads
    this.children = [];
  }

  get controller() {
    return this.threadFactory.controller;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  buildExecutors() {
    this.threadFactory.all.forEach((executorFactory) => {
      let executor = executorFactory.build(this);

      this.add(executor);
    });
  }

  run(ringaEvent, doneHandler, failHandler) {
    if (__DEV__ && this.running) {
      throw Error('Thread::run(): you cannot start a thread while it is already running!');
    }

    if (__DEV__ && this.threadFactory.all.length === 0) {
      throw Error('Thread::run(): attempting to run a thread with no executors!');
    }

    if (__DEV__ && !ringaEvent) {
      throw Error('Thread::run(): cannot run a thread without a RingaEvent!');
    }

    this.ringaEvent = ringaEvent;
    this.doneHandler = doneHandler;
    this.failHandler = failHandler;

    this.buildExecutors();

    // The current executor we are running
    this.index = 0;

    this.executeNext();
  }

  executeNext() {
    let executor = this.all[this.index];

    try {
      executor._execute(this._executorDoneHandler.bind(this), this._executorFailHandler.bind(this));
    } catch (error) {
      this._executorFailHandler(error);
    }
  }

  kill() {
    this.running = false;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  _executorDoneHandler() {
    if (!this.all[this.index]) {
      console.error('Thread::_executorDoneHandler(): could not find executor to destroy it!');
    } else {
      this.all[this.index].destroy();
    }

    this.index++;

    if (this.ringaEvent.detail._promise) {
      delete this.ringaEvent.detail._promise;
    }

    if (this.index < this.all.length) {
      setTimeout(this.executeNext.bind(this), 0);
    } else {
      this.doneHandler(this);
    }
  }

  _executorFailHandler(error, kill) {
    if (!this.all[this.index]) {
      let e = (this.all && this.all.length) ? this.all.map(e => {
        return e.toString();
      }).join(', ') : `No executors found on thread ${this.toString()}`;

      console.error(`Thread::_executorFailHandler(): could not find executor to destroy it!\n\tIndex: ${this.index}\n\tExecutors: ${e}`);
    } else {
      this.all[this.index].destroy();
    }

    this.error = error;

    this.failHandler(this, error, kill);

    if (this.ringaEvent.detail._promise) {
      delete this.ringaEvent.detail._promise;
    }

    if (!kill) {
      this._executorDoneHandler();
    }
  }
}

export default Thread;