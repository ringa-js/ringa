import RingaHashArray from './RingaHashArray';
import {isPromise} from './util/type';

class Thread extends RingaHashArray {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(id, threadFactory, options) {
    super(id);

    this.options = options;
    this.threadFactory = threadFactory;

    this.running = false;

    // TODO: a command thread can potentially spawn child command threads
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

    // The current command we are running
    this.index = 0;

    this.executeNext();
  }

  executeNext() {
    let command = this.all[this.index];
    let promise;

    try {
      promise = command._execute(this._commandDoneHandler.bind(this), this._commandFailHandler.bind(this));

      if (promise) {
        if (isPromise(promise)) {
          this.ringaEvent.detail._promise = promise;

          promise.then((result) => {
            this.ringaEvent.lastPromiseResult = result;

            this._commandDoneHandler();
          });
          promise.catch((error) => {
            this.ringaEvent.lastPromiseError = error;

            this._commandFailHandler();
          });
        } else if (__DEV__) {
          throw Error(`Thread::executeNext(): command ${command.toString()} returned something that is not a promise, ${promise}`);
        }
      }
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

    delete this.ringaEvent.detail._promise;

    if (this.index < this.all.length) {
      setTimeout(this.executeNext.bind(this), 0);
    } else {
      this.doneHandler(this);
    }
  }

  _commandFailHandler(error, kill) {
    this.error = error;

    this.failHandler(this, error, kill);

    delete this.ringaEvent.detail._promise;

    if (!kill) {
      this._commandDoneHandler(error);
    }
  }
}

export default Thread;