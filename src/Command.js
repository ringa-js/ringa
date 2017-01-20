import RingObject from './RingObject';

/**
 * Command is the base class for all command objects that are run in a Ring application or module.
 */
class Command extends RingObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param commandThread The parent thread that owns this command.
   * @param argNames For efficiency, the CommandFactory instrospects this Command's execute(...) arguments.
   */
  constructor(commandThread, argNames) {
    super();

    if (!commandThread.controller) {
      throw Error('Command(): attempting to build a command connected to a CommandThread that has no attached controller.');
    }

    this.id = commandThread.controller.id + '_' + this.constructor.name;

    this.commandThread = commandThread;
    this.argNames = argNames;
    this.finished = false;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get ringEvent() {
    return this.commandThread.ringEvent;
  }

  get controller() {
    return this.commandThread.controller;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * This method is called when the thread tells this Command to execute. It uses the data
   * gathered from introspecting the execute() method to determine a set of arguments to
   * call the execute method with. In a way, this uses introspection to map everything on ringEvent.detail
   * to arguments on the execute method.
   *
   * If our execute method is:
   *
   *    execute(user, filter) {...}
   *
   *  Then this.argNames === ['user', 'filter']
   *
   * We want to check ringEvent.detail['user'] and ringEvent.detail['filter']
   * and pass those through and error if one of them is missing.
   *
   * Note that there are other properties that can be requested in the arguments list of execute:
   *
   * controller: the Controller object that is handling this thread
   * commandThread: the CommandThread object that built this Command
   * ringEvent: the ringEvent itself (instead of one of its detail properties)
   * customEvent: the customEvent that is wrapped by the ringEvent that was used to bubble up the DOM
   * target: the target DOMNode that triggered the customEvent was dispatched on.
   *
   * @param ringEvent
   * @returns {Array}
   */
  buildArgumentsFromRingEvent(ringEvent) {
    let args = [];

    //
    this.argNames.forEach((argName) => {
      if (ringEvent.detail.hasOwnProperty(argName)) {
        args.push(ringEvent.detail[argName]);
      } else if (this.injections.hasOwnProperty(argName)) {
        args.push(this.injections[argName]);
      } else {
        throw Error(this.toString() +
          '::buildArgumentsFromRingEvent(): the property \'' +
          argName +
          '\' was not provided on the dispatched ringEvent.' +
          ' Dispatched from: ' +
          ringEvent.dispatchStack[0], ringEvent);
      }
    });

    return args;
  }

  /**
   * Internal execution method called by CommandThread only.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */
  _execute(doneHandler, failHandler) {
    this.doneHandler = doneHandler;
    this.failHandler = failHandler;

    this.injections = {
      controller: this.controller,
      commandThread: this.commandThread,
      ringEvent: this.ringEvent,
      customEvent: this.ringEvent.customEvent,
      target: this.ringEvent.target
    };

    let args = this.buildArgumentsFromRingEvent(this.commandThread.ringEvent);

    // If the command execute method returns true, we continue on the next immediate cycle.
    if (this.execute.apply(this, args)) {
      this.done();
    }
  }

  /**
   * Call this method when the Command is ready to hand off control back to the parent CommandThread.
   */
  done() {
    this.finished = true;

    this.doneHandler(true);
  }

  /**
   * Call this method if an error occurred during the processing of a command.
   *
   * @param error The error that has occurred.
   * @param kill True if you want the thread to die immediately.
   */
  fail(error, kill = false) {
    this.finished = true;
    this.error = error;

    this.failHandler(error, kill);
  }

  /**
   * Override this method to provide functionality to the command.
   *
   * @returns {boolean}
   */
  execute() {
    // To be overridden by subclass
    return false;
  }

  toString() {
    return '' + this.constructor.name;
  }
}

export default Command;