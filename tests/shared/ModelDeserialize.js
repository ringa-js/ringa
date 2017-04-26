import Model from '../../src/Model';

export default class ModelDeserialize extends Model {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name, values) {
    super(name, values);

    this.addProperty('children', []);
    this.addProperty('child');
    this.addProperty('prop1');
    this.addProperty('prop2');
    this.addProperty('prop3');
    this.addProperty('prop4');
  }
}