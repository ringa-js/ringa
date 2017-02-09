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
  get timeout() {
    if (this._timeout === undefined && this.controller.options.timeout === undefined) {
      return -1;
    }

    // If 'OrigEvent' triggers EventExecutor which dispatches 'Event' and they have the same timeout length, then 'OrigEvent'
    // will timeout first and 0 milliseconds later 'Event' will timeout. So we add a small timeout buffer to allow for the lag.
    let buffer = 50;

    return (this._timeout !== undefined ? this.timeout : this.controller.options.timeout) + 50;
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

    let domNode = this.dispatchedRingaEvent.domNode || this.ringaEvent.target;

    this.dispatchedRingaEvent.dispatch(domNode);

    if ((this.dispatchedRingaEvent.detail.requireCatch === undefined || this.dispatchedRingaEvent.detail.requireCatch) &&
        !this.dispatchedRingaEvent.caught) {
      this.fail(Error('EventExecutor::_execute(): event ' + this.dispatchedRingaEvent.type + ' was expected to be caught and it was not.'))
    }
  }

  toString() {
    return `${this.id}[dispatching '${this.ringaEventFactory.eventType}']`;
  }

  _timeoutHandler() {
    if (!this.dispatchedRingaEvent.caught) {
      this.fail(new Error(`EventExecutor::_timeoutHandler(): ${this.toString()} dispatched '${this.dispatchedRingaEvent.type}' but it was never caught by anyone!`), true);
    }
    // If 'Event1' triggers 'Event2' and 'Event2' times out, this will automatically force 'Event1' to timeout.
    // In that case, we do not want to timeout 'Event1' as well.
    else if (!this.dispatchedRingaEvent._threadTimedOut) {
      super._timeoutHandler();
    }
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  dispatchedRingaEventDoneHandler() {
    this.ringaEvent.detail.$lastEvent = this.dispatchedRingaEvent;

    this.done();
  }

  dispatchedRingaEventFailHandler(error) {
    // Alright, this failure is a timeout on our dispatched event, so the other handling thread will have already dealt with it. Don't display
    // the error again.
    if (this.dispatchedRingaEvent._threadTimedOut) {
      // Lets clear our own timeout and just neither be done nor fail.
      this.endTimeoutCheck();

      return;
    }

    this.fail(error);
  }
}

export default EventExecutor;