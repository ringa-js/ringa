import RingaObject from './RingaObject';

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

function pathAll(propertyPath) {
  // if propertyPath === 'when.harry.met.sally'
  // then paths = ['when', 'when.harry', 'when.harry.met', 'when.harry.met.sally']
  return propertyPath.split('.').reduce((a, v, i) => {
    a[i] = i === 0 ? v : a[i-1] + '.' + v;
    return a;
  }, []);
}

class Watchees {
  constructor() {
    this.watchees = [];
    this.watcheesMap = new Map();
  }

  add(model, propertyPath, watchee) {
    let watcheeObj;

    let arg = {
      model,
      path: propertyPath,
      value: objPath(model, propertyPath),
      watchedPath: watchee.propertyPath,
      watchedValue: objPath(model, watchee.propertyPath)
    };

    if (watcheeObj = this.watcheesMap[watchee.handler]) {
      watcheeObj.arg.push(arg);

      return;
    }

    watcheeObj = {
      arg: [arg],
      handler: watchee.handler
    };

    this.watchees.push(watcheeObj);
    this.watcheesMap[watchee.handler] = watcheeObj;
  }

  notify() {
    this.watchees.forEach(watcheeObj => {
      watcheeObj.handler.call(undefined, watcheeObj.arg);
    });

    this.clear();
  }

  clear() {
    this.watchees = [];
    this.watcheesMap = new Map();
  }
}

class ModelInjector extends RingaObject {
  constructor(id) {
    super(id);

    this.idToWatchees = {};
    this.classToWatchees = new Map();

    this.models = [];
    this.idToModel = new Map();

    // We always notify everyone at once and ensure that nobody gets notified more than once.
    this.nextWatchees = new Watchees();
  }

  addModel(model, id) {
    this.models.push(model);

    id = id || model.id;

    if (id) {
      this.idToModel[id] = model;
    }

    if (typeof model.addInjector == 'function') {
      model.addInjector(this);
    }
  }

  watch(classOrId, propertyPath, handler = undefined) {
    if (typeof propertyPath === 'function') {
      handler = propertyPath;
      propertyPath = undefined;
    }

    let group;

    if (typeof classOrId === 'function') {
      group = this.classToWatchees[classOrId] = this.classToWatchees[classOrId] || {
        all: [],
        byPath: {}
      };
    } else if (typeof classOrId === 'string') {
      group = this.idToWatchees[classOrId] = this.idToWatchees[classOrId] || {
        all: [],
        byPath: {}
      };
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
  notify(model, propertyPath, timeout = 0) {
    let n = this.nextWatchees;
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
      // This is where we should do some performance metrics so developers don't write code that has massive
      // performance hits because every handler gets notified at once.
      byPathFor = (watcheesByPath) => {
        for (var key in watcheesByPath) {
          watcheesByPath[key].forEach(addWatchee);
        }
      }
    }

    // By ID (e.g. 'myModel' or 'constructor_whatever')
    if (this.idToWatchees[model.id]) {
      watcheeGroup(this.idToWatchees[model.id]);
    }

    // By Type (e.g. MyModel, MyModelBase, MyModelAbstract, etc.)
    // Note: we have to account for everything the model has extended in the prototype chain because a watcher
    // may have requested to watch a base class and someone might have extended that... kindof a PITA but gotta
    // cover all bases (no pun intended).
    let p = model.prototype;

    while (p) {
      if (this.classToWatchees[p.constructor]) {
        this.classToWatchees[p.constructor].forEach(watcheeGroup);
      }

      p = p.prototype;
    }

    if (timeout !== -1) {
      setTimeout(() => {
        this.nextWatchees.notify();
      }, timeout);
    } else {
      this.nextWatchees.notify();
    }
  }
}

export default ModelInjector;