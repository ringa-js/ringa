import ExecutorAbstract from '../ExecutorAbstract';

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

    this.dispatchedRingaEvent.addDoneListener(this.dispatchedRingaEventDoneHandler.bind(this));
    this.dispatchedRingaEvent.addFailListener(this.dispatchedRingaEventFailHandler.bind(this));

    let domNode = this.dispatchedRingaEvent.domNode || this.ringaEvent.target;

    this.dispatchedRingaEvent.dispatch(domNode);

    if (this.dispatchedRingaEvent.detail.requireCatch && !this.dispatchedRingaEvent.caught) {
      this.fail(Error('EventExecutor::_execute(): event ' + this.dispatchedRingaEvent.type + ' was expected to be caught and it was not.'))
    }
  }

  toString() {
    return this.id + ': ' + this.ringaEventFactory.eventType;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  dispatchedRingaEventDoneHandler() {
    this.ringaEvent.detail.$lastEvent = this.dispatchedRingaEvent;

    this.done();
  }

  dispatchedRingaEventFailHandler(error) {
    this.fail(error);
  }
}

export default EventExecutor;