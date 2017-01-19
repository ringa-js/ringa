class RingObject {
  constructor(id) {
    this.id = id;
  }

  toString(value) {
    return this.id + ' ' + (value || ' | RingObject::toString() is designed to be overridden by the subclass.');
  }
}

export default RingObject;