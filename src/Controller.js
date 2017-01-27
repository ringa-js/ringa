import ThreadFactory from './ThreadFactory';
import RingaObject from './RingaObject';
import HashArray from 'hasharray';
import RingaEvent from './RingaEvent';
import snakeCase from 'snake-case';

/**
 * Controller is the hub for events dispatched on the DOM invoking threads of executors.
 */
class Controller extends RingaObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructs a new controller.
   *
   * @param id The id of this controller, primarily used for internal hashes and debugging. Must be unique.
   * @param domNode The native browser DOMNode element (not a React Node) to attach event listeners to.
   * @param options See documentation on Controller options. Defaults are provided, so this is optional.
   */
  constructor(id, domNode, options) {
    super(id);

    if (__DEV__ && !domNode) {
      throw Error('Controller:constructor(): no DOMNode provided to constructor!');
    }

    this.domNode = domNode;

    this.options = options || {};
    this.options.timeout = this.options.timeout || 5000;
    this.options.throwKillsThread = this.options.throwKillsThread === undefined ? true : this.options.throwKillsThread;
    this.options.consoleLogFails = this.options.consoleLogFails === undefined ? true : this.options.consoleLogFails;
    this.options.injections = this.options.injections || {};
    this.options.warnOnDetailOverwrite = this.options.warnOnDetailOverwrite === undefined ? true : this.options.warnOnDetailOverwrite;

    this.threads = new HashArray('id');

    this.eventTypeToThreadFactory = new Map();

    this._eventHandler = this._eventHandler.bind(this);
  }
  //-----------------------------------
  // Properties
  //-----------------------------------
  get injections() {
    return this.options.injections;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  addEventTypes(types) {
    types.forEach(type => {
      let TYPE_SNAKE_CASE = snakeCase(type).toUpperCase();

      if (this.constructor[TYPE_SNAKE_CASE]) {
        return;
      }

      this.constructor[TYPE_SNAKE_CASE] = this[TYPE_SNAKE_CASE] = type;
    });
  }

  getListener(eventType) {
    return this.eventTypeToThreadFactory[eventType];
  }

  addListener(eventType, threadFactoryOrArray) {
    let threadFactory;

    if (!threadFactoryOrArray || threadFactoryOrArray instanceof Array) {
      threadFactory = new ThreadFactory(this.id + '_' + eventType + '_ThreadFactory', threadFactoryOrArray);
    } else if (typeof threadFactoryOrArray.build === 'function') {
      threadFactory = threadFactoryOrArray;
    } else if (__DEV__) {
      throw Error('Controller::addListener(): the provided threadFactoryOrArray is not valid! Did you forget to wrap in []?');
    }

    if (__DEV__ && !threadFactory || !(threadFactory instanceof ThreadFactory)) {
      throw Error('Controller::addListener(): threadFactory not an instance of ThreadFactory');
    }

    if (__DEV__ && threadFactory.controller) {
      throw Error('Controller::addListener(): threadFactory cannot have two parent controllers!');
    }

    if (__DEV__ && this.eventTypeToThreadFactory[eventType]) {
      throw Error('Controller.addListener(): the event \'' + eventType + '\' has already been added! Use getListener() to make modifications.');
    }

    this.addEventTypes([eventType]);

    threadFactory.controller = this;

    this.eventTypeToThreadFactory[eventType] = threadFactory;

    if (typeof eventType === 'string') {
      this.domNode.addEventListener(eventType, this._eventHandler);
    } else {
      let _eventType = undefined;

      if (eventType.hasOwnProperty('toString')) {
        _eventType = eventType.toString();
      }

      if (_eventType) {
        this.domNode.addEventListener(_eventType, this._eventHandler.bind(this));
      } else {
        throw Error('Controller::addListener(): provided eventType is invalid.', eventType);
      }
    }

    return threadFactory;
  }

  removeListener(eventType) {
    let threadFactory = this.eventTypeToThreadFactory[eventType];

    if (threadFactory) {
      delete this.eventTypeToThreadFactory[eventType];

      this.domNode.removeEventListener(eventType, this._eventHandler);

      return threadFactory;
    }

    if (__DEV__) {
      throw Error('Controller:removeListener(): could not find a listener for \'' + eventType + '\'', this);
    }
  }

  hasListener(eventType) {
    return this.getListener(eventType) !== undefined;
  }

  invoke(ringaEvent, threadFactory) {
    let thread = threadFactory.build(ringaEvent);

    this.threads.add(thread);

    ringaEvent._dispatchEvent(RingaEvent.PREHOOK);

    // TODO PREHOOK should allow the handler to cancel running of the thread.
    thread.run(ringaEvent, this.threadDoneHandler.bind(this), this.threadFailHandler.bind(this));

    return thread;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  _eventHandler(customEvent) {
    // This event might be a something like 'click' which does not have
    // an attached ringaEvent yet!
    customEvent.detail.ringaEvent = customEvent.detail.ringaEvent || new RingaEvent(customEvent.type, customEvent.detail, customEvent.bubbles, customEvent.cancellable);

    // TODO, how do we handle two controllers handling the same event?
    if (customEvent.detail.ringaEvent.controller) {
      throw Error('Controller::_eventHandler(): event was received that has already been handled by another controller: ' + customEvent);
    }

    customEvent.detail.ringaEvent.controller = this;

    let threadFactory = this.eventTypeToThreadFactory[customEvent.type];

    if (__DEV__ && !threadFactory) {
      throw Error('Controller::_eventHandler(): caught an event but there is no associated ThreadFactory! Fatal error.');
    }

    customEvent.detail.ringaEvent.caught = true;

    let abort;
    try {
      abort = this.preInvokeHandler(customEvent.detail.ringaEvent);
    } catch (error) {
      // At this point we don't have a thread yet, so this is all kinds of whack.
      if (this.options.consoleLogFails) {
        console.error(error);
      }

      customEvent.detail.ringaEvent._fail(error);
    }

    if (abort === true) {
      return;
    }

    try {
      let thread = this.invoke(customEvent.detail.ringaEvent, threadFactory);

      this.postInvokeHandler(customEvent.detail.ringaEvent, thread);
    } catch (error) {
      console.error(error);
      this.threadFailHandler(thread, error);
    }
  }

  preInvokeHandler(ringaEvent) {
    // Can be extended by a subclass
    return false;
  }

  postInvokeHandler(ringaEvent, thread) {
    // Can be extended by a subclass
  }

  threadDoneHandler(thread) {
    if (__DEV__ && !this.threads.has(thread.id)) {
      throw Error(`Controller::threadDoneHandler(): could not find thread with id ${thread.id}`);
    }

    this.threads.remove(thread);

    thread.ringaEvent._done();
  }

  threadFailHandler(thread, error, kill) {
    if (this.options.consoleLogFails) {
      console.error(error);
    }

    if (kill) {
      if (this.threads.has(thread.id)) {
        this.threads.remove(thread);
      } else if (__DEV__) {
        throw Error(`Controller:threadFailHandler(): the CommandThread with the id ${thread.id} was not found.`)
      }
    }

    thread.ringaEvent._fail(error);
  }

  dispatch(eventType, details) {
    return new RingaEvent(eventType, details).dispatch(this.domNode);
  }

  toString() {
    return this.id;
  }
}

export default Controller;