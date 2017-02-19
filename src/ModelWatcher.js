import RingaObject from './RingaObject';
import Model from './Model';

/**
 * Retrieves a property by a dot-delimited path on a provided object.
 *
 * @param obj The object to search.
 * @param path A dot-delimited path like 'prop1.prop2.prop3'
 * @returns {*}
 */
function objPath(obj, path) {
  if (!path) {
    return obj;
  }
  path = path.split('.');
  let i = 0;
  while (obj && i < path.length) {
    obj = obj[path[i++]];
  }
  return obj;
}

/**
 * For a single dot-delimited path like 'when.harry.met.sally', returns:
 *
 * ['when', 'when.harry', 'when.harry.met', 'when.harry.met.sally']
 *
 * @param propertyPath A full dot-delimited path.
 * @returns {*}
 */
function pathAll(propertyPath) {
  return propertyPath.split('.').reduce((a, v, i) => {
    a[i] = i === 0 ? v : a[i-1] + '.' + v;
    return a;
  }, []);
}

/**
 * A collection of watches that will be updated in one shot.
 */
class Watchees {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor() {
    this.watchees = [];
    this.id = Math.random().toString();
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  add(model, propertyPath, watchee) {
    let watcheeObj;

    let arg = {
      model,
      path: propertyPath,
      value: objPath(model, propertyPath),
      watchedPath: watchee.propertyPath,
      watchedValue: objPath(model, watchee.propertyPath)
    };

    if (watchee.handler.__watchees && (watcheeObj = watchee.handler.__watchees[this.id])) {
      watcheeObj.arg.push(arg);

      return;
    }

    watcheeObj = {
      arg: [arg],
      handler: watchee.handler
    };

    this.watchees.push(watcheeObj);

    watcheeObj.handler.__watchees = watcheeObj.handler.__watchees || {};
    watcheeObj.handler.__watchees[this.id] = watcheeObj;
  }

  notify() {
    let w = this.watchees;
    this.clear();

    w.forEach(watcheeObj => {
      watcheeObj.handler.call(undefined, watcheeObj.arg);
      delete watcheeObj.handler.__watchees[this.id];
    });
  }

  clear() {
    globalWatchee = undefined;
  }
}

let globalWatchee;
let timeoutToken;

/**
 * This ModelWatcher watches for a model by id, Class/prototype in heirarchy, or name.
 */
class ModelWatcher extends RingaObject {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(name, id) {
    super(name, id);

    this.idNameToWatchees = {};
    this.classToWatchees = new WeakMap();

    this.models = [];
    this.idToModel = new WeakMap();
    this.nameToModel = new WeakMap();
    this.classToModel = new WeakMap();
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * A model to be watched.
   *
   * @param model Assumed to be an extension of Ringa.Model.
   * @param id A custom id to assign if you so desire.
   */
  addModel(model) {
    if (!(model instanceof Model)) {
      throw new Error(`ModelWatcher::addModel(): the provided model ${model.constructor.name} was not a valid Ringa Model!`);
    }

    if (this.nameToModel[model.name]) {
      throw new Error(`ModelWatcher::addModel(): a Model with the name ${model.name} has already been watched!`);
    }

    this.models.push(model);

    this.idToModel[model.id] = model;
    this.nameToModel[model.name] = model;

    let p = model.constructor;

    while (p) {
      // First come first serve for looking up by type!
      if (!this.classToModel[p]) {
        this.classToModel[p] = model;
      }

      p = p.__proto__;
    }

    if (typeof model.addInjector == 'function') {
      model.addInjector(this);
    }
  }

  /**
   * See if a Model exists in this ModelWatcher and find a property on it (optional).
   *
   * @param classOrIdOrName A Class that extends Ringa.Model or an id or a name to lookup.
   * @param propertyPath A dot-delimited path deep into a property.
   * @returns {*} The model (if not propertyPath provided) or the property on the model.
   */
  find(classOrIdOrName, propertyPath = undefined) {
    let model;

    // By ID (e.g. 'myModel' or 'constructor_whatever')
    if (typeof classOrIdOrName === 'string' && this.idToModel[classOrIdOrName]) {
      model = this.idToModel[classOrIdOrName];
    } if (typeof classOrIdOrName === 'string' && this.nameToModel[classOrIdOrName]) {
      model = this.nameToModel[classOrIdOrName];
    } else {
      // By Type (e.g. MyModel, MyModelBase, MyModelAbstract, etc.)
      let p = classOrIdOrName;

      while (p) {
        if (this.classToModel[p]) {
          model = this.classToModel[p];
          break;
        }

        p = p.prototype;
      }
    }

    if (model) {
      return propertyPath ? objPath(model, propertyPath) : model;
    }

    return null;
  }

