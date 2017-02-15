import RingaObject from './RingaObject';

class Model extends RingaObject {
  constructor(name, values) {
    if (typeof name !== 'string' && values === undefined) {
      values = name;
      name = undefined;
    }

    super(name, (values && values.id) ? values.id : undefined);

    this._values = values;
    this._modelInjectors = [];
    this.watchers = [];
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

    this.watchers.forEach(handler => {
      handler(propertyPath);
    });
  }

  watch(handler) {
    this.watchers.push(handler);
  }

  /**
   * Add a property to this model that by default does its own notifications to ModelWatcher and verifies that if the
   * value has not changed (strict reference compare A === B) then it won't notify and spam the ModelWatcher.
   *
   * If you want to do a custom shallow or deep compare on changes, you should provide your own custom setter.
   *
   * For reference, the default setter template is:
   *
   *  set ${name} (value) {
   *    if (this._${name} === value) {
   *      return;
   *    }
   *
   *    this._${name} = value;
   *
   *    this.notify('${name}');
   *  }
   *
   * @param name The name of the property. By default, a "private" property with a prefixed underscore is created to hold the data.
   * @param defaultValue The default value of the property.
   * @param options Options can be:
   *
   *   -get: a getter function
   *   -set: a setter function
   *
   *   Anything else will be saved as metadata to the value `_${name}Options`.
   */
  addProperty(name, defaultValue, options = {}) {
    this[`_${name}`] = defaultValue;

    let defaultGet = function() {
      return this[`_${name}`];
    }
    let defaultSet = function(value) {
      // TODO if value is itself a Model, I think we should watch it as well for changes. Any changes on it should
      // bubble up to this model and notify its watchers too.
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

    delete options.get;
    delete options.set;

    this[`_${name}Options`] = options;

    if (this._values && this._values[name]) {
      this[`_${name}`] = this._values[name];
    }
  }
}

export default Model;