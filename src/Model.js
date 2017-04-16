import RingaObject from './RingaObject';

/**
 * A Ringa Model provides functionality to watch lightweight event signals (just strings) and notify listeners when those events occur.
 * The event signals are designed by default to be correlated with properties changing, but technically could be used for anything.
 */
class Model extends RingaObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructs a new model.
   *
   * @param name The name of this model for injection.
   * @param values A POJO of default values to assign to the properties in this Model.
   */
  constructor(name, values) {
    if (typeof name !== 'string' && values === undefined) {
      values = name;
      name = undefined;
    }

    super(name, (values && values.id) ? values.id : undefined);

    this.properties = [];
    this._values = values;
    this._modelWatchers = [];
    this.watchers = [];
  }
  //-----------------------------------
  // Properties
  //-----------------------------------
  set parentModel(value) {
    this._parentModel = value;
  }

  get parentModel() {
     return this._parentModel;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Deserializes this object from a POJO only updating properties added with addProperty.
   *
   * @param values
   */
  deserialize(values) {
    this.properties.forEach(key => {
      this[key] = values[key];
    });
  }

  /**
   * Add a ModelWatcher as a parent watcher of this Model. Each Model can be watched by any number of ModelWatchers.
   *
   * @param modelWatcher The ModelWatcher to add.
   */
  addInjector(modelWatcher) {
    if (__DEV__ && this._modelWatchers.indexOf(modelWatcher) !== -1) {
      throw new Error(`Model::addInjector(): tried to add the same injector to a model twice! ${this.id}`)
    }

    this._modelWatchers.push(modelWatcher);
  }

  /**
   * Send a signal to all watchers.
   *
   * @param signal Generally a path to a property that has changed in the model.
   */
  notify(signal) {
    // Notify all view objects through all injectors
    this._modelWatchers.forEach(mi => {
      mi.notify(this, signal);
    });

    this.watchers.forEach(handler => {
      handler(signal);
    });

    // Continue up the parent tree, notifying as we go.
    if (this.parentModel) {
      this.parentModel.notify(`${this.name}.${signal}`);
    }
  }

  /**
   * Watch this model for any notify signals.
   *
   * @param handler The function to call when a notify signal is sent.
   */
  watch(handler) {
    this.watchers.push(handler);
  }

  /**
   * Unwatch from the specified handler
   *
   * @param handler
   */
  unwatch(handler) {
    let ix = this.watchers.indexOf(handler);

    if (ix !== -1) {
      this.watchers.splice(ix, 1);
    }
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
    let defaultGet = function() {
      return this[`_${name}`];
    }

    let defaultSet = function(value) {
      if (this[`_${name}`] === value) {
        return;
      }

      // Clear old parentModel if it was set
      if (this[`_${name}`] instanceof Model && this[`_${name}`].parentModel === this) {
        this[`_${name}`].parentModel = undefined;
      }

      if (value && value instanceof Model) {
        value.parentModel = this;
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
    } else {
      this[`${name}`] = defaultValue;
    }

    this.properties.push(name);
  }

  /**
   * Performs a shallow clone of this object and all items that were added with addProperty().
   */
  clone() {
    let newInstance = new (this.constructor)(this.name, this._values);

    this.properties.forEach(propName => {
      newInstance[propName] = this[propName];
    });
  }
}

export default Model;