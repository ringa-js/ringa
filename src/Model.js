import RingaObject from './RingaObject';
import TrieSearch from 'trie-search';

window.$ModelNotifications = {
  watchers: 0,
  modelWatchers: 0
};

window.$ModelNameToConstructorMap = {};

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
        newArr.push(item instanceof Model ? item.serialize() : item);
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
    this.propertyOptions = {};
    this._values = values;
    this._modelWatchers = [];
    this.watchers = [];
    this.childIdToRef = {};
    this.$version = undefined; // Used when something is deserialized

    window.$ModelNameToConstructorMap[this.constructor.name] = this.constructor;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get idPath() {
    return this.parentModel ? `${this.parentModel.idPath}.${this.id}` : this.id;
  }

  set serializeId(value) {
    this.id = value;
  }

  get serializeId() {
    return this._id;
  }

  set serializeName(value) {
    this.name = value;
  }

  get serializeName() {
    return this._name;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Serialize this model object for each property
   */
  serialize() {
    let pojo = {
      $Model: this.constructor.name,
      $version: this.constructor.version,
      $name: this.serializeName,
      $id: this.serializeId
    };

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
  notify(signal, signaler, value, descriptor) {
    // If item isn't specified someone might just be triggering a signal themselves manually. So
    // we try to figure out what the property is ourselves.
    if (!signaler) {
      value = this[signal];
      descriptor = descriptor || (this.propertyOptions[signal] ? this.propertyOptions[signal].descriptor : undefined);
      signaler = this;
    }

    // Notify all view objects through all injectors
    this._modelWatchers.forEach(mi => {
      mi.notify(this, signal, signaler, value, descriptor);
      window.$ModelNotifications.modelWatchers++;
    });

    this.watchers.forEach(handler => {
      handler(signal, signaler, value, descriptor);
      window.$ModelNotifications.watchers++;
    });
  }

  /**
   * Watch this model for any notify signals.
   *
   * @param handler The function to call when a notify signal is sent.
   */
  watch(handler, signals) {
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

  getChangeDescriptor(propertyName, oldValue, newValue) {
    if (this.propertyOptions[propertyName].descriptor) {
      if (typeof this.propertyOptions[propertyName].descriptor === 'function') {
        return this.propertyOptions[propertyName].descriptor(oldValue, newValue);
      }

      return this.propertyOptions[propertyName].descriptor;
    }

    return undefined;
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
    let subScriptName = `_${name}`;

    let defaultGet = function() {
      return this[subScriptName];
    };

    //-----------------------------------
    // defaultSet
    //-----------------------------------
    let defaultSet = function(value) {
      const oldValue = this[subScriptName];

      if (oldValue === value) {
        return;
      }

      // Clear old child model
      if (oldValue instanceof Model && oldValue.parentModel === this) {
        this.removeModelChild(oldValue);
      }

      this[subScriptName] = value;

      // Update new child model
      if (value && value instanceof Model) {
        this.addModelChild(name, value);
      }

      let onChange = this.propertyOptions[name].onChange;
      let skipNotify = false;

      if (onChange) {
        skipNotify = onChange(oldValue, value);
      }

      if (this.propertyChange) {
        this.propertyChange(subScriptName, oldValue, value);
      }

      if (!skipNotify) {
        this.notify(name, this, value, this.getChangeDescriptor(name, oldValue, value));
      }
    };

    Object.defineProperty(this, name, {
      get: options.get || defaultGet,
      set: options.set || defaultSet
    });

    delete options.get;
    delete options.set;

    this.propertyOptions[name] = options;

    if (this._values && this._values[name]) {
      this[subScriptName] = this._values[name];
    } else {
      this[name] = defaultValue;
    }

    this.properties.push(name);

    if (options.index) {
      this.indexProperties = this.indexProperties || [];
      this.indexProperties.push(name);
    }

    return this[name];
  }

  /**
   * Adds a child model, setting up the appropriate tree for watch/notify notifications.
   *
   * @param propertyName The propertyName that this child belongs to.
   * @param child The child Model instance.
   */
  addModelChild(propertyName, child) {
    if (this.childIdToRef[child.id]) {
      this.removeModelChild(child);
    }

    if (this.propertyOptions[propertyName].setParentModel !== false) {
      if (child.parentModel && child.parentModel !== this) {
        throw new Error(`Model::addModelChild(): ${child.name} already has a parentModel!`);
      }

      child.parentModel = this;
    }

    if (this.propertyOptions[propertyName].autoWatch !== false) {
      let watchHandler = (function (propertyName, signal, item, value, descriptor) {
        this.notify(`${propertyName}.${signal}`, item, value, descriptor);
      }).bind(this, propertyName);

      child.watch(watchHandler);

      this.childIdToRef[child.id] = {
        watchHandler,
        propertyName
      };
    }
  }

  /**
   * Remove a model child from the Model tree, safely removing the watcher.
   *
   * @param child The Model child.
   */
  removeModelChild(child) {
    let ref = this.childIdToRef[child.id];

    if (this.propertyOptions[ref.propertyName].setParentModel !== false) {
      child.parentModel = undefined;
    }

    if (this.propertyOptions[ref.propertyName].autoWatch !== false) {
      child.unwatch(ref.watchHandler);

      delete this.childIdToRef[child.id];
    }
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
   *
   * @param parentModel Used to set the parentModel property when doing a clone.
   */
  clone() {
    let newInstance = new (this.constructor)(this.name);

    newInstance.propertyOptions = this.propertyOptions;

    let _clone = (propName, obj) => {
      if (obj instanceof Array) {
        return obj.map(_clone.bind(undefined, propName));
      } else if (obj instanceof Model) {
        // Make sure we set the parentModel, which is our newInstance!
        let childModel = obj.clone();

        if (childModel instanceof Model) {
          newInstance.addModelChild(propName, childModel);
        }

        return childModel;
      } else if (typeof obj === 'object' && obj.hasOwnProperty('clone')) {
        return obj.clone(newInstance);
      } else if (typeof obj === 'object') {
        let newObj = {};
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            newObj[key] = _clone(propName, obj[key]);
          }
        }
        return newObj;
      }

      return obj;
    };

    this.properties.forEach(propName => {
      let newObj;

      if (this.propertyOptions[propName].clone) {
        newObj = this.propertyOptions[propName].clone(this[propName]);
      } else {
        newObj = _clone(propName, this[propName]);
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

Model.version = '0.0.0'; // This can be customized for serialization and deserialization

Model.isDeserializable = function (pojo, options = {}) {
  if (!pojo.$Model && !options.modelMapper) {
    console.warn('Model.isDeserializable: could not deserialize object because it does not contain the $Model property', pojo);
    return false;
  } else if (pojo.$Model && !window.$ModelNameToConstructorMap[pojo.$Model]) {
    console.warn(`Model.isDeserializable: could not deserialize object because $Model property of '${pojo.$Model}' did not reference a valid model.`, pojo);
    return false;
  }

  return true;
};

Model.getModelClassByName = function (name) {
  return window.$ModelNameToConstructorMap[name];
};

/**
 * Deserializes this object from a POJO only updating properties added with addProperty.
 *
 * @param values
 */
Model.deserialize = function(pojo, options = {}) {
  if (!Model.isDeserializable(pojo, options)) {
    return undefined;
  }

  let construct = function(ModelClass) {
    // Is there a custom deserialize method?
    if (ModelClass.deserialize && ModelClass.deserialize !== Model.deserialize) {
      return ModelClass.deserialize(pojo, options);
    }

    return new (ModelClass)();
  };

  let _deserializePOJOValue = (value) => {
    if (value instanceof Array) {
      return value.map(_deserializePOJOValue);
    } else if (typeof value === 'object') {
      if (value.hasOwnProperty('$Model')) {
        return Model.getModelClassByName(value.$Model).deserialize(value, options);
      } else if (options.modelMapper) {
        let PossibleModel = options.modelMapper(pojo, options);

        if (PossibleModel !== value) {
          return PossibleModel.deserialize(value, options);
        }

        return PossibleModel;
      }
    }

    return value;
  };

  let ModelClass;

  if (pojo.$Model) {
    ModelClass = Model.getModelClassByName(pojo.$Model);
  } else if (options.modelMapper) {
    ModelClass = options.modelMapper(pojo);

    if (ModelClass === pojo) {
      return ModelClass;
    }
  }

  let newInstance = construct(ModelClass);

  newInstance.deserializing = true;
  newInstance.$version = pojo.$version;

  newInstance.properties.forEach(key => {
    if (pojo[key] && newInstance.propertyOptions[key].serialize !== false) {
      newInstance[key] = _deserializePOJOValue(pojo[key]);
    }
  });

  newInstance.deserializing = false;

  if (newInstance.postDeserialize) {
    newInstance.postDeserialize(pojo);
  }

  return newInstance;
};

export default Model;