  /**
   * Watch a model or specific property on a model for changes.
   *
   * @param classOrIdOrName A Ringa.Model extension, id, or name of a model to watch.
   * @param propertyPath A dot-delimiated path into a property.
   * @param handler Function to callback when the property changes.
   */
  watch(classOrIdOrName, propertyPath, handler = undefined) {
    // If handler is second property...
    if (typeof propertyPath === 'function') {
      handler = propertyPath;
      propertyPath = undefined;
    }

    let group;
    let defaultGroup = {
      all: [],
      byPath: {}
    };

    if (typeof classOrIdOrName === 'function') {
      group = this.classToWatchees[classOrIdOrName] = this.classToWatchees[classOrIdOrName] || defaultGroup;
    } else if (typeof classOrIdOrName === 'string') {
      group = this.idNameToWatchees[classOrIdOrName] = this.idNameToWatchees[classOrIdOrName] || defaultGroup;
    } else if (__DEV__) {
      throw new Error(`ModelWatcher::watch(): can only watch by Class or id`);
    }

    let watchee = {
      handler,
      propertyPath
    };

    if (!propertyPath) {
      group.all.push(watchee);
    } else {
      let paths = pathAll(propertyPath);

      paths.forEach(path => {
        group.byPath[path] = group.byPath[path] || []
        group.byPath[path].push(watchee);
      });
    }
  }

  /**
   * The notify method is rather complex. We need to intelligently create a Set of watchees (functions to notify)
   * about changes on each model based upon what they wanted to be notified about and also ordered by the priority
   * in which they asked to be notified.
   *
   * Another reason this algorithm is complicated is because handlers can request to be notified based on specific
   * paths, so that the handlers do not get hammered with lots of notifications for every change in the model.
   *
   * Path scoping into the model plays a large part in determining which watchers get notified of changes to the model.
   *
   * For example:
   *
   *    // 1) Notify MyComponent of *any* changes to MyModel
   *    watcher.watch(MyModel, myHandlerFunction);
   *    watcher.watch('myModel', myHandlerFunction);
   *
   *    // 2) Notify MyComponent only if 'prop' changes or any of its children
   *    watcher.watch(MyModel, 'prop', myHandlerFunction);
   *    watcher.watch('myModel', 'prop', myHandlerFunction);
   *
   *    // 3) Notify MyComponent only if 'prop.value' changes or any of its children
   *    watcher.watch(MyModel, 'prop.value', myHandlerFunction);
   *    watcher.watch('myModel', 'prop.value', myHandlerFunction);
   *
   *    // 4) Notify MyComponent only if 'otherProp' changes or any of its children
   *    watcher.watch(MyModel, 'otherProp', myHandlerFunction);
   *    watcher.watch('myModel', 'otherProp', myHandlerFunction);
   *
   * For `watcher.notify(myModel, 'prop.value')` then (1), (2), and (3) are called.
   * For `watcher.notify(myModel, 'prop')` then (1), (2), and (3) are called.
   * For `watcher.notify(myModel)` then all are called.
   * For `watcher.notify(myModel, 'otherProp')` only (1) and (4) are called.
   *
   * To increase the performance of your application, decrease the number of things being watched but be as precise as
   * possible as to both what you are watching and on what you call notify().
   *
   * @param model The model that has changed
   * @param propertyPath The property path (dot-delimited) into a property on the model that has changed.
   * @param timeout A timeout to clear the stack frame and unify all the notifications at once. This makes make sure
   * that if multiple properties get set on a model back to back and notify() is called over and over that the
   * handlers do not get called over and over for each property. Set to -1 to skip the timeout.
   */
  notify(model, propertyPath) {
    if (!globalWatchee) {
      globalWatchee = new Watchees();
    }

    let n = globalWatchee;
    let paths, byPathFor = () => {};

    let addWatchee = watchee => {
      n.add(model, propertyPath, watchee);
    };

    let watcheeGroup = watchees => {
      watchees.all.forEach(addWatchee);
      byPathFor(watchees.byPath);
    };

    if (propertyPath) {
      paths = pathAll(propertyPath);

      byPathFor = (watcheesByPath) => {
        // If an watchee has requested 'when.harry.met.sally' there is no point to call for 'when.harry.met', 'when.harry',
        // or 'when'. So we go backwards through the array. I would do paths.reverse() but, well, performance and all.
        for (let i = paths.length - 1; i >= 0; i--) {
          let path = paths[i];
          if (watcheesByPath[path]) {
            watcheesByPath[path].forEach(addWatchee);
            break;
          }
        }
      }
    } else {
      // Well, its a little insane, but if a propertyPath isn't specified, we just notify everyone.
      // TODO: This is where we should do some performance metrics so developers don't write code that has massive
      // performance hits because every handler gets notified at once.
      byPathFor = (watcheesByPath) => {
        for (var key in watcheesByPath) {
          watcheesByPath[key].forEach(addWatchee);
        }
      }
    }

    // By ID (e.g. 'MyModel1' or 'MyController10')
    if (this.idNameToWatchees[model.id]) {
      watcheeGroup(this.idNameToWatchees[model.id]);
    }

    // By ID (e.g. 'MyModel1' or 'MyController10')
    if (this.idNameToWatchees[model.name]) {
      watcheeGroup(this.idNameToWatchees[model.name]);
    }

    // By Type (e.g. MyModel, MyModelBase, MyModelAbstract, etc.)
    // Note: we have to account for everything the model has extended in the prototype chain because a watcher
    // may have requested to watch a base class and someone might have extended that... kindof a PITA but gotta
    // cover all bases (no pun intended).
    let p = model.constructor;

    while (p) {
      if (this.classToWatchees[p]) {
        watcheeGroup(this.classToWatchees[p]);
      }

      p = p.__proto__;
    }

    if (timeoutToken) {
      return;
    }

    timeoutToken = setTimeout(function() {
      timeoutToken = undefined;
      globalWatchee.notify();
    }, 0);
  }
}

export default ModelWatcher;