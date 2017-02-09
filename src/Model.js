import RingaObject from './RingaObject';

class Model extends RingaObject {
  constructor(name) {
    super(name);

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

  addProperty(name, defaultValue, options = {}) {
    this[`_${name}`] = defaultValue;

    let defaultGet = function() {
      return this[`_${name}`];
    }
    let defaultSet = function(value) {
      if (this[`_${name}`] === value) {
        return;
      }

      this[`_${name}`] = value;

      this.notify(name);
    }

    Object.defineProperty(this, name, {
      get: options.get || defaultGet,
      set: options.set || defaultSet
    });
  }
}

export default Model;