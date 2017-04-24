import RingaObject from './RingaObject';
import TrieSearch from 'trie-search';

/**
 * Serialize a Ringa Model object to a POJO by iterating over properties recursively on any
 * descendent Model instances.
 *
 * @param model
 * @param pojo
 * @returns {*|{}}
 * @private
 */
let _serialize = function (model, pojo) {
  pojo = pojo || {};

  model.properties.forEach(key => {
    let obj = model[key];

    if (obj instanceof Array) {
      let newArr = [];

      obj.forEach(item => {
        if (item instanceof Model) {
          newArr.push(item.serialize());
        } else {
          newArr.push(item);
        }
      });

      pojo[key] = newArr;
    } else if (obj instanceof Model) {
      pojo[key] = obj.serialize();
    } else {
      pojo[key] = model[key];
    }
  });

  return pojo;
};

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
  getPropertiesRecursively() {
    let properties = [];

    let _clone = (obj) => {
      if (obj instanceof Array) {
        return obj.map(_clone);
      } else if (obj instanceof Model) {
        return obj.clone();
      } else if (typeof obj === 'object' && obj.hasOwnProperty('clone')) {
        return obj.clone();
      } else if (typeof obj === 'object') {
        let newObj = {};
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            newObj[key] = _clone(obj[key]);
          }
        }
        return newObj;
      }

      return obj;
    };

    this.properties.forEach(propName => {
      let newObj;

      if (this[`_${propName}Options`].clone) {
        newObj = this[`_${propName}Options`].clone(this[propName]);
      } else {
        newObj = _clone(this[propName]);
      }

      newInstance[propName] = newObj;
    });

    return properties;
  }
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
   * Serialize this model object for each property
   */
  serialize() {
    let pojo = {};

    _serialize(this, pojo);

    return pojo;
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
  notify(signal, item, descriptor) {
    // Notify all view objects through all injectors
    this._modelWatchers.forEach(mi => {
      mi.notify(this, signal, item, descriptor);
    });

    this.watchers.forEach(handler => {
      handler(signal, item, descriptor);
    });

    // Continue up the parent tree, notifying as we go.
    if (this.parentModel) {
      this.parentModel.notify(`${this.name}.${signal}`, item, descriptor);
    }
  }

  /**
   * Watch this model for any notify signals.
   *
   * @param handler The function to call when a notify signal is sent.
   */
  watch(handler) {
    if (this.watchers.indexOf(handler) === -1) {
      this.watchers.push(handler);
    }
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

      let descriptor;

      if (this[`_${name}Options`].descriptor) {
        if (typeof this[`_${name}Options`].descriptor === 'function') {
          descriptor = this[`_${name}Options`].descriptor(value);
        }

        descriptor = this[`_${name}Options`].descriptor;
      }

      this.notify(name, this, descriptor);
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

    if (options.index) {
      this.indexProperties = this.indexProperties || [];
      this.indexProperties.push(name);
    }

    return this[`${name}`];
  }

  /**
   * Just like addProperty, except explicitly sets the index option to true.
   *
   * @param name The name of the property. By default, a "private" property with a prefixed underscore is created to hold the data.
   * @param defaultValue The default value of the property.
   * @param options See addProperty for details.
   */
  addIndexedProperty(name, defaultValue, options = {}) {
    options = Object.assign({}, {
      index: true
    }, options);

    return this.addProperty(name, defaultValue, options);
  }

  /**
   * Recursively performs a deep clone of this object and all items that were added with addProperty().
   */
  clone() {
    let newInstance = new (this.constructor)(this.name);

    let _clone = (obj) => {
      if (obj instanceof Array) {
        return obj.map(_clone);
      } else if (obj instanceof Model) {
        return obj.clone();
      } else if (typeof obj === 'object' && obj.hasOwnProperty('clone')) {
        return obj.clone();
      } else if (typeof obj === 'object') {
        let newObj = {};
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            newObj[key] = _clone(obj[key]);
          }
        }
        return newObj;
      }

      return obj;
    };

    this.properties.forEach(propName => {
      let newObj;

      if (this[`_${propName}Options`].clone) {
        newObj = this[`_${propName}Options`].clone(this[propName]);
      } else {
        newObj = _clone(this[propName]);
      }

      newInstance[propName] = newObj;
    });

    return newInstance;
  }

  /**
   * Uses a trie-search to (optionally recursively) index every property that has index set to true (or was added with addIndexedProperty)
   *
   * Returns the TrieSearch instance.
   */
  index(recurse = false, trieSearchOptions, trieSearch = undefined) {
    trieSearch = trieSearch || new TrieSearch(undefined, trieSearchOptions);

    let nonRecurseProperties = [];

    let _add = (prop, obj) => {
      if (obj instanceof Array) {
        if (recurse) {
          obj.map(_add);
        }
      } else if (obj instanceof Model) {
        if (recurse) {

          obj.index(recurse, trieSearchOptions, trieSearch);
        }
      } else if (typeof obj === 'object') {
        console.warn('Model()::index() does not support indexing raw Object types.');
      } else {
        nonRecurseProperties.push(prop);
      }
    };

    this.indexProperties.forEach(prop => _add(prop, this[prop]));

    if (nonRecurseProperties.length) {
      trieSearch.add(this, nonRecurseProperties);
    }

    return trieSearch;
  }
}

export default Model;