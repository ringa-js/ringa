class RingaObject {
  constructor(id) {
    this.id = id;
  }

  toString(value) {
    return this.id + ' ' + (value || ' | RingaObject::toString() is designed to be overridden by the subclass.');
  }
}

export default RingaObject;