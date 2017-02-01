import RingaObject from './RingaObject';

class Model extends RingaObject {
  constructor(id) {
    super(id);

    this._modelInjectors = [];
  }

  addInjector(modelInjector) {
    if (__DEV__ && this._modelInjectors.indexOf(modelInjector) !== -1) {
      throw new Error(`Model::addInjector(): tried to add the same injector to a model twice! ${this.id}`)
    }

    this._modelInjectors.push(modelInjector);
  }

  notify(propertyPath) {
    // Notify all view objects through all injectors
    this._modelInjectors.forEach(mi => {
      mi.notify(this, propertyPath);
    });
  }
}

export default Model;