import ThreadFactory from './ThreadFactory';
import RingaObject from './RingaObject';
import HashArray from 'hasharray';
import RingaEvent from './RingaEvent';
import ModelWatcher from './ModelWatcher';
import {inspectorDispatch} from './debug/InspectorController';
import {ringaGlobalBus} from './Bus';
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
   * @param bus The native browser DOMNode element (not a React Node) to attach event listeners to OR a custom event bus.
   * @param options See documentation on Controller options. Defaults are provided, so this is optional.
   */
  constructor(name, bus, options) {
    super(name);

    // We want to error if bus is defined but is not actually a bus.
    // If Bus is an object, though, and options is undefined, this means
    // the user is probably doing this:
    // new Controller('id', {options: true});
    // And skipping providing a bus, and that is okay.
    if (bus && !(typeof bus.addEventListener === 'function')) {
      if (__DEV__ && options) {
        throw Error('Controller(): invalid bus or DOM node passed into constructor!');
      }

      options = bus;
    }

    this.bus = bus;
    this.modelWatcher = undefined;

    this.options = options || {};
    this.options.timeout = this.options.timeout || 5000;
    this.options.throwKillsThread = this.options.throwKillsThread === undefined ? true : this.options.throwKillsThread;
    this.options.consoleLogFails = this.options.consoleLogFails === undefined ? true : this.options.consoleLogFails;
    this.options.injections = this.options.injections || {};
    this.options.warnOnDetailOverwrite = this.options.warnOnDetailOverwrite === undefined ? false : this.options.warnOnDetailOverwrite;

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

  set bus(value) {
    // If someone tries to reset the same bus, just ignore it because it would be dumb to detach all the listeners
    // and reattach them.
    if (this._bus === value) {
      return;
    }

    // If we are switching busses, we need to remove the listeners from the old bus
    if (this._bus) {
      this.detachAllListeners();
    }

    this._bus = value;

    // If the developer has called to attach previous listeners we need to make sure all of those
    // get attached now to our new bus.
    if (this._bus) {
      this.attachAllListeners();

      // We want to wait here. The reason is that if someone dispatches an event in the busMounted section
      // we want to make sure that all other Controllers within the same context in the dom have also
      // had time to mount before secondary events might be dispatched.
      setTimeout(() => {
        this.busMounted(this.bus);
      }, 0);
    }
  }

  get bus() {
    return this._bus;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Special method that attaches a model to this Controller through a ModelWatcher.
   *
   * At the time this was built, it was only functional to support injection for the react-ringa project and dependency
   * injection.
   *
   * If no internal ModelWatcher exists, the Controller builds one and then adds the model to that watcher.
   *
   * This method also adds the model as an injection by the models id to be available to all executors.
   *
   * @param model An instance that must be an extension of the Ringa.Model class.
   * @parma injectionId A custom name to use for the injection id if you don't want to use the default one on the Model.
   */
  addModel(model, injectionId = undefined) {
    if (!this.modelWatcher) {
      this.modelWatcher = new ModelWatcher(this.id + '_ModelWatcher');
    }

    this.modelWatcher.addModel(model, injectionId);

    this.injections[injectionId || model.id] = model;
    this.injections[model.name] = model;
  }

  /**
   * Remove a model that was previously added.
   *
   * @param model The model to be removed.
   */
  removeModel(model) {
    this.modelWatcher.removeModel(model, injectionId);

    delete this.injections[injectionId || model.id];
  }

  /**
   * Called when there is safely an event bus to attach events to. This is where you could redispatch certain initialization
   * events.
   */
  busMounted(bus) {
    // To be overridden
  }

  /**
   * Takes in a series of event types and converts them to static properties on the parent class.
   *
   * For example:
   *
   *   controller = new MyController();
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
   * Returns the ThreadFactory associated with the provided eventType.
   *
   * @param eventType The event type - a String.
   * @returns {ThreadFactory} The ThreadFactory associated with the eventType.
   */
  getThreadFactoryFor(eventType) {
    return this.eventTypeToThreadFactory[eventType];
  }

  /**
   * Listens for the event type on the attached event bus (or DOM node) and runs the provided executor or async tree.
   *
   * See online documentation for more details.
   *
   * @param eventType The event type, expected to be a String.
   * @param executor A single executor (function, event type, Promise, Ringa Command) or an array of these.
   * @param useCapture True if you want to use capture to listen to the event.
   * @returns {*} The ThreadFactory instance that will be run when the event is received.
   */
  addListener(eventType, executor, useCapture) {
    let threadFactory;

    if (__DEV__ && arguments[2] && typeof arguments[2] !== 'boolean') {
      throw Error(`Controller::addListener(): you provided a third argument which was not a boolean for useCapture (was ${useCapture}). This does nothing and probably means you forgot to wrap your second executor in an array.`);
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
      throw Error('Controller.addListener(): the event \'' + eventType + '\' has already been added! Use getThreadFactoryFor() to make modifications.');
    }

    this.addEventTypeStatics([eventType]);

    threadFactory.controller = this;

    this.eventTypeToThreadFactory[eventType] = threadFactory;

    this._attachListenerToBus(eventType, useCapture);

    return threadFactory;
  }

  _attachListenerToBus(eventType, useCapture) {
    if (!this.bus) {
      return; // We will be attached once the bus comes in to the station.
    }

    if (typeof eventType === 'string') {
      this.bus.addEventListener(eventType, this._eventHandler, useCapture);
    } else {
      let _eventType = undefined;

      if (eventType.hasOwnProperty('toString')) {
        _eventType = eventType.toString();
      }

      if (_eventType) {
        this.bus.addEventListener(_eventType, this._eventHandler.bind(this));
      } else {
        throw Error('Controller::addListener(): provided eventType is invalid.', eventType);
      }
    }
  }

  removeAllListeners() {
    for (let eventType in this.eventTypeToThreadFactory) {
      this.removeListener(eventType);
    }
  }

  detachAllListeners() {
    if (this.bus) {
      for (let eventType in this.eventTypeToThreadFactory) {
        this.bus.removeEventListener(eventType, this._eventHandler);
      }
    }
  }

  attachAllListeners() {
    for (let eventType in this.eventTypeToThreadFactory) {
      this._attachListenerToBus(eventType);
    }
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

      this.bus.removeEventListener(eventType, this._eventHandler);

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
   * @returns {boolean} True if the bus says it has a listener for the provided event type.
   */
  isListening(eventType) {
    if (this.bus && this.bus.hasListener) {
      return this.bus.hasListener(eventType);
    } else if (this.bus) {
      // Kinda risky, but there is no built-in way on DOM node to see if an event has been attached
      // without working some magic by overriding addEventListener or using jQuery, which we shall
      // not do because we are not barbarians.
      return true;
    }

    return false;
  }

  /**
   * Returns true if addListener has been called for the provided eventType. Note this will return true even if the bus
   * is not set.
   *
   * @param eventType The event type
   * @returns {boolean} True if addListener has been called with the provided event.
   */
  hasListener(eventType) {
    return this.getThreadFactoryFor(eventType) !== undefined;
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

    ringaEvent._threads.push(thread);

    ringaEvent._dispatchEvent(RingaEvent.PREHOOK);

    if (__DEV__ && !this.__blockRingaEvents) {
      inspectorDispatch('ringaThreadStart', {
        thread
      });
    }

    // TODO PREHOOK should allow the handler to cancel running of the thread.
    thread.run(ringaEvent, this.threadDoneHandler.bind(this), this.threadFailHandler.bind(this));

    return thread;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  _eventHandler(event) {
    if (event instanceof RingaEvent) {
      return this.__eventHandler(event);
    }

    let ringaEvent;

    // This event might be a something like 'click' which does not have
    // an attached ringaEvent yet!
    if (!event.detail.ringaEvent){
      ringaEvent = new RingaEvent(event.type, typeof event.detail === 'object' ? event.detail : {}, event.bubbles, event.cancellable, event);

      if (typeof event.detail === 'object') {
        event.detail.ringaEvent = ringaEvent;
      }
    } else {
      ringaEvent = event.detail.ringaEvent;
    }

    return this.__eventHandler(ringaEvent);
  }

  __eventHandler(ringaEvent) {
    let threadFactory = this.eventTypeToThreadFactory[ringaEvent.type];

    ringaEvent._caught(this);

    if (__DEV__ && !threadFactory) {
      throw Error('Controller::__eventHandler(): caught an event but there is no associated ThreadFactory! Fatal error.');
    }

    let abort;
    try {
      abort = this.preInvokeHandler(ringaEvent);
    } catch (error) {
      // At this point we don't have a thread yet, so this is all kinds of whack.
      if (this.options.consoleLogFails) {
        console.error(error);
      }

      ringaEvent._fail(this, error, true);
      ringaEvent.destroy(true);
      return;
    }

    if (abort === true) {
      return;
    }

    let thread;

    try {
      thread = this.invoke(ringaEvent, threadFactory);

      this.postInvokeHandler(ringaEvent, thread);
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

  _threadFinalized(thread) {
    thread.destroy(true);

    this.threads.remove(thread);

    if (__DEV__ && !this.__blockRingaEvents) {
      inspectorDispatch('ringaThreadKill', {
        thread
      });
    }
  }

  threadDoneHandler(thread) {
    if (__DEV__ && !this.threads.has(thread.id)) {
      throw Error(`Controller::threadDoneHandler(): could not find thread with id ${thread.id}`);
    }

    this._threadFinalized(thread);

    this.notify(thread.ringaEvent);

    thread.ringaEvent._done(this)
    thread.ringaEvent.destroy(true);
  }

  threadFailHandler(thread, error, kill) {
    if (!this.options || this.options.consoleLogFails) {
      console.error(error, `In thread ${thread ? thread.toString() : ''}`);
    }

    thread.ringaEvent._fail(this, error, kill);

    if (kill) {
      thread.ringaEvent.destroy();

      if (this.threads.has(thread.id)) {
        this._threadFinalized(thread);
      } else if (__DEV__) {
        throw Error(`Controller:threadFailHandler(): the CommandThread with the id ${thread.id} was not found.`)
      }
    }
  }

  dispatch(eventType, details, requireCatch = true) {
    if (!this.bus) {
      throw new Error(`Controller::dispatch(): bus has not yet been set so you cannot dispatch ('${eventType}')! Wait for Controller::busMounted().`);
    }

    return new RingaEvent(eventType, details, true, true, undefined, requireCatch).dispatch(this.bus);
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