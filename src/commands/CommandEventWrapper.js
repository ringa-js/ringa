import CommandAbstract from '../CommandAbstract';

class CommandEventWrapper extends CommandAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new CommandEventWrapper
   *
   * @param commandThread The parent thread that owns this command.
   * @param ringEventFactory The event to dispatch and watch!
   */
  constructor(commandThread, ringEventFactory) {
    super(commandThread);

    this.finished = false;
    this.ringEventFactory = ringEventFactory;
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

    this.dispatchedRingEvent = this.ringEventFactory.build(this);

    this.dispatchedRingEvent.addDoneListener(this.dispatchedRingEventDoneHandler.bind(this));
    this.dispatchedRingEvent.addFailListener(this.dispatchedRingEventFailHandler.bind(this));

    let domNode = this.dispatchedRingEvent.domNode || this.ringEvent.target;

    this.dispatchedRingEvent.dispatch(domNode);

    if (this.dispatchedRingEvent.detail.requireCatch && !this.dispatchedRingEvent.caught) {
      this.fail(Error('CommandEventWrapper::_execute(): event ' + this.dispatchedRingEvent.type + ' was expected to be caught and it was not.'))
    }
  }

  /**
   * Call this method when the Command is ready to hand off control back to the parent CommandThread.
   */
  done() {
    this.finished = true;

    super.done();
  }

  /**
   * Call this method if an error occurred during the processing of a command.
   *
   * @param error The error that has occurred.
   * @param kill True if you want the thread to die immediately.
   */
  fail(error, kill = false) {
    this.finished = true;

    super.fail(error, kill);
  }

  toString() {
    return this.id + ': ' + this.ringEventFactory.eventType;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  dispatchedRingEventDoneHandler() {
    this.done();
  }

  dispatchedRingEventFailHandler(error) {
    this.fail(error);
  }
}

export default CommandEventWrapper;