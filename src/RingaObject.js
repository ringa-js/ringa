import camelCase from 'camelcase';
import HashArray from 'hasharray';

export const ids = {
  __hardReset: (debug) => {
    if (__DEV__ && debug) {
      console.log(`RINGA HARD RESET START (__hardReset(true)) DESTROYING:\n\t${Object.keys(ids.map._map).sort().join('\n\t')}`);
    }
    ids.map._list.concat().forEach(obj => {
      obj.destroy();
    });
    ids.counts = new WeakMap();
    ids.constructorNames = {};
    if (__DEV__ && debug) {
      console.log(`RINGA HARD FINISHED (${Object.keys(ids.map._map).length} objects still in tact):\n\t${Object.keys(ids.map._map).sort().join('\n\t')}`);
    }
  },
  map: new HashArray('id', undefined, {ignoreDuplicates: true}),
  counts: new WeakMap(),
  constructorNames: {}
};

export default class RingaObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name, id) {
    ids.counts[this.constructor] = ids.counts[this.constructor] || 1;

    if (id) {
      this.id = id;
    } else {
      this.id = this.constructor.name + ids.counts[this.constructor];
      ids.counts[this.constructor]++;
    }

    if (!name) {
      name = camelCase(this.constructor.name);
    }

    if (__DEV__) {
      ids.constructorNames[this.constructor.name] = this.constructor.name;
    }

    this._name = name;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  set id(value) {
    if (value === this._id) {
      return;
    }

    if (typeof value !== 'string') {
      throw new Error(`RingaObject::id: must be a string! Was ${JSON.stringify(value)}`);
    }

    if (ids.map.get(value)) {
      console.warn(`Duplicate Ringa id discovered: ${JSON.stringify(value)} of type '${this.constructor.name}'. Call RingaObject::destroy() to clear up the id.`);
    }

    if (ids.map.get(this._id)) {
      ids.map.remove(this);
    }

    this._id = value;

    ids.map.add(this);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  destroy(unsafeDestroy = false) {
    this.destroyed = true;

    if (unsafeDestroy) {
      /**
       * There is the possibility that destroy() was called on an object, the id is cleared, and then another
       * object takes that id in the interim. While this is highly unusual, it probably means developer error
       * of some sort (e.g. a developer calls destroy() and then continues to use an object and then calls destroy()
       * again).
       */
      let obj = ids.map.get(this.id);
      if (obj && obj === this) {
        ids.map.remove(this);
      }

      return this;
    }

    if (!ids.map.get(this.id)) {
      console.error(`RingaObject::destroy(): attempting to destroy a RingaObject that Ringa does not think exists: '${this.id}'! Perhaps destroy() is called twice?`);
      return this;
    }

    ids.map.remove(this);

    return this;
  }

  toString(value) {
    return this.name + '_' + (value || '');
  }
};
