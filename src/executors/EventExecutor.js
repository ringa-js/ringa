import ExecutorAbstract from '../ExecutorAbstract';

/**
 * EventExecutor dispatches an event. There are two primary ways to do this in a executor tree:
 *
 *   controller.addListener('event', ['someEvent']); // 'someEvent' will be dispatched on the bus of controller without details
 *   controller.addListener('event', [event('someEvent', {prop: 'details'}, someOtherBus)]); // With details and a custom bus.
 */
class EventExecutor extends ExecutorAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new EventExecutor
   *
   * @param thread The parent thread that owns this command.
   * @param ringaEventFactory The event to dispatch and watch!
   */
  constructor(thread, ringaEventFactory) {
    super(thread);

    this.ringaEventFactory = ringaEventFactory;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Internal execution method called by CommandThread only.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */
  _execute(doneHandler, failHandler) {
    super._execute(doneHandler, failHandler);

    this.dispatchedRingaEvent = this.ringaEventFactory.build(this);

    this.dispatchedRingaEvent.then(this.dispatchedRingaEventDoneHandler.bind(this));
    this.dispatchedRingaEvent.catch(this.dispatchedRingaEventFailHandler.bind(this));

    // If this executor has custom injections, we need to pass those to the event.
    if (this._customInjections) {
      for (let key in this._customInjections) {
        this.dispatchedRingaEvent.detail[key] = this._customInjections[key];
      }
    }

    let bus = this.dispatchedRingaEvent.bus || this.controller.bus;

    this.ringaEvent.lastEvent = this.dispatchedRingaEvent;

    setTimeout(() => {
      this.dispatchedRingaEvent.dispatch(bus);

      if (this.dispatchedRingaEvent.requireCatch === undefined || this.dispatchedRingaEvent.requireCatch) {
        if (!this.dispatchedRingaEvent.caught) {
          this.fail(Error('EventExecutor::_execute(): event ' + this.dispatchedRingaEvent.type + ' was expected to be caught and it was not.'))
        }
      }
    }, 0);
  }

  toString() {
    return `${this.id}[dispatching '${this.ringaEventFactory.eventType}']`;
  }

  _timeoutHandler() {
    // Noop, we never timeout an EventExecutor because we leave that up to the controller that handles the next event.
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  dispatchedRingaEventDoneHandler() {
    // TODO write unit tests for this
    if (this.dispatchedRingaEvent.detail) {
      for (let key in this.dispatchedRingaEvent.detail) {
        if (this.ringaEvent.detail[key] === undefined) {
          this.ringaEvent.detail[key] = this.dispatchedRingaEvent.detail[key];
        }
      }
    }

    this.done();
  }

  dispatchedRingaEventFailHandler(error) {
    if (error.kill) {
      // Alright, this failure is a timeout on our dispatched event, so the other handling thread will have already dealt with it. Don't display
      // the error again.
      if (this.dispatchedRingaEvent._threadTimedOut) {
        // Lets clear our own timeout and just neither be done nor fail.
        return;
      }

      this.fail(error, this.controller.options.killOnErrorHandler(this.ringaEvent, error));
    }
  }
}

export default EventExecutor;