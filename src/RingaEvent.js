import RingaObject from './RingaObject';
import ErrorStackParser from 'error-stack-parser';
import {ringaEventToDebugString} from './util/debug';
import {isDOMNode} from './util/type';
import {getArgNames} from './util/function';
import {buildArgumentsFromRingaEvent} from './util/executors';

let eventIx = 0;

/**
 * RingaEvent is a generic event type for Ringa that, when dispatched on the DOM, wraps a CustomEvent:
 *
 *   let event = new RingaEvent('change', {
 *     property: 'index',
 *     newValue: 1
 *   });
 *
 *   event.dispatch(...add a bus or DOM node here...);
 *
 * If no bus is provided and document is defined, the event will be dispatched on the document object, but you can provide
 * a custom DOMNode or bus to dispatch from:
 *
 *   event.dispatch(myDiv);
 *
 * OR
 *
 *   let b = new Ringa.Bus();
 *   event.dispatch(b);
 *
 * All RingaEvents bubble and are cancelable by default but this can be customized.
 */
class RingaEvent extends RingaObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Build a RingaEvent that wraps a CustomEvent internally.
   *
   * @param type The event type.
   * @param detail Event details object. Note that properties on the RingaEvent in the details object are injected by name
   *               into any executors this triggers, making passing values super simple.
   * @param bubbles True if you want the event to bubble (default is true).
   * @param cancelable True if you want the event to be cancellable (default is true).
   */
  constructor(type, detail = {}, bubbles = true, cancelable = true) {
    // TODO add cancel support and unit tests!
    super(`RingaEvent[${type}, ${eventIx++}]`);

    this.detail = detail;
    detail.ringaEvent = this;

    this._type = type;
    this._bubbles = bubbles;
    this._cancelable = cancelable;

    this.dispatched = false;
    this.controller = undefined;

    this._errors = undefined;

    this.listeners = {};

    // Controllers that are currently handling the event
    this.catchers = [];
    // Controllers that are done handling the event
    this._catchers = [];
    // Was this event caught at all?
    this.__caught = false;

    this._threads = [];

    // We keep track of when an Event triggered a thread that timed out because if one event triggers another triggers
    // another and the deepest one times out, we don't really need to get a timeout for all the parent ones that are
    // waiting as well.
    this._threadTimedOut = false;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get type() {
    return this._type;
  }

  get bubbles() {
    return this._bubbles;
  }

  get cancelable() {
    return this._cancelable;
  }

  get target() {
    return this.customEvent ? this.customEvent.target : undefined;
  }

  get currentTarget() {
    return this.customEvent ? this.customEvent.currentTarget : undefined;
  }

  get errors() {
    return this._errors;
  }

  get caught() {
    return this.__caught;
  }

  /**
   * Returns an Array of every Controller that ran as a result of this event.
   * @private
   */
  get _controllers() {
    return this._catchers.concat(this.catchers);
  }

  /**
   * Returns an Array of every single executor that ran (or will ran) as a result of this event, in order of execution.
   * @private
   */
  get _executors() {
    this.threads.reduce((a, thread) => {
      a = a.concat()
    }, []);
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Dispatch the event on the provided bus.
   *
   * Note: this method is always delayed so you must not access its properties
   * until a frame later.
   *
   * @param bus
   */
  dispatch(bus = document) {
    setTimeout(this._dispatch.bind(this, bus), 0);

    return this;
  }

  /**
   * Internal dispatch function. This is called after a timeout of 0 milliseconds to clear the stack from
   * dispatch().
   *
   * @param bus The bus to dispatch on.
   * @private
   */
  _dispatch(bus) {
    if (__DEV__ && this.dispatched) {
      throw Error('RingaEvent::dispatch(): events should only be dispatched once!', this);
    }

    if (isDOMNode(bus)) {
      this.customEvent = new CustomEvent(this.type, {
        detail: this.detail,
        bubbles: this.bubbles,
        cancelable: this.cancelable
      });
    }

    this.dispatched = true;

    // TODO this should be in dispatch not _dispatch
    if (__DEV__) {
      setTimeout(() => {
        if (!this.caught) {
          console.warn('RingaEvent::dispatch(): the RingaEvent \'' + this.type + '\' was never caught! Did you dispatch on the proper DOM node?');
        }
      }, 0);

      this.dispatchStack = ErrorStackParser.parse(new Error());
      this.dispatchStack.shift(); // Remove a reference to RingaEvent.dispatch()

      if (this.dispatchStack[0].toString().search('Object.dispatch') !== -1) {
        this.dispatchStack.shift(); // Remove a reference to Object.dispatch()
      }
    } else {
      this.dispatchStack = 'To turn on stack traces, build Ringa in development mode. See documentation.';
    }

    bus.dispatchEvent(this.customEvent ? this.customEvent : this);
  }

  /**
   * Called by each Controller when the event is caught. Note that a single RingaEvent can be caught by 0 or more Controllers.
   *
   * @param controller The Ringa.Controller that is announcing it caught the event.
   * @private
   */
  _caught(controller) {
    this.__caught = true;
    this.catchers.push(controller);
  }

  /**
   * Called by a particular controller when the Thread(s) this event triggered in that controller have been completed.
   *
   * @param controller The Ringa.Controller that is announcing it is uncatching the event.
   * @private
   */
  _uncatch(controller) {
    let ix = this.catchers.indexOf(controller);
    this._catchers.push(this.catchers.splice(ix, 1)[0]);
  }

  /**
   * Completely kills the current Ringa thread, keeping any subsequent executors from running. To be called by user code like so:
   *
   *   let event = Ringa.dispatch('someEvent');
   *   ...
   *   event.fail();
   */
  fail(error) {
    // TODO this should have a kill property passed in, and when true should kill *every* associated thread this event triggered (DISCUSS)
    this.pushError(error);
  }

  /**
   * Internal fail to be called by a catching Ringa.Controller when an executor has failed for any reason.
   *
   * @param controller The Controller who is responsible for the Thread that just failed.
   * @param error Most likely an Error object but could be a string or anything a user manually passed.
   * @private
   */
  _fail(controller, error) {
    this._uncatch(controller);

    if (this.catchers.length === 0) {
      this._dispatchEvent(RingaEvent.FAIL, undefined, error);
    }
  }

  /**
   * Add an error to this event.
   *
   * @param error Any type of error (string, Error, etc.)
   */
  pushError(error) {
    // TODO we need to add tests for this.
    this._errors = this._errors || [];
    this.errors.push(error);
  }

  /**
   * Internal done called by a handling Ringa.Controller. Note that since multiple Controllers can handle a single
   * event we have to listen for when all the handling Controllers have been completed before announcing we are, indeed,
   * done.
   *
   * @param controller The Controller that is announcing it is done.
   * @private
   */
  _done(controller) {
    this._uncatch(controller);

    // TODO add unit tests for multiple handling controllers and make sure all possible combinations work (e.g. like
    // one controller fails and another succeeds.
    if (this.catchers.length === 0) {
      if (this.errors && this.errors.length) {
        this._dispatchEvent(RingaEvent.FAIL, undefined, error);
      } else {
        this._dispatchEvent(RingaEvent.DONE);
      }
    }
  }

  /**
   * Each RingaEvent is itself a dispatcher. This is the internal method that should be called to announce an event to
   * things that are listening to this event. Note this is not to be confused with dispatch() which dispatches this event
   * on a bus.
   *
   * @param type Event type.
   * @param detail Details.
   * @param error And error, if there is one.
   * @private
   */
  _dispatchEvent(type, detail, error) {
    let listeners = this.listeners[type];

    if (listeners) {
      listeners.forEach((listener) => {
        listener({
          type,
          detail,
          error
        });
      });
    }
  }

  /**
   * Add a listener for either RingaEvent.DONE or RingaEvent.FAIL for when the CommandThread that
   * was triggered by this event has completed.
   *
   * @param eventType
   * @param handler
   */
  addListener(eventType, handler) {
    if (__DEV__ && typeof eventType !== 'string') {
      throw Error('RingaEvent::addListener(): invalid eventType provided!' + eventType);
    }

    this.listeners[eventType] = this.listeners[eventType] || [];

    if (this.listeners[eventType].indexOf(handler) !== -1) {
      throw Error('RingaEvent::addListener(): the same function was added as a listener twice');
    }

    this.listeners[eventType].push(handler);

    return this;
  }

  /**
   * Listen for when every single Thread that is triggered by this event is done.
   *
   * @param handler A function callback.
   * @returns {*}
   */
  addDoneListener(handler) {
    // TODO add unit tests for multiple controllers handling a thread
    return this.addListener(RingaEvent.DONE, () => {
      let argNames = getArgNames(handler);
      let args = buildArgumentsFromRingaEvent(undefined, argNames, this);
      handler.apply(undefined, args);
    });
  }

  /**
   * Listen for when any thread triggered by this event has a failure.
   *
   * @param handler A function callback.
   *
   * @returns {*}
   */
  addFailListener(handler) {
    // TODO add unit tests for multiple controllers handling a thread
    return this.addListener(RingaEvent.FAIL, handler);
  }

  /**
   * Treat this event like a Promise, in that when it has completed all its triggered threads, it will call resolve or
   * when any thread has a failure, it will call reject.
   *
   * @param resolve A function to call when all triggered threads have completed.
   * @param reject A function to call when any triggered thread has a failure.
   */
  then(resolve, reject) {
    if (resolve) {
      this.addDoneListener(resolve);
    }

    if (reject) this.addFailListener(reject);
  }

  /**
   * Treat this event like a Promise. Catch is called when any triggered thread has a failure.
   *
   * @param reject A function to call when any triggered thread has a failure.
   */
  catch(reject) {
    this.addFailListener(reject);
  }

  /**
   * Outputs a pretty-printed outline of the entire state of all threads this event has triggered, every executor and its
   * current state (NOT STARTED, RUNNING, DONE, or FAILED).
   *
   * @returns {string} A string of all the data, pretty printed.
   */
  toDebugString() {
    return ringaEventToDebugString(this);
  }

  /**
   * Converts this event to a pretty string with basic information about the event.
   *
   * @returns {string}
   */
  toString() {
    return `RingaEvent [ '${this.type}' caught by ${this.controller ? this.controller.toString() : ''} ] `;
  }
}

RingaEvent.DONE = 'done';
RingaEvent.FAIL = 'fail';
RingaEvent.PREHOOK = 'prehook';

export default RingaEvent;