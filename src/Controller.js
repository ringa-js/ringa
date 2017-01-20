import CommandThreadFactory from './CommandThreadFactory';
import RingObject from './RingObject';
import HashArray from 'hasharray';

/**
 * Controller is the hub for events dispatched on the DOM invoking threads of commands.
 */
class Controller extends RingObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(id, domNode) {
    super(id);

    this.domNode = domNode;

    this.commandThreads = new HashArray('id');

    this.eventTypeToCommandThreadFactory = new Map();
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  addListener(eventType, commandThreadFactory) {
    if (!commandThreadFactory || !(commandThreadFactory instanceof CommandThreadFactory)) {
      throw Error('Controller::addListener(): commandThreadFactory not an instance of CommandThreadFactory');
    }

    if (commandThreadFactory.controller) {
      throw Error('Controller::addListener(): commandThreadFactory cannot have two parent controllers!');
    }

    commandThreadFactory.controller = this;

    this.eventTypeToCommandThreadFactory[eventType] = commandThreadFactory;

    if (typeof eventType === 'string') {
      this.domNode.addEventListener(eventType, this._eventHandler.bind(this));
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
  }

  removeListener(eventType) {
    let commandThreadFactory = this.eventTypeToCommandThreadFactory[eventType];

    if (commandThreadFactory) {
      delete this.eventTypeToCommandThreadFactory[eventType];

      this.domNode.removeEventListener(eventType, _eventHandler);

      return commandThreadFactory;
    }

    throw Error('Controller:removeListener(): could not find a listener for \'' + eventType + '\'', this);
  }

  invoke(ringEvent, commandThreadFactory) {
    let commandThread = commandThreadFactory.build(ringEvent);

    this.commandThreads.add(commandThread);

    commandThread.run(ringEvent, this.threadDoneHandler.bind(this), this.threadFailHandler.bind(this));

    return commandThread;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  _eventHandler(customEvent) {
    if (customEvent.detail.ringEvent.controller) {
      throw Error('Controller::_eventHandler(): event was received that has already been handled by another controller: ', customEvent);
    }

    customEvent.detail.ringEvent.controller = this;

    let commandThreadFactory = this.eventTypeToCommandThreadFactory[customEvent.type];

    if (!commandThreadFactory) {
      throw Error('Controller::_eventHandler(): caught an event but there is no associated CommandThreadFactory! Fatal error.');
    }

    let abort = this.preInvokeHandler(customEvent.ringEvent);

    if (abort) {
      return;
    }

    try {
      let commandThread = this.invoke(customEvent.detail.ringEvent, commandThreadFactory);

      this.postInvokeHandler(customEvent.detail.ringEvent, commandThread);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  preInvokeHandler(ringEvent) {
    // Can be extended by a subclass
    return false;
  }

  postInvokeHandler(ringEvent, commandThread) {
    // Can be extended by a subclass
    console.log('Post invoke should not happen here');
  }

  threadDoneHandler(commandThread) {
    this.commandThreads.remove(commandThread);

    commandThread.ringEvent._done();
  }

  threadFailHandler(commandThread, error) {
    this.commandThreads.remove(commandThread);

    commandThread.ringEvent._fail();
  }
}

export default Controller;