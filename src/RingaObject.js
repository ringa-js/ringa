let ids = {};

export default class RingaObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(id) {
    if (ids[id]) {
      throw new Error(`Duplicate Ringa id discovered: '${id}'. Call RingaObject::destroy() to clear up the id.`);
    }

    this.id = id;

    ids[id] = true; // We do not create a reference to the object because this would create a memory leak.
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
