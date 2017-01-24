import CommandAbstract from '../CommandAbstract';

class CommandEventWrapper extends CommandAbstract {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new CommandEventWrapper
   *
   * @param commandThread The parent thread that owns this command.
   * @param ringaEventFactory The event to dispatch and watch!
   */
  constructor(commandThread, ringaEventFactory) {
    super(commandThread);

    this.finished = false;
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
      this.fail(Error('CommandEventWrapper::_execute(): event ' + this.dispatchedRingaEvent.type + ' was expected to be caught and it was not.'))
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
    return this.id + ': ' + this.ringaEventFactory.eventType;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  dispatchedRingaEventDoneHandler() {
    this.done();
  }

  dispatchedRingaEventFailHandler(error) {
    this.fail(error);
  }
}

export default CommandEventWrapper;