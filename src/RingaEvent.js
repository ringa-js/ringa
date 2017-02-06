import RingaObject from './RingaObject';
import ErrorStackParser from 'error-stack-parser';
import {ringaEventToDebugString} from './util/debug';
import {isDOMNode} from './util/type';

let eventIx = 0;

/**
 * RingaEvent is a generic event type for Ringa that, when dispatched on the DOM, wraps a CustomEvent:
 *
 *   let event = new RingaEvent('change', {
 *     property: 'index',
 *     newValue: 1
 *   });
 *
 *   event.dispatch();
 *
 * If no bus is provided and document is defined, the event will be dispatched on the document object, but you can provide
 * a custom DOMNode or bus to dispatch from:
 *
 *   event.dispatch(myDiv);
 *
 *   let b = new Ringa.Bus();
 *   event.dispatch(b);
 *
 * All RingaEvents bubble and are cancelable by default.
 */
class RingaEvent extends RingaObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Build a RingaEvent that wraps a CustomEvent internally.
   *
   * @param type
   * @param detail
   * @param bubbles
   * @param cancelable
   */
  constructor(type, detail = {}, bubbles = true, cancelable = true) {
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

    this.caught = false;
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
   * Completely kills the current Ringa thread, keeping any subsequent executors from running.
   */
  fail(error) {
    this.pushError(error);
  }

  pushError(error) {
    this._errors = this._errors || [];
    this.errors.push(error);
  }

  toString() {
    return 'whatever';
    //return `RingaEvent [ '${this.type}' caught by ${this.controller ? this.controller.toString() : ''} ] `;
  }

  _done() {
    this._dispatchEvent(RingaEvent.DONE);
  }

  _fail(error) {
    this._dispatchEvent(RingaEvent.FAIL, undefined, error);
  }

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

  addDoneListener(handler) {
    return this.addListener(RingaEvent.DONE, handler);
  }

  addFailListener(handler) {
    return this.addListener(RingaEvent.FAIL, handler);
  }

  then(resolve, reject) {
    if (resolve) {
      if (!reject) {
        this.addFailListener(resolve.bind(undefined, undefined));
      }

      this.addDoneListener(resolve);
    }
    if (reject) this.addFailListener(reject);
  }

  catch(reject) {
    this.addFailListener(reject);
  }

  toDebugString() {
    return ringaEventToDebugString(this);
  }
}

RingaEvent.DONE = 'done';
RingaEvent.FAIL = 'fail';
RingaEvent.PREHOOK = 'prehook';

export default RingaEvent;