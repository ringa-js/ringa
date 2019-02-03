import Bus from './Bus';
import TrieSearch from 'trie-search';

import ErrorStackParser from 'error-stack-parser';

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
let _serialize = function (model, pojo, options) {
  pojo = pojo || {};

  let props = model.serializeProperties || model.properties;

  props = props.filter(prop => (!model.propertyOptions[prop] || model.propertyOptions[prop].serialize !== false));

  props.forEach(key => {
    let obj;

    let o = model.propertyOptions[key];

    if (o && o.preSerialize) {
      obj = o.preSerialize(options);
    } else {
      obj = model[key];
    }

    if (obj instanceof Array) {
      let newArr = [];

      obj.forEach(item => {
        newArr.push(item instanceof Model ? item.serialize() : item);
      });

      pojo[key] = newArr;
    } else if (obj instanceof Model) {
      pojo[key] = obj.serialize(options);
    } else {
      pojo[key] = obj;
    }

    if (o && o.postSerialize) {
      o.postSerialize(options);
    }
  });

  if (model.postSerialize) {
    model.postSerialize(pojo, options);
  }

  return pojo;
};

/**
 * A Ringa Model provides functionality to watch lightweight event signals (just strings) and notify listeners when those events occur.
 * The event signals are designed by default to be correlated with properties changing, but technically could be used for anything.
 */
class Model extends Bus {
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

    super(name, (values && values.id !== undefined) ? values.id : undefined);

    this.properties = [];
    this.propertyOptions = {};
    this._values = values;
    this._modelWatchers = [];
    this.watchers = [];
    this.childIdToRef = {};
    this.$version = undefined; // Used when something is deserialized

    window.$ModelNameToConstructorMap[this.constructor.name] = this.constructor;

