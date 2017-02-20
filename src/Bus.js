import RingaObject from './RingaObject';
import RingaEvent from './RingaEvent';

/**
 * Used to auto-generate non-conflicting Bus ids as the application runs.
 *
 * @type {{count: number}}
 */
export const busses = {
  count: 0
};

/**
 * Basic event bus implementation that works with Ringa.
 *
 * Due to the ability to structure Busses in a tree, this can handle bubbling and capture phases.
 *
 * Note: the methods of this Class are designed to match the spec for EventTarget in the DOM.
 */
class Bus extends RingaObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name, id) {
    super(name || ('bus' + busses.count++), id);

    this._map = {};
    this._captureMap = {};

    this.children = [];
    this.parent = undefined;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Adds a child to this Bus.
   *
   * @param bus The bus to add as a child.
   */
  addChild(bus) {
    if (bus.parent) {
      throw new Error(`Cannot add a Bus that has a child that already has a parent: '${bus.id}'`);
    }

    bus.parent = this;
    this.children.push(bus);
  }

  removeChild(bus) {
    let ix;
    if ((ix = this.children.indexOf(bus)) !== -1) {
      let child = this.children[ix];
      this.children.splice(ix, 1);
      child.parent = undefined;
    }
  }

  getChildAt(index) {
    return this.children[index];
  }

  /**
   * Adds an event listener handler for a particular event type.
   *
   * @param type The type of event
   * @param handler The handling function
   */
  addEventListener(type, handler, isCapture = false) {
    let map = isCapture ? this._captureMap : this._map;

    map[type] = map[type] || [];
    map[type].push(handler);
  }

  /**
   * Returns true if there is at least one handler for the provided type.
   *
   * @param type Event type.
   * @returns {*} True if the event type has an associated handler.
   */
  hasListener(type) {
    return !!this._map[type];
  }

  /**
   * Removes the specific handler associated with the provided event type.
   *
   * @param type Event type.
   * @param handler The handling function to remove.
   */
  removeEventListener(type, handler) {
    if (this._map[type]) {
      let ix = this._map[type].indexOf(handler);
      if (ix !== -1) {
        console.log('REMOVING HANDLER');
        this._map[type].splice(ix, 1);
      }
    }
  }

  /**
   * Dispatches an event on this bus.
   *
   * @param event A RingaEvent or similar.
   */
  dispatchEvent(event) {
    // Capture Phase
    if (this.parent) {
      let pStack = [this.parent];

      while (pStack[0].parent) {
        pStack.unshift(pStack[0].parent);
      }

      pStack.forEach(p => {
        p._dispatch(event ,true);
      });
    }

    // Local
    this._dispatch(event);

    // Bubble Phase
    let p = this.parent;

    while (p) {
      p._dispatch(event);
      p = p.parent;
    }
  }

  /**
   * Internal dispatch that handles propagating an event to this Bus's immediate listeners.
   *
   * @param event The event to dispatch
   * @private
   */
  _dispatch(event, capturePhase) {
    let map = capturePhase ? this._captureMap : this._map;

    if (map[event.type]) {
      map[event.type].forEach(handler => {
        handler(event);
      });
    }
  }

  dispatch(type, detail, requireCatch) {
    this._dispatch(new RingaEvent(type, detail, true, true, undefined, requireCatch));
  }
}

export let ringaGlobalBus = new Bus('GLOBALBUS', 'GLOBALBUS');

export default Bus;