class RingaObject {
  constructor(id) {
    this.id = id;
  }

  toString(value) {
    return this.id + ' ' + (value || ' | RingaObject::toString() is to be overridden.');
  }
}

export default RingaObject;