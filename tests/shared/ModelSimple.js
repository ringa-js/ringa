import Model from '../../src/Model';

export default class ModelSimple extends Model {
  //-----------------------------------
  // prop1
  //-----------------------------------
  set prop1(value) {
    if (this._prop1 === value) {
      return;
    }

    this._prop1 = value;

    this.notify('prop1');
  }

  get prop1() {
    return this._prop1;
  }

  //-----------------------------------
  // prop2
  //-----------------------------------
  set prop2(value) {
    this._prop2 = value;

    this.notify('prop2');
  }

  get prop2() {
    return this._prop2;
  }

  //-----------------------------------
  // prop3
  //-----------------------------------
  set prop3(value) {
    this._prop3 = value;

    this.notify('prop3');
  }

  get prop3() {
    return this._prop3;
  }

  //-----------------------------------
  // prop4
  //-----------------------------------
  set prop4(value) {
    this._prop4 = value;

    this.notify('prop4');
  }

  get prop4() {
    return this._prop4;
  }

  //-----------------------------------
  // methods
  //-----------------------------------
  resetAll() {
    this.prop1 = 'prop1';
    this.prop2 = 'prop2';
    this.prop3 = 'prop3';
    this.prop4 = 'prop4';
  }
}