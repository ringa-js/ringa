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
  constructor(type, detail = {}, bubbles = true, cancelable = true) {
    super('event_' + type + '_' + eventIx++);

    this.detail = detail;
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

    this.caught = false;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get type() {
    return this.customEvent.type;
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
   * Note: this method is always delayed so you must not access its properties
   * until a frame later.
   *
   * @param domNode
   */
  dispatch(domNode = document) {
    setTimeout(this._dispatch.bind(this, domNode));

    return this;
  }

  _dispatch(domNode) {
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

  _done() {
    this._dispatchEvent(RingEvent.DONE);
  }

  _fail(error) {
    this._dispatchEvent(RingEvent.FAIL, error);
  }

  _dispatchEvent(type, detail) {
    let listeners = this.listeners[type];

    if (listeners) {
      listeners.forEach((listener) => {
        listener({
          type,
          detail
        });
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
    if (typeof eventType !== 'string') {
      throw Error('RingEvent::addListener(): invalid eventType provided!' + eventType);
    }

    this.listeners[eventType] = this.listeners[eventType] || [];
    this.listeners[eventType].push(handler);
  }

  addDoneListener(handler) {
    this.addListener(RingEvent.DONE, handler);
  }

  addFailListener(handler) {
    this.addListener(RingEvent.FAIL, handler);
  }
}

RingEvent.DONE = 'done';
RingEvent.FAIL = 'fail';

RingEvent.PREHOOK = 'prehook';

export default RingEvent;