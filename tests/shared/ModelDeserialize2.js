import Model from '../../src/Model';

export default class ModelDeserialize2 extends Model {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name, values) {
    super(name, values);

    this.addProperty('children', []);
  }
}