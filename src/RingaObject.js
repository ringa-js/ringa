import camelCase from 'camelcase';
import HashArray from 'hasharray';

export const ids = {
  __hardReset: () => {
    ids.map._list.concat().forEach(obj => {
      obj.destroy();
    });
    ids.counts = new WeakMap();
    ids.constructorNames = {};
  },
  map: new HashArray('id'),
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
    }

    ids.counts[this.constructor]++;

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
      console.warn(`Duplicate Ringa id discovered: ${JSON.stringify(value)} for '${this.constructor.name}'. Call RingaObject::destroy() to clear up the id.`);
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
    if (unsafeDestroy) {
      if (ids.map.get(this.id)) {
        ids.map.remove(this);
      }

      return;
    }

    if (!ids.map.get(this.id)) {
      console.error(`${Object.keys(ids.map._map)}`);
      throw new Error(`RingaObject::destroy(): attempting to destroy an item that has not been added to Ringa ('${this.id}')! Perhaps destroy is called twice?`);
    }

    ids.map.remove(this);

    return this;
  }

  toString(value) {
    return this.name + '_' + (value || '');
  }
};
