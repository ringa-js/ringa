import ThreadFactory from './ThreadFactory';
import RingaObject from './RingaObject';
import HashArray from 'hasharray';
import RingaEvent from './RingaEvent';
import snakeCase from 'snake-case';
import {buildArgumentsFromRingaEvent} from './util/executors';
import {getArgNames} from './util/function';

/**
 * Controller is the hub that links event types through a bus (e.g. a DOM node) to an async executor tree.
 */
class Controller extends RingaObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructs a new controller.
   *
   * @param id The id of this controller, primarily used for internal hashes and debugging. Must be unique.
   * @param domNodeOrBus The native browser DOMNode element (not a React Node) to attach event listeners to OR a custom event bus.
   * @param options See documentation on Controller options. Defaults are provided, so this is optional.
   */
  constructor(id, domNodeOrBus, options) {
    super(id);

    if (!(typeof domNodeOrBus.addEventListener === 'function')) {
      if (__DEV__ && options) {
        throw Error('Controller(): invalid bus or DOM node passed into constructor!');
      }

      options = domNodeOrBus;
    }

    this.domNodeOrBus = domNodeOrBus;

    this.options = options || {};
    this.options.timeout = this.options.timeout || 5000;
    this.options.throwKillsThread = this.options.throwKillsThread === undefined ? true : this.options.throwKillsThread;
    this.options.consoleLogFails = this.options.consoleLogFails === undefined ? true : this.options.consoleLogFails;
    this.options.injections = this.options.injections || {};
    this.options.warnOnDetailOverwrite = this.options.warnOnDetailOverwrite === undefined ? true : this.options.warnOnDetailOverwrite;

    this.threads = new HashArray('id');

    this.eventTypeToThreadFactory = new Map();
    this.eventTypeToWatchers = new Map();
    this.watcherToArgNames = new Map();

    this._eventHandler = this._eventHandler.bind(this);
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get injections() {
    return this.options.injections;
  }

  set domNodeOrBus(value) {
    if (this._domNodeOrBus === value) {
      return;
    }

    this._domNodeOrBus = value;

    this.initialize();
  }

  get domNodeOrBus() {
    return this._domNodeOrBus;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Called when there is safely an event bus to attach events to.
   */
  initialize() {
    // To be overridden
  }

  /**
   * Takes in a series of event types and converts them to static properties on the parent class.
   *
   * For example:
   *
   *   controler = new MyController();
   *   controller.addEventTypeStatics(['my event', 'otherEvent', 'YAY']);
   *
   *   MyController.MY_EVENT === 'my event';
   *   MyController.OTHER_EVENT = 'otherEvent'
   *   MyController.YAY = 'YAY;
   *
   * @param types An array of event types.
   */
  addEventTypeStatics(types) {
    types.forEach(type => {
      let TYPE_SNAKE_CASE = snakeCase(type).toUpperCase();

      if (this.constructor[TYPE_SNAKE_CASE]) {
        return;
      }

      this.constructor[TYPE_SNAKE_CASE] = this[TYPE_SNAKE_CASE] = type;
    });
  }

  /**
   * Returns true if there is a listener for the provided eventType.
   *
   * @param eventType The event type - a String.
   * @returns {*} True if the event type has a listener.
   */
  getListener(eventType) {
    return this.eventTypeToThreadFactory[eventType];
  }

  /**
   * Listens for the event type on the attached event bus (or DOM node) and runs the provided executor or async tree.
   *
   * See online documentation for more details.
   *
   * @param eventType The event type, expected to be a String.
   * @param executor A single executor (function, event type, Promise, Ringa Command) or an array of these.
   * @returns {*} The ThreadFactory instance that will be run when the event is received.
   */
  addListener(eventType, executor) {
    let threadFactory;

    if (!this.domNodeOrBus) {
      throw new Error('Controller::addListener(): make sure you only call addListener after initialize() has been called.');
    }

    if (executor && !(executor instanceof ThreadFactory) && !(executor instanceof Array)) {
      executor = [executor];
    }

    if (!executor || executor instanceof Array) {
      threadFactory = new ThreadFactory(this.id + '_' + eventType + '_ThreadFactory', executor);
    } else if (executor instanceof ThreadFactory) {
      threadFactory = executor;
    } else if (__DEV__) {
      throw Error('Controller::addListener(): the provided executor is not valid! Did you forget to wrap in []?');
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

    this.addEventTypeStatics([eventType]);

    threadFactory.controller = this;

    this.eventTypeToThreadFactory[eventType] = threadFactory;

    if (typeof eventType === 'string') {
      this.domNodeOrBus.addEventListener(eventType, this._eventHandler);
    } else {
      let _eventType = undefined;

      if (eventType.hasOwnProperty('toString')) {
        _eventType = eventType.toString();
      }

      if (_eventType) {
        this.domNodeOrBus.addEventListener(_eventType, this._eventHandler.bind(this));
      } else {
        throw Error('Controller::addListener(): provided eventType is invalid.', eventType);
      }
    }

    return threadFactory;
  }

  /**
   * Safely removes an event listener for a particular event type.
   *
   * @param eventType The event type to remove.
   * @returns {*} The ThreadFactory that the event type used to trigger.
   */
  removeListener(eventType) {
    let threadFactory = this.eventTypeToThreadFactory[eventType];

    if (threadFactory) {
      delete this.eventTypeToThreadFactory[eventType];

      this.domNodeOrBus.removeEventListener(eventType, this._eventHandler);

      return threadFactory;
    }

    if (__DEV__) {
      throw Error('Controller:removeListener(): could not find a listener for \'' + eventType + '\'', this);
    }
  }

  /**
   * Returns true if the event bus (or DOM node) that this controller is attached to has a listener for the provided
   * event type.
   *
   * @param eventType The event type
   * @returns {boolean} True if the event listener exists
   */
  hasListener(eventType) {
    return this.getListener(eventType) !== undefined;
  }

  /**
   * Attaches a RingaEvent to a ThreadFactory and runs the ThreadFactory.
   *
   * @param ringaEvent A RingaEvent instance, properly initialized.
   * @param threadFactory A ThreadFactory instance, properly initialized.
   * @returns {*}
   */
  invoke(ringaEvent, threadFactory) {
    let thread = threadFactory.build(ringaEvent);

    this.threads.add(thread);

    ringaEvent.thread = thread;
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

    this.notify(thread.ringaEvent);

    thread.ringaEvent._done();
  }

  threadFailHandler(thread, error, kill) {
    if (this.options.consoleLogFails) {
      console.error(error, thread.toString());
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
    return new RingaEvent(eventType, details).dispatch(this.domNodeOrBus);
  }

  toString() {
    return this.id;
  }

  notify(ringaEvent, eventType) {
    eventType = eventType || ringaEvent.type;

    let watchers = this.eventTypeToWatchers[eventType];
    if (watchers && watchers.length) {
      let executor = {
        controller: this,
        toString: () => {
          return 'Controller::watch() for ' + eventType;
        }
      };

      watchers.forEach(watcher => {
        let argNames = this.watcherToArgNames[watcher];
        let args = buildArgumentsFromRingaEvent(executor, argNames, ringaEvent);

        watcher.apply(undefined, args);
      });
    }
  }

  watch(eventTypes, injectableCallback) {
    if (__DEV__ && !(eventTypes instanceof Array)) {
      throw new Error('Controller::watch(): eventTypes is not an Array!');
    }

    eventTypes.forEach(eventType => {
      this.eventTypeToWatchers[eventType] = this.eventTypeToWatchers[eventType] || [];
      this.eventTypeToWatchers[eventType].push(injectableCallback);
      this.watcherToArgNames[injectableCallback] = getArgNames(injectableCallback);
    });
  }

  unwatch(eventTypes, injectableCallback) {
    if (__DEV__ && !(eventTypes instanceof Array)) {
      throw new Error('Controller::watch(): eventTypes is not an Array!');
    }

    let ix;

    eventTypes.forEach(eventType => {
      if ((ix = this.eventTypeToWatchers[eventType].indexOf(injectableCallback)) !== -1) {
        this.eventTypeToWatchers[eventType].splice(ix, 1);
      }
    });
  }
}

export default Controller;