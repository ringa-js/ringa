export const ids = {
  map: {}
};

export default class RingaObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(id) {
    if (id) {
      this.id = id;
    } else {
      this._id = '[UNSET]';
    }
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  set id(value) {
    if (ids.map[value]) {
      console.warn(`Duplicate Ringa id discovered: '${value}'. Call RingaObject::destroy() to clear up the id.`);
    }

    ids.map[value] = true; // We do not create a reference to the object because this would create a memory leak.

    this._id = value;
  }

  get id() {
    return this._id;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  destroy() {
    delete ids[this.id];
  }

  toString(value) {
    return this.id + ' ' + (value || '' );
  }
};