    if (__DEV__) {
      try { this.stackCreationPoint = new Error().stack.replace(/\s*Error\s*/g, ''); }
      catch(err) { this.stackCreationPoint = 'unknown'; }
    }
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
  serialize(options = {useRingaDefaults: false}) {
    let pojo = !options.useRingaDefaults ? {
        id: this.serializeId
      } : {
        $Model: this.constructor.name,
        $version: this.constructor.version,
        $name: this.serializeName,
        id: this.serializeId
      };

    _serialize(this, pojo, options);

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
  watch(handler) {
    // TODO add ability to watch specific signals
    if (this.watchers.indexOf(handler) === -1) {
      this.watchers.push(handler);
    }
  }

  /**
   * Watch this model and wait for a condition to be a true, then call the handler.
   *
   * @param condition
   * @param handler
   * @param autoUnwatch
   */
  watchUntil(condition, handler, autoUnwatch = true) {
    let fn = (signal, signaler, value, descriptor) => {
      if (condition(this, signal, signaler, value, descriptor)) {
        if (autoUnwatch) {
          this.unwatch(fn);
        }

        handler(this, signal, signaler, value, descriptor);

        return true;
      }

      return false;
    };

    if (condition(this)) {
      handler(this);

      if (autoUnwatch) {
        return;
      }
    }

    this.watch(fn);
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

      // TODO: add custom comparison options function
      if (oldValue === value) {
        return;
      }

      // Clear old child model
      if (oldValue && oldValue instanceof Model && oldValue.parentModel === this) {
        this.removeModelChild(oldValue);
      }

      this[subScriptName] = value;

      // Update new child model
      if (value && value instanceof Model) {
        this.addModelChild(name, value);
      }

      let po = this.propertyOptions[name];

      let onChange = po.onChange;
      let doNotNotify = po.doNotNotify;
      let skipNotify = false;

      if (onChange) {
        skipNotify = onChange(oldValue, value);
      }

      if (this.propertyChange) {
        this.propertyChange(name, oldValue, value);
      }

      if (!this.deserializing && !skipNotify && !doNotNotify) {
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

    if (this._values && this._values[name] !== undefined) {
      this[name] = this._values[name];
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
  clone(options = {cloneId: false}) {
    let newInstance = new (this.constructor)(this.name, {
      id: options.cloneId ? this.id : undefined
    });

    newInstance.propertyOptions = this.propertyOptions;

    let _clone = (propName, obj) => {
      if (obj === null) {
        return null;
      } else if (obj === undefined) {
        return undefined;
      }
      if (obj instanceof Array) {
        return obj.map(_clone.bind(undefined, propName));
      } else if (obj instanceof Model) {
        // Make sure we set the parentModel, which is our newInstance!
        let childModel = obj.clone(options);

        if (childModel instanceof Model) {
          newInstance.addModelChild(propName, childModel);
        }

        return childModel;
      } else if (typeof obj === 'object' && obj.hasOwnProperty && obj.hasOwnProperty('clone')) {
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
  index(recurse = false, trieSearchOptions = {}, trieSearch = undefined) {
    trieSearch = trieSearch || new TrieSearch(undefined, Object.assign(trieSearchOptions, {
        keepAll: true,
        keepAllKey: 'id'
      }));

    trieSearch.visitedById = trieSearch.visitedById || {};

    if (trieSearch.visitedById[this.id]) {
      return;
    }

    trieSearch.visitedById[this.id] = true;

    let _add = function(model, trieSearch, prop, obj) {
      if (typeof obj === 'object' && obj !== null && obj.indexValue) {
        trieSearch.map(obj.indexValue, model);
      } else if (obj && obj.toString() !== '') {
        trieSearch.map(obj.toString(), model);
      }
    };

    let _recurse = (obj) => {
      if (obj instanceof Array) {
        obj.forEach(_recurse);
      } else if (obj instanceof Model) {
        obj.index(recurse, trieSearchOptions, trieSearch);
      }
    };

    if (this.indexProperties) {
      this.indexProperties.forEach(prop => _add(this, trieSearch, prop, this[prop]));
    }

    if (recurse) {
      this.properties.forEach(prop => _recurse(this[prop]));
    }

    return trieSearch;
  }

  /**
   * Deserializes POJO data directly into this object.
   */
  deserialize(pojo, options = {}) {
    this.constructor.deserialize(pojo, Object.assign(options, {
      instance: this,
      ignore$Model: true
    }));
  }
}

Model.version = '0.0.0'; // This can be customized for serialization and deserialization

Model.isDeserializable = function (pojo, options = {}) {
  options.ignore$Model = options.ignore$Model !== undefined ? options.ignore$Model : true;

  if (!options.ignore$Model) {
    if (!pojo.$Model && !options.modelMapper) {
      console.error('Model.isDeserializable: could not deserialize object because it does not contain the $Model property or does not contain options.modelMapper', pojo);
      return false;
    } else if (pojo.$Model && !window.$ModelNameToConstructorMap[pojo.$Model]) {
      console.error(`Model.isDeserializable: could not deserialize object because $Model property of '${pojo.$Model}' did not reference a valid model.`, pojo);
      return false;
    }
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
    if (!ModelClass) {
      console.error('Could not deserialize due to inability to find a matching model: ', pojo, options);
      return Model;
    }

    // Is there a custom deserialize method?
    if (ModelClass.deserialize && ModelClass.deserialize !== Model.deserialize) {
      return ModelClass.deserialize(pojo, options);
    }

    if (pojo.id) {
      return new (ModelClass)({
        id: pojo.id
      });
    }

    return new (ModelClass)();
  };

  let _deserializePOJOValue = (parent, parentKey, value) => {
    if (value instanceof Array) {
      return value.map(_deserializePOJOValue.bind(undefined, parent, parentKey));
    } else if (typeof value === 'object' && value !== null) {
      // Three ways to figure out the type of Model:
      // 1) If the POJO contains a $Model key, which will contain a string of the Ringa classname
      // 2) If some specified the model in addProperty('blah', {}, {type: SomeModel})
      // 3) If the options passed into deserialize contain a modelMapper function to inspect the POJO and
      //    return the model type based on inspection.
      if (value.hasOwnProperty('$Model') && !options.ignore$Model) {
        return Model.getModelClassByName(value.$Model).deserialize(value, options);
      } else if (parent.propertyOptions[parentKey].type) {
        let type = parent.propertyOptions[parentKey].type;
        let Clazz;

        if (type.prototype instanceof Model) {
          Clazz = type;
        } else {
          Clazz = type(parent, parentKey, value);
        }

        return Clazz.deserialize(value, Object.assign(options, {
          model: Clazz
        }));
      } else if (options.modelMapper) {
        let PossibleModel = options.modelMapper(value, options);

        if (PossibleModel !== value) {
          if (!PossibleModel || !PossibleModel.deserialize) {
            console.error(`Model.options.modelMapper: could not deserialize because provided modelMapper returned a model with no deserialize method.`)
            console.error(`ModelMapper: ${options.modelMapper}`);
            console.error(`Value to deserialize:`, value);
            console.error(`PossibleModel:`, PossibleModel);
          }
          return PossibleModel.deserialize(value, Object.assign(options, {
            model: PossibleModel
          }));
        }

        return PossibleModel;
      }
    }

    return value;
  };

  let newInstance;

  if (!options.instance) {
    let ModelClass;

    if (pojo.$Model && !options.ignore$Model) {
      ModelClass = Model.getModelClassByName(pojo.$Model);
    } else if (options.model) {
      ModelClass = options.model;

      // Make sure we don't pollute subsequent calls with the model object! Since options.model is temporary
      // just for this first deserialize call.
      delete options.model;
    } else if (options.modelMapper) {
      ModelClass = options.modelMapper(pojo);

      if (ModelClass === pojo) {
        return ModelClass;
      }
    }

    newInstance = construct(ModelClass);
  } else {
    newInstance = options.instance;

    // Make sure we don't pollute subsequent calls with the instance in our root deserialize call! Since options.instance is temporary
    // just for this first deserialize call.
    delete options.instance;
  }

  newInstance.deserializing = true;
  newInstance.$version = pojo.$version;

  let properties = newInstance.properties.filter(key => {
    return !newInstance.propertyOptions[key] || newInstance.propertyOptions[key].serialize !== false;
  });

  properties.forEach(key => {
    if (pojo.hasOwnProperty(key)) {
      let t = typeof pojo[key];
      let v = pojo[key];

      if (t === 'string' || t === 'number' || v === undefined || v === null) {
        newInstance[key] = v;
      } else {
        newInstance[key] = _deserializePOJOValue(newInstance, key, v);
      }
    }
  });

  newInstance.deserializing = false;

  newInstance.$deserializedObject = pojo;

  if (newInstance.postDeserialize) {
    newInstance.postDeserialize(pojo, options);
  }

  return newInstance;
};

Model.construct = function(className, propertyArray) {
  //--------------------------------------------------
  // KEEP THIS CODE
  //--------------------------------------------------
  let clazz = class M extends Model {
    static get name() {
      return className;
    }

    constructor(name, values) {
      super(name, values);

      for (let key in propertyArray) {
        let v = propertyArray[key];

        if (typeof v === 'string') {
          this.addProperty(v);
        } else {
          let d = v.default;

          if (typeof d === 'function') {
            d = d();
          } else if (d instanceof Array) {
            d = d.concat();
          } else if (__DEV__ && typeof d === 'object') {
            console.warn('Model: note that defaults that are Objects when using Model.construct() will be shared across all instances!');
          }

          this.addProperty(v.name, d, v.options);
        }
      }
    }
  };

  /**
   * By using a generic function that is closured for our class, we unfortunately cannot compare classes by string. So in react-ringa our depend
   * will just use $ringaClassName if it exists.
   */
  clazz.$ringaClassName = className;

  return clazz;
};

export default Model;