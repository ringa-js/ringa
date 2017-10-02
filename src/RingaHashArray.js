import HashArray from 'hasharray';
import RingaObject from './RingaObject';

/**
 * This is a proxy class for HashArray that extends RingaObject.
 */
class RingaHashArray extends RingaObject {
  constructor(name = '[name]', key = 'id', changeHandler = undefined, options = undefined) {
    super(name);

    this._hashArray = new HashArray(key, changeHandler, options);
  }

  get all() {
    return this._hashArray._list;
  }
  add() {
    return this._hashArray.add(...arguments);
  }
  addAll() {
    return this._hashArray.addAll(...arguments);
  }
  addMap(){
    return this._hashArray.addMap(...arguments);
  }
  addOne(){
    return this._hashArray.addOne(...arguments);
  }
  get() {
    return this._hashArray.get(...arguments);
  }
  getAll(){
    return this._hashArray.getAll(...arguments);
  }
  getAsArray(){
    return this._hashArray.getAsArray(...arguments);
  }
  sample(){
    return this._hashArray.sample(...arguments);
  }
  remove(){
    return this._hashArray.remove(...arguments);
  }
  removeByKey(){
    return this._hashArray.removeByKey(...arguments);
  }
  removeAll(){
    return this._hashArray.removeAll(...arguments);
  }
  intersection(){
    return this._hashArray.intersection(...arguments);
  }
  complement(){
    return this._hashArray.complement(...arguments);
  }
  has(){
    return this._hashArray.has(...arguments);
  }
  hasMultiple(){
    return this._hashArray.hasMultiple(...arguments);
  }
  collides(){
    return this._hashArray.collides(...arguments);
  }
  forEach(){
    return this._hashArray.forEach(...arguments);
  }
  forEachDeep(){
    return this._hashArray.forEachDeep(...arguments);
  }
  sum(){
    return this._hashArray.sum(...arguments);
  }
  average(){
    return this._hashArray.average(...arguments);
  }
  filter(){
    return this._hashArray.filter(...arguments);
  }
  objectAt(){
    return this._hashArray.objectAt(...arguments);
  }
  clone(){
    return this._hashArray.clone(...arguments);
  }
}

export default RingaHashArray;