import RingObject from './RingObject';
import ErrorStackParser from 'error-stack-parser';

let eventIx = 0;

/**
 * RingEvent wraps a CustomEvent that is dispatched on the DOM:
 *
 *   let event = new RingEvent('change', {
 *     property: 'index',
 *     newValue: 1
 *   });
 *
 *   event.dispatch();
 *
 * By default, the event will be dispatched on the document object, but you can provide a custom DOMNode to dispatch
 * from:
 *
 *   event.dispatch(myDiv);
 *
 * All RingEvents bubble and are cancelable by default.
 */
class RingEvent extends RingObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Build a RingEvent that wraps a CustomEvent internally.
   *
   * @param type
   * @param detail
   * @param bubbles
   * @param cancelable
   */
  constructor(type, detail, bubbles = true, cancelable = true) {
    super('event_' + type + '_' + eventIx++);

    detail = detail || {};
    detail.ringEvent = this;

    this.customEvent = new CustomEvent(type, {
      detail,
      bubbles,
      cancelable
    });

    this.dispatched = false;
    this.controller = undefined;

    this._errors = undefined;

    this.listeners = {};
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get type() {
    return this.customEvent.type;
  }

  get detail() {
    return this.customEvent.detail;
  }

  get bubbles() {
    return this.customEvent.bubbles;
  }

  get cancelable() {
    return this.customEvent.cancelable;
  }

  get target() {
    return this.customEvent.target;
  }

  get currentTarget() {
    return this.customEvent.currentTarget;
  }

  get errors() {
    return this._errors;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Dispatch the event on the provided domNode.
   *
   * @param domNode
   */
  dispatch(domNode = document) {
    if (this.dispatched) {
      throw Error('RingEvent::dispatch(): events should only be dispatched once!', this);
    }

    this.dispatched = true;

    if (window.__DEV__) {
      this.dispatchStack = ErrorStackParser.parse(new Error());
      this.dispatchStack.shift(); // Remove a reference to RingEvent.dispatch()
      if (this.dispatchStack[0].toString().search('Object.dispatch') !== -1) {
        this.dispatchStack.shift(); // Remove a reference to Object.dispatch()
      }
    } else {
      this.dispatchStack = 'To turn on stack traces, build ring in development mode. See documentation.';
    }

    domNode.dispatchEvent(this.customEvent);

    return this;
  }

  /**
   * Completely kills the current ring thread, keeping any subsequent commands from running.
   */
  fail(error) {
    this.killed = true;

    this.pushError(error);
  }

  pushError(error) {
    this._errors = this._errors || [];
    this.errors.push(error);
  }

  toString() {
    console.log('[' + this.type + ']', this.detail, this.target, this.stack);
  }

  dispatchEvent(event) {
    let listeners = this.listeners[event.type];

    if (listeners) {
      listeners.forEach((listener) => {
        listener(event);
      });
    }
  }

  /**
   * Add a listener for either RingEvent.DONE or RingEvent.FAIL for when the CommandThread that
   * was triggered by this event has completed.
   *
   * @param eventType
   * @param handler
   */
  addListener(eventType, handler) {
    this.listeners[eventType] = this.listeners[eventType] || [];
    this.listeners[eventType].push(handler);
  }
}

RingEvent.DONE = 'done';
RingEvent.FAIL = 'fail';

export default RingEvent;