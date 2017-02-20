(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Ringa"] = factory();
	else
		root["Ringa"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 41);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executorCounts = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaObject2 = __webpack_require__(2);

var _RingaObject3 = _interopRequireDefault(_RingaObject2);

var _debug = __webpack_require__(7);

var _type = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var executorCounts = exports.executorCounts = {
  map: new Map()
};

/**
 * Command is the base class for all command objects that are run in a Ringa application or module.
 */

var ExecutorAbstract = function (_RingaObject) {
  _inherits(ExecutorAbstract, _RingaObject);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param thread The parent thread that owns this command.
   */
  function ExecutorAbstract(thread) {
    _classCallCheck(this, ExecutorAbstract);

    var _this = _possibleConstructorReturn(this, (ExecutorAbstract.__proto__ || Object.getPrototypeOf(ExecutorAbstract)).call(this));

    _this.hasBeenRun = false;

    if (true && !thread.controller) {
      throw Error('ExecutorAbstract(): attempting to build an executor connected to a Thread without a controller.');
    }

    var i = executorCounts.map[_this.constructor] = executorCounts.map[_this.constructor] ? executorCounts.map[_this.constructor] + 1 : 1;
    _this.id = thread.controller.id + '_' + _this.constructor.name + i;

    _this.thread = thread;

    _this.startTime = _this.endTime = undefined;

    _this.done = _this.done.bind(_this);
    _this.fail = _this.fail.bind(_this);
    _this.stop = _this.stop.bind(_this);
    _this.resume = _this.resume.bind(_this);
    return _this;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------


  _createClass(ExecutorAbstract, [{
    key: 'startTimeoutCheck',


    //-----------------------------------
    // Methods
    //-----------------------------------
    value: function startTimeoutCheck() {
      if (this.timeout !== -1) {
        this._timeoutToken = setTimeout(this._timeoutHandler.bind(this), this.timeout);
      }
    }
  }, {
    key: 'endTimeoutCheck',
    value: function endTimeoutCheck() {
      if (this._timeoutToken !== undefined) {
        clearTimeout(this._timeoutToken);
      }

      this._timeoutToken = undefined;
    }

    /**
     * Internal execution method called by Thread only. This must be overridden in a
     * subclass to provide the appropriate functionality.
     *
     * @param doneHandler The handler to call when done() is called.
     * @param failHandler The handler to call when fail() is called;
     * @private
     */

  }, {
    key: '_execute',
    value: function _execute(doneHandler, failHandler) {
      if (this.hasBeenRun) {
        throw new Error('ExecutorAbstract::_execute(): an executor has been run twice!');
      }

      this.hasBeenRun = true;

      this.doneHandler = doneHandler;
      this.failHandler = failHandler;

      this.startTime = (0, _debug.now)();

      this.startTimeoutCheck();
    }

    /**
     * Tells this executor to suspend its normal timeout operation and done/fail handler and wait for a promise instead.
     * @param promise
     */

  }, {
    key: 'waitForPromise',
    value: function waitForPromise(promise) {
      var _this2 = this;

      if ((0, _type.isPromise)(promise)) {
        this.ringaEvent.detail._promise = promise;

        promise.then(function (result) {
          _this2.ringaEvent.lastPromiseResult = result;

          _this2.done();
        });
        promise.catch(function (error) {
          _this2.ringaEvent.lastPromiseError = error;

          _this2.fail(error);
        });
      } else if (true) {
        throw Error('ExecutorAbstract::waitForPromise(): command ' + this.toString() + ' returned something that is not a promise, ' + promise);
      }
    }

    /**
     * Call this method when the Command is ready to hand off control back to the parent Thread.
     */

  }, {
    key: 'done',
    value: function done() {
      var _this3 = this;

      if (true && this.error) {
        throw new Error('ExecutorAbstract::done(): called done on a executor that has already errored!');
      }

      var _done = function _done() {
        _this3.endTimeoutCheck();

        _this3.endTime = (0, _debug.now)();

        _this3.doneHandler(true);
      };

      if (true && this.controller.options.throttle) {
        var elapsed = new Date().getTime() - this.startTime;
        var _controller$options$t = this.controller.options.throttle,
            min = _controller$options$t.min,
            max = _controller$options$t.max;

        var millis = Math.random() * (max - min) + min - elapsed;

        // Make sure in a state of extra zeal we don't throttle ourselves into a timeout
        if (millis < 5) {
          _done();
        } else {
          setTimeout(_done, millis);
        }
      } else {
        _done();
      }
    }

    /**
     * Call this method if an error occurred during the processing of a command.
     *
     * @param error The error that has occurred.
     * @param kill True if you want the thread to die immediately.
     */

  }, {
    key: 'fail',
    value: function fail(error) {
      var kill = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      this.endTimeoutCheck();

      this.endTime = (0, _debug.now)();

      this.error = error;

      this.failHandler(error, kill);
    }

    /**
     * Stops the timeout check.
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.endTimeoutCheck();
    }

    /**
     * Resumes the timeout check.
     */

  }, {
    key: 'resume',
    value: function resume() {
      this.startTimeoutCheck();
    }

    /**
     * By default is this executors id.
     *
     * @returns {string|*}
     */

  }, {
    key: 'toString',
    value: function toString() {
      return this.id;
    }
  }, {
    key: '_timeoutHandler',
    value: function _timeoutHandler() {
      var message = void 0;

      if (true) {
        message = 'ExecutorAbstract::_timeoutHandler(): the timeout (' + this.timeout + ' ms) for this executor was exceeded:\n\t' + this.toString();
      }

      if (false) {
        message = 'Ringa: executor timeout (' + this.timeout + ' ms) exceeded:\n\t' + this.toString();
      }

      this.ringaEvent._threadTimedOut = true;

      this.error = new Error(message);

      this.failHandler(this.error, true);
    }
  }, {
    key: 'ringaEvent',
    get: function get() {
      return this.thread.ringaEvent;
    }
  }, {
    key: 'controller',
    get: function get() {
      return this.thread.controller;
    }
  }, {
    key: 'timeout',
    get: function get() {
      if (this._timeout === undefined && this.controller.options.timeout === undefined) {
        return -1;
      }

      return this._timeout !== undefined ? this.timeout : this.controller.options.timeout;
    }
  }]);

  return ExecutorAbstract;
}(_RingaObject3.default);

exports.default = ExecutorAbstract;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var injectionInfo = exports.injectionInfo = {
  byName: {}
};

var getInjections = exports.getInjections = function getInjections(ringaEvent) {
  var executor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  var mergeControllerInjections = function mergeControllerInjections(injections, controller) {
    // Merge controller.options.injections into our injector
    var i = controller.options.injections;
    for (var _key in i) {
      var _i = i[_key];
      if (typeof i[_key] === 'function') {
        _i = i[_key]();
      }

      injections[_key] = _i;
    }
  };

  var injections = void 0;

  // In the RingaEvent.then() resolve callback, we don't have a currently running executor so we have to
  // check for that here and then pass undefined if we don't have one.
  if (executor) {
    injections = executor._injections = executor._injections || {
      $controller: executor.controller,
      $thread: executor.thread,
      $ringaEvent: ringaEvent,
      $lastEvent: ringaEvent.lastEvent,
      $customEvent: ringaEvent.customEvent,
      $target: ringaEvent.target,
      $detail: ringaEvent.detail,
      done: executor.done,
      fail: executor.fail,
      stop: executor.stop,
      resume: executor.resume,
      $lastPromiseResult: ringaEvent.lastPromiseResult,
      $lastPromiseError: ringaEvent.lastPromiseError
    };

    // Merge only injections for the controller that is the current context for the executor.
    mergeControllerInjections(injections, executor.controller);
  } else {
    injections = {};

    // We loop through all the controllers that caught and handled the event and combine all of their injections
    // together... this probably needs to be thought through some more, but it will work for 99% of cases.
    // Note that this means the if Controllers A and B both handled the event in order (A, B) and they both
    // have an injection named 'model', then only the 'model' injection from A will be available.
    ringaEvent._controllers.forEach(function (controller) {
      mergeControllerInjections(injections, controller);
    });

    injections = Object.assign(injections, {
      $ringaEvent: ringaEvent,
      $lastEvent: ringaEvent.lastEvent,
      $customEvent: ringaEvent.customEvent,
      $target: ringaEvent.target,
      $detail: ringaEvent.detail,
      $lastPromiseResult: ringaEvent.lastPromiseResult,
      $lastPromiseError: ringaEvent.lastPromiseError
    });
  }

  var re = ringaEvent;
  var events = [];

  while (re) {
    events.push(re);
    re = re.lastEvent;
  }

  // TODO write units tests to verify this is working okay.
  events.reverse().forEach(function (event) {
    if (event.detail) {
      for (var _key2 in event.detail) {
        injections[_key2] = event.detail[_key2];
      }
    }
  });

  if (true) {
    for (var key in injections) {
      injectionInfo.byName[key] = key;
    }
  }

  return injections;
};

/**
 * This method is used for injecting RingaEvent.detail properties into a function owned by a Executor. It uses the data
 * gathered from introspecting a provided function to determine a set of arguments to
 * call the function with. It maps everything on ringaEvent.detail to arguments on the function.
 *
 * If our function is:
 *
 *    execute(user, filter) {...}
 *
 *  Then expectedArguments should be ['user', 'filter']
 *
 *  To generate the expected arguments, see util/function.js::getArgNames.
 *
 * We want to find ringaEvent.detail['user'] and ringaEvent.detail['filter']
 * and pass those through and error if one of them is missing.
 *
 * Note that there are other properties that can be requested in the arguments list of execute:
 *
 * $controller: the Controller object that is handling this thread
 * $thread: the Thread object that built this Command
 * $ringaEvent: the ringaEvent itself (instead of one of its detail properties)
 * $customEvent: the customEvent that is wrapped by the ringaEvent that was used to bubble up the DOM
 * $target: the target DOMNode that triggered the customEvent was dispatched on.
 * done: the parent Executor::done(). CommandFunction is an example of where this is needed.
 * fail: the parent Executor::fail(). CommandFunction is an example of where this is needed.
 * $lastPromiseResult: the last Promise result from a previous executor.
 * $lastPromiseError: the last Promise error from a previous executor.
 *
 * @param executor The Executor subclass instance.
 * @param expectedArguments An array of argument names that the target function expects.
 * @param ringaEvent An instance of RingaEvent that has been dispatched and contains a details Object with properties to be injected.
 *
 * @returns {Array}
 */
var buildArgumentsFromRingaEvent = exports.buildArgumentsFromRingaEvent = function buildArgumentsFromRingaEvent(executor, expectedArguments, ringaEvent) {
  var args = [];

  if (!(expectedArguments instanceof Array)) {
    throw Error('buildArgumentsFromRingaEvent(): An internal error has occurred in that expectedArguments is not an Array!');
  }

  var injections = getInjections(ringaEvent, executor);

  expectedArguments.forEach(function (argName) {
    if (injections.hasOwnProperty(argName)) {
      args.push(injections[argName]);
    } else {
      var s = ringaEvent.dispatchStack ? ringaEvent.dispatchStack[0] : 'unknown stack.';

      var str = 'Ringa Injection Error!:\n' + (executor ? '\tExecutor: \'' + executor.toString() + '\' of type ' + executor.constructor.name + '\n' : 'No active Executor\n') + ('\tMissing: ' + argName + '\n') + ('\tRequired: ' + expectedArguments.join(', ') + '\n') + ('\tAvailable: ' + Object.keys(injections).sort().join(', ') + '\n') + '\tIf you are minifying JS, make sure you add the original, unmangled property name to the UglifyJSPlugin mangle exceptions.\n' + ('\tDispatched from: ' + s);
      console.error(str);

      // TODO Determine desired behavior to silence console.error & throw (discuss)
      throw Error('Injection failed. See console errors above.');
    }
  });

  return args;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ids = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _camelcase = __webpack_require__(23);

var _camelcase2 = _interopRequireDefault(_camelcase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ids = exports.ids = {
  map: {},
  counts: new WeakMap(),
  constructorNames: {}
};

var RingaObject = function () {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  function RingaObject(name, id) {
    _classCallCheck(this, RingaObject);

    ids.counts[this.constructor] = ids.counts[this.constructor] || 1;

    if (id) {
      this.id = id;
    } else {
      this._id = this.constructor.name + ids.counts[this.constructor];
    }

    ids.counts[this.constructor]++;

    if (!name) {
      name = (0, _camelcase2.default)(this.constructor.name);
    }

    if (true) {
      ids.constructorNames[this.constructor.name] = this.constructor.name;
    }

    this._name = name;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------


  _createClass(RingaObject, [{
    key: 'destroy',


    //-----------------------------------
    // Methods
    //-----------------------------------
    value: function destroy() {
      delete ids.map[this.id];

      return this;
    }
  }, {
    key: 'toString',
    value: function toString(value) {
      return this.name + '_' + (value || '');
    }
  }, {
    key: 'id',
    set: function set(value) {
      if (typeof value !== 'string') {
        throw new Error('RingaObject::id: must be a string! Was ' + JSON.stringify(value));
      }

      if (ids.map[value]) {
        console.warn('Duplicate Ringa id discovered: ' + JSON.stringify(value) + ' for \'' + this.constructor.name + '\'. Call RingaObject::destroy() to clear up the id.');
      }

      ids.map[value] = true; // We do not create a reference to the object because this would create a memory leak.

      this._id = value;
    },
    get: function get() {
      return this._id;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._name;
    }
  }]);

  return RingaObject;
}();

exports.default = RingaObject;
;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isPromise = isPromise;
exports.isDOMNode = isDOMNode;
exports.wrapIfNotInstance = wrapIfNotInstance;
function isPromise(obj) {
  return !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

// Returns true if it is a DOM node
// http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
function isDOMNode(o) {
  return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === "object" ? o instanceof Node : o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string";
}

// If constructor is not in object's prototype chain,
// return object wrapped in constructor
function wrapIfNotInstance(object, constructor) {
  if (!(object instanceof constructor)) {
    object = new constructor(object);
  }

  return object;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This function returns the arguments for another method as an array.
 *
 * TODO: this should give some indication in its return on which arguments are optional (e.g. func(a=1,b=2,c='whatever'))
 *
 * @param func
 * @returns {Array}
 */
var getArgNames = exports.getArgNames = function getArgNames(func) {
  var s = func.toString();
  s = s.substring(s.indexOf('(') + 1, s.indexOf(')'));
  s = s.replace(/[\r\n\s]*/g, '');
  s = s.replace(/\\+['"]/g, '').replace(/=\s*(["']).*?\1/g, '').replace(/=.*?(,|$)/g, '');
  return s.length !== 0 ? s.split(',') : [];
};

/**
 * This function returns a resolved promise after `milliseconds` has elapsed
 *
 * @param milliseconds
 * @returns {Promise}
 */
var sleep = exports.sleep = function sleep(milliseconds) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, milliseconds);
  });
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ExecutorAbstract = __webpack_require__(0);

var _ExecutorAbstract2 = _interopRequireDefault(_ExecutorAbstract);

var _FunctionExecutor = __webpack_require__(37);

var _FunctionExecutor2 = _interopRequireDefault(_FunctionExecutor);

var _PromiseExecutor = __webpack_require__(39);

var _PromiseExecutor2 = _interopRequireDefault(_PromiseExecutor);

var _EventExecutor = __webpack_require__(36);

var _EventExecutor2 = _interopRequireDefault(_EventExecutor);

var _ParallelExecutor = __webpack_require__(38);

var _ParallelExecutor2 = _interopRequireDefault(_ParallelExecutor);

var _SleepExecutor = __webpack_require__(40);

var _SleepExecutor2 = _interopRequireDefault(_SleepExecutor);

var _RingaEventFactory = __webpack_require__(10);

var _RingaEventFactory2 = _interopRequireDefault(_RingaEventFactory);

var _function = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExecutorFactory = function () {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructs a ExecutorFactory.
   *
   * @param executee This can be a Class, a instance, a function... we determine what type of
   *   ExecutorAbstract to build based on what is passed in. This makes things extensible.
   */
  function ExecutorFactory(executee, executeeOptions) {
    _classCallCheck(this, ExecutorFactory);

    if (!executee) {
      throw new Error('ExecutorFactory::build(): an internal error occurred and an executee was undefined!');
    }

    this.executee = executee;
    this.executeeOptions = executeeOptions;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------

  _createClass(ExecutorFactory, [{
    key: 'build',
    value: function build(thread) {
      if (typeof this.executee === 'string') {
        var ringaEventFactory = new _RingaEventFactory2.default(this.executee);
        return new _EventExecutor2.default(thread, ringaEventFactory);
      } else if (typeof this.executee === 'number') {
        return new _SleepExecutor2.default(thread, this.executee);
      } else if (typeof this.executee.then === 'function') {
        return new _PromiseExecutor2.default(thread, this.executee);
      } else if (typeof this.executee === 'function') {
        if (this.executee.prototype instanceof _ExecutorAbstract2.default) {
          var instance = new this.executee(thread, this.executeeOptions);

          if (!this.cache && instance.cacheable) {
            this.cache = instance.cache;
          }

          instance.cache = this.cache;

          return instance;
        } else {
          return new _FunctionExecutor2.default(thread, this.executee);
        }
      } else if (this.executee instanceof Array) {
        // This might be a group of ExecutorAbstracts that should be run synchronously
        return new _ParallelExecutor2.default(thread, this.executee);
      } else if (_typeof(this.executee) === 'object' && this.executee instanceof _RingaEventFactory2.default) {
        return new _EventExecutor2.default(thread, this.executee);
      }

      if (true) {
        throw Error('ExecutorFactory::build(): the type of executee you provided is not supported by Ringa: ' + _typeof(this.executee) + ': ' + this.executee);
      }
    }
  }]);

  return ExecutorFactory;
}();

exports.default = ExecutorFactory;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaObject2 = __webpack_require__(2);

var _RingaObject3 = _interopRequireDefault(_RingaObject2);

var _errorStackParser = __webpack_require__(25);

var _errorStackParser2 = _interopRequireDefault(_errorStackParser);

var _debug = __webpack_require__(7);

var _type = __webpack_require__(3);

var _function = __webpack_require__(4);

var _executors = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var eventIx = 0;

/**
 * RingaEvent is a generic event type for Ringa that, when dispatched on the DOM, wraps a CustomEvent:
 *
 *   let event = new RingaEvent('change', {
 *     property: 'index',
 *     newValue: 1
 *   });
 *
 *   event.dispatch(...add a bus or DOM node here...);
 *
 * If no bus is provided and document is defined, the event will be dispatched on the document object, but you can provide
 * a custom DOMNode or bus to dispatch from:
 *
 *   event.dispatch(myDiv);
 *
 * OR
 *
 *   let b = new Ringa.Bus();
 *   event.dispatch(b);
 *
 * All RingaEvents bubble and are cancelable by default but this can be customized.
 */

var RingaEvent = function (_RingaObject) {
  _inherits(RingaEvent, _RingaObject);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Build a RingaEvent that wraps a CustomEvent internally.
   *
   * @param type The event type.
   * @param detail Event details object. Note that properties on the RingaEvent in the details object are injected by name
   *               into any executors this triggers, making passing values super simple.
   * @param bubbles True if you want the event to bubble (default is true).
   * @param cancelable True if you want the event to be cancellable (default is true).
   */
  function RingaEvent(type) {
    var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var bubbles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var cancelable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var event = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

    _classCallCheck(this, RingaEvent);

    var _this = _possibleConstructorReturn(this, (RingaEvent.__proto__ || Object.getPrototypeOf(RingaEvent)).call(this, 'RingaEvent[' + type + ', ' + eventIx++ + ']'));
    // TODO add cancel support and unit tests!


    _this.detail = detail;
    detail.ringaEvent = _this;

    _this._type = type;
    _this._bubbles = bubbles;
    _this._cancelable = cancelable;

    _this.dispatched = false;
    _this.controller = undefined;

    _this._errors = undefined;

    _this.event = event;

    _this.listeners = {};

    // Controllers that are currently handling the event
    _this.catchers = [];
    // Controllers that are done handling the event
    _this._catchers = [];
    // Was this event caught at all?
    _this.__caught = false;

    _this._threads = [];

    // We keep track of when an Event triggered a thread that timed out because if one event triggers another triggers
    // another and the deepest one times out, we don't really need to get a timeout for all the parent ones that are
    // waiting as well.
    _this._threadTimedOut = false;
    return _this;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------


  _createClass(RingaEvent, [{
    key: 'dispatch',


    //-----------------------------------
    // Methods
    //-----------------------------------
    /**
     * Dispatch the event on the provided bus.
     *
     * Note: this method is always delayed so you must not access its properties
     * until a frame later.
     *
     * @param bus
     */
    value: function dispatch() {
      var _this2 = this;

      var bus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

      if (true) {
        setTimeout(function () {
          if (!_this2.caught) {
            console.warn('RingaEvent::dispatch(): the RingaEvent \'' + _this2.type + '\' was never caught! Did you dispatch on the proper bus or DOM node? Was dispatched on ' + bus);
          }
        }, 50);

        this.dispatchStack = _errorStackParser2.default.parse(new Error());
        this.dispatchStack.shift(); // Remove a reference to RingaEvent.dispatch()

        if (this.dispatchStack.length && this.dispatchStack[0].toString().search('Object.dispatch') !== -1) {
          this.dispatchStack.shift(); // Remove a reference to Object.dispatch()
        }
      } else {
        this.dispatchStack = 'To turn on stack traces, build Ringa in development mode. See documentation.';
      }

      setTimeout(this._dispatch.bind(this, bus), 0);

      return this;
    }

    /**
     * Internal dispatch function. This is called after a timeout of 0 milliseconds to clear the stack from
     * dispatch().
     *
     * @param bus The bus to dispatch on.
     * @private
     */

  }, {
    key: '_dispatch',
    value: function _dispatch(bus) {
      if (true && this.dispatched) {
        throw Error('RingaEvent::dispatch(): events should only be dispatched once!', this);
      }

      if ((0, _type.isDOMNode)(bus)) {
        this.customEvent = new CustomEvent(this.type, {
          detail: this.detail,
          bubbles: this.bubbles,
          cancelable: this.cancelable
        });
      }

      this.dispatched = true;

      this.addDebug('Dispatching on ' + bus + ' ' + (this.customEvent ? 'as custom event.' : 'as RingaEvent.') + ' (' + (this.bubbles ? 'bubbling' : 'does not bubble') + ')');

      bus.dispatchEvent(this.customEvent ? this.customEvent : this);
    }

    /**
     * Called by each Controller when the event is caught. Note that a single RingaEvent can be caught by 0 or more Controllers.
     *
     * @param controller The Ringa.Controller that is announcing it caught the event.
     * @private
     */

  }, {
    key: '_caught',
    value: function _caught(controller) {
      if (true && !controller) {
        throw new Error('RingaEvent::_caught(): controller was not defined!');
      }

      this.__caught = true;
      this.catchers.push(controller);

      this.addDebug('Caught by ' + controller);
    }

    /**
     * Called by a particular controller when the Thread(s) this event triggered in that controller have been completed.
     *
     * @param controller The Ringa.Controller that is announcing it is uncatching the event.
     * @private
     */

  }, {
    key: '_uncatch',
    value: function _uncatch(controller) {
      var ix = this.catchers.indexOf(controller);

      if (true && ix === -1) {
        throw new Error('RingaEvent::_uncatch(): controller that is uncatching could not be found. Was done called twice?');
      }

      this._catchers.push(this.catchers.splice(ix, 1)[0]);

      this.addDebug('Uncaught by ' + controller);
    }

    /**
     * Completely kills the current Ringa thread, keeping any subsequent executors from running. To be called by user code like so:
     *
     *   let event = Ringa.dispatch('someEvent');
     *   ...
     *   event.fail();
     */

  }, {
    key: 'fail',
    value: function fail(error) {
      // TODO this should have a kill property passed in, and when true should kill *every* associated thread this event triggered (DISCUSS)
      this.pushError(error);
    }

    /**
     * Internal fail to be called by a catching Ringa.Controller when an executor has failed for any reason.
     *
     * @param controller The Controller who is responsible for the Thread that just failed.
     * @param error Most likely an Error object but could be a string or anything a user manually passed.
     * @private
     */

  }, {
    key: '_fail',
    value: function _fail(controller, error, killed) {
      if (killed) {
        this._uncatch(controller);
      }

      this.addDebug('Fail');

      this._dispatchEvent(RingaEvent.FAIL, undefined, error);
    }

    /**
     * Add an error to this event.
     *
     * @param error Any type of error (string, Error, etc.)
     */

  }, {
    key: 'pushError',
    value: function pushError(error) {
      // TODO we need to add tests for this.
      this._errors = this._errors || [];
      this.errors.push(error);
    }

    /**
     * Internal done called by a handling Ringa.Controller. Note that since multiple Controllers can handle a single
     * event we have to listen for when all the handling Controllers have been completed before announcing we are, indeed,
     * done.
     *
     * @param controller The Controller that is announcing it is done.
     * @private
     */

  }, {
    key: '_done',
    value: function _done(controller) {
      if (true && !controller) {
        throw new Error('RingaEvent::_done(): controller is not defined!');
      }

      this._uncatch(controller);

      this.addDebug('Done');

      // TODO add unit tests for multiple handling controllers and make sure all possible combinations work (e.g. like
      // one controller fails and another succeeds.
      if (this.catchers.length === 0) {
        if (this.errors && this.errors.length) {
          this._dispatchEvent(RingaEvent.FAIL, undefined, error);
        } else {
          this._dispatchEvent(RingaEvent.DONE);
        }
      }
    }

    /**
     * Each RingaEvent is itself a dispatcher. This is the internal method that should be called to announce an event to
     * things that are listening to this event. Note this is not to be confused with dispatch() which dispatches this event
     * on a bus.
     *
     * @param type Event type.
     * @param detail Details.
     * @param error And error, if there is one.
     * @private
     */

  }, {
    key: '_dispatchEvent',
    value: function _dispatchEvent(type, detail, error) {
      var listeners = this.listeners[type];

      if (listeners) {
        listeners.forEach(function (listener) {
          listener({
            type: type,
            detail: detail,
            error: error
          });
        });
      }
    }

    /**
     * Add a listener for either RingaEvent.DONE or RingaEvent.FAIL for when the CommandThread that
     * was triggered by this event has completed.
     *
     * @param eventType
     * @param handler
     */

  }, {
    key: 'addListener',
    value: function addListener(eventType, handler) {
      if (true && typeof eventType !== 'string') {
        throw Error('RingaEvent::addListener(): invalid eventType provided!' + eventType);
      }

      this.listeners[eventType] = this.listeners[eventType] || [];

      if (this.listeners[eventType].indexOf(handler) !== -1) {
        throw Error('RingaEvent::addListener(): the same function was added as a listener twice');
      }

      this.listeners[eventType].push(handler);

      return this;
    }

    /**
     * Listen for when every single Thread that is triggered by this event is done.
     *
     * @param handler A function callback.
     * @returns {*}
     */

  }, {
    key: 'addDoneListener',
    value: function addDoneListener(handler) {
      var _this3 = this;

      // TODO add unit tests for multiple controllers handling a thread
      return this.addListener(RingaEvent.DONE, function () {
        var argNames = (0, _function.getArgNames)(handler);
        var args = (0, _executors.buildArgumentsFromRingaEvent)(undefined, argNames, _this3);
        handler.apply(undefined, args);
      });
    }

    /**
     * Listen for when any thread triggered by this event has a failure.
     *
     * @param handler A function callback.
     *
     * @returns {*}
     */

  }, {
    key: 'addFailListener',
    value: function addFailListener(handler) {
      // TODO add unit tests for multiple controllers handling a thread
      return this.addListener(RingaEvent.FAIL, handler);
    }

    /**
     * Treat this event like a Promise, in that when it has completed all its triggered threads, it will call resolve or
     * when any thread has a failure, it will call reject.
     *
     * @param resolve A function to call when all triggered threads have completed.
     * @param reject A function to call when any triggered thread has a failure.
     */

  }, {
    key: 'then',
    value: function then(resolve, reject) {
      if (resolve) {
        this.addDoneListener(resolve);
      }

      if (reject) this.addFailListener(reject);
    }

    /**
     * Treat this event like a Promise. Catch is called when any triggered thread has a failure.
     *
     * @param reject A function to call when any triggered thread has a failure.
     */

  }, {
    key: 'catch',
    value: function _catch(reject) {
      this.addFailListener(reject);
    }

    /**
     * Outputs a pretty-printed outline of the entire state of all threads this event has triggered, every executor and its
     * current state (NOT STARTED, RUNNING, DONE, or FAILED).
     *
     * @returns {string} A string of all the data, pretty printed.
     */

  }, {
    key: 'toDebugString',
    value: function toDebugString() {
      return (0, _debug.ringaEventToDebugString)(this);
    }

    /**
     * Converts this event to a pretty string with basic information about the event.
     *
     * @returns {string}
     */

  }, {
    key: 'toString',
    value: function toString() {
      return 'RingaEvent[\'' + this.type + '\' caught by ' + (this._controllers ? this._controllers.toString() : 'nothing yet.') + ' ] ';
    }

    /**
     * Add a debugging message to this RingaEvent for when a user sets RingaEvent::detail.debug to true OR
     * a numeric level value.
     *
     * @param message The message to output.
     * @param level The numeric level of the message. Default is 0.
     */

  }, {
    key: 'addDebug',
    value: function addDebug(message) {
      var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (this.debug === undefined) {
        return;
      }

      if (typeof this.debug === 'number') {
        if (level <= this.debug) {
          return;
        }
      }

      var obj = {
        timestamp: new Date(),
        stack: _errorStackParser2.default.parse(new Error()),
        message: message
      };

      console.log('[RingaEvent \'' + this.type + '\' Debug] ' + message, obj);

      this.detail.$debug = this.detail.$debug || [];
      this.detail.$debug.push(message);
    }

    /**
     * A simple output of the most relevant features of this RingaEvent. Useful for console display.
     *
     * @returns {{type: *, detail: ({}|*), controllers: Array, bubbles: *, dispatchStack: (*|string), fullEvent: RingaEvent}}
     */

  }, {
    key: 'debugDisplay',
    value: function debugDisplay() {
      return {
        type: this.type,
        detail: this.detail,
        controllers: this.catchers,
        bubbles: this.bubbles
      };
    }
  }, {
    key: 'type',
    get: function get() {
      return this._type;
    }
  }, {
    key: 'bubbles',
    get: function get() {
      return this._bubbles;
    }
  }, {
    key: 'cancelable',
    get: function get() {
      return this._cancelable;
    }
  }, {
    key: 'target',
    get: function get() {
      return this.customEvent ? this.customEvent.target : undefined;
    }
  }, {
    key: 'currentTarget',
    get: function get() {
      return this.customEvent ? this.customEvent.currentTarget : undefined;
    }
  }, {
    key: 'errors',
    get: function get() {
      return this._errors;
    }
  }, {
    key: 'caught',
    get: function get() {
      return this.__caught;
    }

    /**
     * Returns an Array of every Controller that ran as a result of this event.
     * @private
     */

  }, {
    key: '_controllers',
    get: function get() {
      return this._catchers.concat(this.catchers);
    }

    /**
     * Returns an Array of every single executor that ran (or will ran) as a result of this event, in order of execution.
     * @private
     */

  }, {
    key: '_executors',
    get: function get() {
      this.threads.reduce(function (a, thread) {
        a = a.concat();
      }, []);
    }

    /**
     * When debug is true (or a number) this outputs verbose information about the event that was dispatched both
     * to the console AND to detail.$debug Object.
     *
     * @returns {{}|*|boolean}
     */

  }, {
    key: 'debug',
    get: function get() {
      return this.detail && this.detail.debug;
    }

    /**
     * Sets the last promise result of this particular event.
     *
     * @param value
     */

  }, {
    key: 'lastPromiseResult',
    set: function set(value) {
      this._lastPromiseResult = value;
    }

    /**
     * Gets the last promise result of this event. If this event triggered another event, then returns that events
     * lastPromiseResult. Hence this method is recursive.
     *
     * @returns {*} A Promise result.
     */
    ,
    get: function get() {
      if (this._lastPromiseResult) {
        return this._lastPromiseResult;
      }

      if (this.lastEvent) {
        return this.lastEvent.lastPromiseResult;
      }

      return undefined;
    }
  }]);

  return RingaEvent;
}(_RingaObject3.default);

RingaEvent.DONE = 'done';
RingaEvent.FAIL = 'fail';
RingaEvent.PREHOOK = 'prehook';

exports.default = RingaEvent;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.now = now;
exports.format = format;
exports.ringaEventToDebugString = ringaEventToDebugString;
exports.injectionNames = injectionNames;
exports.constructorNames = constructorNames;
exports.uglifyWhitelist = uglifyWhitelist;

var _dateformat = __webpack_require__(24);

var _dateformat2 = _interopRequireDefault(_dateformat);

var _executors = __webpack_require__(1);

var _RingaObject = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function now() {
  return new Date();
}

function format(date) {
  if (!date) {
    return '?';
  }

  return (0, _dateformat2.default)(date, 'hh:mm:ss');
}

/**
 * Generates a state tree of the process tree that this event has invoked at the state of this being called.
 *
 * Type: 1 [Event]
 *       2 [Controller]
 *       3 [Thread]
 *       4 [Executor]
 *       0 [Metadata]
 * @private
 */
function ringaEventToDebugString(ringaEvent) {
  var thread = ringaEvent.thread;
  var controller = ringaEvent.controller;
  var out = '';

  // Unfortunately because the state is not a "tree" we cannot generate this using
  // recursion, which would be much more elegant
  out += ringaEvent.id + ' ' + (ringaEvent.dispatched ? 'dispatched' : '') + '\n';

  if (controller) {
    out += '  ' + controller.id;

    if (thread) {
      out += '    ' + thread.id;

      thread._list.forEach(function (command) {
        out += '      ' + command.id + ' [' + format(command.startTime) + ' - ' + format(command.endTime) + ']\n';
      });
    }
  } else {
    out += '  not yet caught.\n';
  }

  return out;
}

function injectionNames() {
  return Object.keys(_executors.injectionInfo.byName);
}

function constructorNames() {
  return Object.keys(_RingaObject.ids.constructorNames);
}

function uglifyWhitelist() {
  return JSON.stringify(injectionNames().concat(constructorNames()).sort());
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaObject2 = __webpack_require__(2);

var _RingaObject3 = _interopRequireDefault(_RingaObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A Ringa Model provides functionality to watch lightweight event signals (just strings) and notify listeners when those events occur.
 * The event signals are designed by default to be correlated with properties changing, but technically could be used for anything.
 */
var Model = function (_RingaObject) {
  _inherits(Model, _RingaObject);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructs a new model.
   *
   * @param name The name of this model for injection.
   * @param values A POJO of default values to assign to the properties in this Model.
   */
  function Model(name, values) {
    _classCallCheck(this, Model);

    if (typeof name !== 'string' && values === undefined) {
      values = name;
      name = undefined;
    }

    var _this = _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this, name, values && values.id ? values.id : undefined));

    _this._values = values;
    _this._modelWatchers = [];
    _this.watchers = [];
    return _this;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Add a ModelWatcher as a parent watcher of this Model. Each Model can be watched by any number of ModelWatchers.
   *
   * @param modelWatcher The ModelWatcher to add.
   */


  _createClass(Model, [{
    key: 'addInjector',
    value: function addInjector(modelWatcher) {
      if (true && this._modelWatchers.indexOf(modelWatcher) !== -1) {
        throw new Error('Model::addInjector(): tried to add the same injector to a model twice! ' + this.id);
      }

      this._modelWatchers.push(modelWatcher);
    }

    /**
     * Send a signal to all watchers.
     *
     * @param signal Generally a path to a property that has changed in the model.
     */

  }, {
    key: 'notify',
    value: function notify(signal) {
      var _this2 = this;

      // Notify all view objects through all injectors
      this._modelWatchers.forEach(function (mi) {
        mi.notify(_this2, signal);
      });

      this.watchers.forEach(function (handler) {
        handler(signal);
      });
    }

    /**
     * Watch this model for any notify signals.
     *
     * @param handler The function to call when a notify signal is sent.
     */

  }, {
    key: 'watch',
    value: function watch(handler) {
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

  }, {
    key: 'addProperty',
    value: function addProperty(name, defaultValue) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this['_' + name] = defaultValue;

      var defaultGet = function defaultGet() {
        return this['_' + name];
      };

      var defaultSet = function defaultSet(value) {
        // TODO if value is itself a Model, I think we should watch it as well for changes. Any changes on it should
        // bubble up to this model and notify its watchers too.
        if (this['_' + name] === value) {
          return;
        }

        this['_' + name] = value;

        this.notify(name);
      };

      Object.defineProperty(this, name, {
        get: options.get || defaultGet,
        set: options.set || defaultSet
      });

      delete options.get;
      delete options.set;

      this['_' + name + 'Options'] = options;

      if (this._values && this._values[name]) {
        this['_' + name] = this._values[name];
      }
    }
  }]);

  return Model;
}(_RingaObject3.default);

exports.default = Model;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaObject2 = __webpack_require__(2);

var _RingaObject3 = _interopRequireDefault(_RingaObject2);

var _Model = __webpack_require__(8);

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
  var i = 0;
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
  return propertyPath.split('.').reduce(function (a, v, i) {
    a[i] = i === 0 ? v : a[i - 1] + '.' + v;
    return a;
  }, []);
}

/**
 * A collection of watches that will be updated in one shot.
 */

var Watchees = function () {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  function Watchees() {
    _classCallCheck(this, Watchees);

    this.watchees = [];
    this.id = Math.random().toString();
  }

  //-----------------------------------
  // Methods
  //-----------------------------------


  _createClass(Watchees, [{
    key: 'add',
    value: function add(model, propertyPath, watchee) {
      var watcheeObj = void 0;

      var arg = {
        model: model,
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
  }, {
    key: 'notify',
    value: function notify() {
      var _this = this;

      var w = this.watchees;
      this.clear();

      w.forEach(function (watcheeObj) {
        watcheeObj.handler.call(undefined, watcheeObj.arg);
        delete watcheeObj.handler.__watchees[_this.id];
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      globalWatchee = undefined;
    }
  }]);

  return Watchees;
}();

var globalWatchee = void 0;
var timeoutToken = void 0;

/**
 * This ModelWatcher watches for a model by id, Class/prototype in heirarchy, or name.
 */

var ModelWatcher = function (_RingaObject) {
  _inherits(ModelWatcher, _RingaObject);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  function ModelWatcher(name, id) {
    _classCallCheck(this, ModelWatcher);

    var _this2 = _possibleConstructorReturn(this, (ModelWatcher.__proto__ || Object.getPrototypeOf(ModelWatcher)).call(this, name, id));

    _this2.idNameToWatchees = {};
    _this2.classToWatchees = new Map();

    _this2.models = [];
    _this2.idToModel = new WeakMap();
    _this2.nameToModel = new WeakMap();
    _this2.classToModel = new WeakMap();
    return _this2;
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


  _createClass(ModelWatcher, [{
    key: 'addModel',
    value: function addModel(model) {
      if (!(model instanceof _Model2.default)) {
        throw new Error('ModelWatcher::addModel(): the provided model ' + model.constructor.name + ' was not a valid Ringa Model!');
      }

      if (this.nameToModel[model.name]) {
        throw new Error('ModelWatcher::addModel(): a Model with the name ' + model.name + ' has already been watched!');
      }

      this.models.push(model);

      this.idToModel[model.id] = model;
      this.nameToModel[model.name] = model;

      var p = model.constructor;

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

  }, {
    key: 'find',
    value: function find(classOrIdOrName) {
      var propertyPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      var model = void 0;

      // By ID (e.g. 'myModel' or 'constructor_whatever')
      if (typeof classOrIdOrName === 'string' && this.idToModel[classOrIdOrName]) {
        model = this.idToModel[classOrIdOrName];
      }if (typeof classOrIdOrName === 'string' && this.nameToModel[classOrIdOrName]) {
        model = this.nameToModel[classOrIdOrName];
      } else {
        // By Type (e.g. MyModel, MyModelBase, MyModelAbstract, etc.)
        var p = classOrIdOrName;

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

  }, {
    key: 'watch',
    value: function watch(classOrIdOrName, propertyPath) {
      var handler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      // If handler is second property...
      if (typeof propertyPath === 'function') {
        handler = propertyPath;
        propertyPath = undefined;
      }

      var group = void 0;
      var defaultGroup = {
        all: [],
        byPath: {}
      };

      if (typeof classOrIdOrName === 'function') {
        group = this.classToWatchees[classOrIdOrName] = this.classToWatchees[classOrIdOrName] || defaultGroup;
      } else if (typeof classOrIdOrName === 'string') {
        group = this.idNameToWatchees[classOrIdOrName] = this.idNameToWatchees[classOrIdOrName] || defaultGroup;
      } else if (true) {
        throw new Error('ModelWatcher::watch(): can only watch by Class or id');
      }

      var watchee = {
        handler: handler,
        propertyPath: propertyPath
      };

      if (!propertyPath) {
        group.all.push(watchee);
      } else {
        var paths = pathAll(propertyPath);

        paths.forEach(function (path) {
          group.byPath[path] = group.byPath[path] || [];
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

  }, {
    key: 'notify',
    value: function notify(model, propertyPath) {
      var foundAtLeastOneWatchee = false;

      if (!globalWatchee) {
        globalWatchee = new Watchees();
      }

      var n = globalWatchee;
      var paths = void 0,
          byPathFor = function byPathFor() {};

      var addWatchee = function addWatchee(watchee) {
        foundAtLeastOneWatchee = true;

        n.add(model, propertyPath, watchee);
      };

      var watcheeGroup = function watcheeGroup(watchees) {
        watchees.all.forEach(addWatchee);
        byPathFor(watchees.byPath);
      };

      if (propertyPath) {
        paths = pathAll(propertyPath);

        byPathFor = function byPathFor(watcheesByPath) {
          // If an watchee has requested 'when.harry.met.sally' there is no point to call for 'when.harry.met', 'when.harry',
          // or 'when'. So we go backwards through the array. I would do paths.reverse() but, well, performance and all.
          for (var i = paths.length - 1; i >= 0; i--) {
            var path = paths[i];
            if (watcheesByPath[path]) {
              watcheesByPath[path].forEach(addWatchee);
              break;
            }
          }
        };
      } else {
        // Well, its a little insane, but if a propertyPath isn't specified, we just notify everyone.
        // TODO: This is where we should do some performance metrics so developers don't write code that has massive
        // performance hits because every handler gets notified at once.
        byPathFor = function byPathFor(watcheesByPath) {
          for (var key in watcheesByPath) {
            watcheesByPath[key].forEach(addWatchee);
          }
        };
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
      var p = model.constructor;

      while (p) {
        if (this.classToWatchees[p]) {
          watcheeGroup(this.classToWatchees[p]);
        }

        p = p.__proto__;
      }

      if (timeoutToken || !foundAtLeastOneWatchee) {
        return;
      }

      timeoutToken = setTimeout(function () {
        timeoutToken = undefined;
        globalWatchee.notify();
      }, 0);
    }
  }]);

  return ModelWatcher;
}(_RingaObject3.default);

exports.default = ModelWatcher;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaEvent = __webpack_require__(6);

var _RingaEvent2 = _interopRequireDefault(_RingaEvent);

var _ringaEvent = __webpack_require__(14);

var _function = __webpack_require__(4);

var _executors = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RingaEventFactory = function () {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  function RingaEventFactory(eventType, detail, domNode) {
    var requireCatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var bubbles = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var cancellable = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

    _classCallCheck(this, RingaEventFactory);

    this.eventType = eventType;
    this.detailOrig = detail;
    this.domNode = domNode;
    this.bubbles = true;
    this.cancellable = true;
    this.requireCatch = requireCatch;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------


  _createClass(RingaEventFactory, [{
    key: 'build',
    value: function build(executor) {
      var detail = void 0;

      if (typeof this.detailOrig === 'function') {
        var argNames = (0, _function.getArgNames)(this.detailOrig);
        var args = (0, _executors.buildArgumentsFromRingaEvent)(executor, argNames, executor.ringaEvent);
        detail = this.detailOrig.apply(undefined, args);
      } else {
        detail = this.detailOrig;
      }

      var newDetail = (0, _ringaEvent.mergeRingaEventDetails)(executor.ringaEvent, detail, executor.controller.options.warnOnDetailOverwrite);

      newDetail._executor = executor;
      newDetail.requireCatch = this.requireCatch;

      return new _RingaEvent2.default(this.eventType, newDetail, this.bubbles, this.cancellable);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'RingaEventFactory_' + this.eventType;
    }
  }]);

  return RingaEventFactory;
}();

exports.default = RingaEventFactory;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaHashArray2 = __webpack_require__(13);

var _RingaHashArray3 = _interopRequireDefault(_RingaHashArray2);

var _Thread = __webpack_require__(35);

var _Thread2 = _interopRequireDefault(_Thread);

var _ExecutorFactory = __webpack_require__(5);

var _ExecutorFactory2 = _interopRequireDefault(_ExecutorFactory);

var _type = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ThreadFactory = function (_RingaHashArray) {
  _inherits(ThreadFactory, _RingaHashArray);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  function ThreadFactory(name, executorFactories, options) {
    _classCallCheck(this, ThreadFactory);

    var _this = _possibleConstructorReturn(this, (ThreadFactory.__proto__ || Object.getPrototypeOf(ThreadFactory)).call(this, name || 'commandFactory'));

    options = options || {};
    options.synchronous = options.synchronous === undefined ? false : options.synchronous;

    var addOne = _this._hashArray.addOne;
    _this._hashArray.addOne = function (obj) {
      if (!obj) {
        console.error('ThreadFactory():: Attempting to add an empty executee to \'' + name + '\'! This probably happened because you attempted to add an event (e.g. SomeController.MY_EVENT) before SomeController::addListener(\'myEvent\') was called. Or the event just does not exist. Or you passed in undefined in a moment of intellectual struggle.', executorFactories);
      }

      obj = (0, _type.wrapIfNotInstance)(obj, _ExecutorFactory2.default);

      addOne.call(this, obj);
    };

    if (executorFactories) {
      _this.addAll(executorFactories);
    }

    _this.threadId = 0;
    return _this;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------


  _createClass(ThreadFactory, [{
    key: 'build',
    value: function build(ringaEvent) {
      if (true && !this.controller) {
        throw Error('ThreadFactory::build(): controller was not set before the build method was called.');
      }

      var commandThread = new _Thread2.default(this.id + '_Thread' + this.threadId, this);

      this.threadId++;

      return commandThread;
    }
  }]);

  return ThreadFactory;
}(_RingaHashArray3.default);

exports.default = ThreadFactory;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(26);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hasharray = __webpack_require__(12);

var _hasharray2 = _interopRequireDefault(_hasharray);

var _RingaObject2 = __webpack_require__(2);

var _RingaObject3 = _interopRequireDefault(_RingaObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This is a proxy class for HashArray that extends RingaObject.
 */
var RingaHashArray = function (_RingaObject) {
  _inherits(RingaHashArray, _RingaObject);

  function RingaHashArray() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[name]';
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';
    var changeHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

    _classCallCheck(this, RingaHashArray);

    var _this = _possibleConstructorReturn(this, (RingaHashArray.__proto__ || Object.getPrototypeOf(RingaHashArray)).call(this, name));

    _this._hashArray = new _hasharray2.default(key, changeHandler, options);
    return _this;
  }

  _createClass(RingaHashArray, [{
    key: 'add',
    value: function add() {
      var _hashArray;

      return (_hashArray = this._hashArray).add.apply(_hashArray, arguments);
    }
  }, {
    key: 'addAll',
    value: function addAll() {
      var _hashArray2;

      return (_hashArray2 = this._hashArray).addAll.apply(_hashArray2, arguments);
    }
  }, {
    key: 'addMap',
    value: function addMap() {
      var _hashArray3;

      return (_hashArray3 = this._hashArray).addMap.apply(_hashArray3, arguments);
    }
  }, {
    key: 'addOne',
    value: function addOne() {
      var _hashArray4;

      return (_hashArray4 = this._hashArray).addOne.apply(_hashArray4, arguments);
    }
  }, {
    key: 'get',
    value: function get() {
      var _hashArray5;

      return (_hashArray5 = this._hashArray).get.apply(_hashArray5, arguments);
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      var _hashArray6;

      return (_hashArray6 = this._hashArray).getAll.apply(_hashArray6, arguments);
    }
  }, {
    key: 'getAsArray',
    value: function getAsArray() {
      var _hashArray7;

      return (_hashArray7 = this._hashArray).getAsArray.apply(_hashArray7, arguments);
    }
  }, {
    key: 'sample',
    value: function sample() {
      var _hashArray8;

      return (_hashArray8 = this._hashArray).sample.apply(_hashArray8, arguments);
    }
  }, {
    key: 'remove',
    value: function remove() {
      var _hashArray9;

      return (_hashArray9 = this._hashArray).remove.apply(_hashArray9, arguments);
    }
  }, {
    key: 'removeByKey',
    value: function removeByKey() {
      var _hashArray10;

      return (_hashArray10 = this._hashArray).removeByKey.apply(_hashArray10, arguments);
    }
  }, {
    key: 'removeAll',
    value: function removeAll() {
      var _hashArray11;

      return (_hashArray11 = this._hashArray).removeAll.apply(_hashArray11, arguments);
    }
  }, {
    key: 'intersection',
    value: function intersection() {
      var _hashArray12;

      return (_hashArray12 = this._hashArray).intersection.apply(_hashArray12, arguments);
    }
  }, {
    key: 'complement',
    value: function complement() {
      var _hashArray13;

      return (_hashArray13 = this._hashArray).complement.apply(_hashArray13, arguments);
    }
  }, {
    key: 'has',
    value: function has() {
      var _hashArray14;

      return (_hashArray14 = this._hashArray).has.apply(_hashArray14, arguments);
    }
  }, {
    key: 'hasMultiple',
    value: function hasMultiple() {
      var _hashArray15;

      return (_hashArray15 = this._hashArray).hasMultiple.apply(_hashArray15, arguments);
    }
  }, {
    key: 'collides',
    value: function collides() {
      var _hashArray16;

      return (_hashArray16 = this._hashArray).collides.apply(_hashArray16, arguments);
    }
  }, {
    key: 'forEach',
    value: function forEach() {
      var _hashArray17;

      return (_hashArray17 = this._hashArray).forEach.apply(_hashArray17, arguments);
    }
  }, {
    key: 'forEachDeep',
    value: function forEachDeep() {
      var _hashArray18;

      return (_hashArray18 = this._hashArray).forEachDeep.apply(_hashArray18, arguments);
    }
  }, {
    key: 'sum',
    value: function sum() {
      var _hashArray19;

      return (_hashArray19 = this._hashArray).sum.apply(_hashArray19, arguments);
    }
  }, {
    key: 'average',
    value: function average() {
      var _hashArray20;

      return (_hashArray20 = this._hashArray).average.apply(_hashArray20, arguments);
    }
  }, {
    key: 'filter',
    value: function filter() {
      var _hashArray21;

      return (_hashArray21 = this._hashArray).filter.apply(_hashArray21, arguments);
    }
  }, {
    key: 'objectAt',
    value: function objectAt() {
      var _hashArray22;

      return (_hashArray22 = this._hashArray).objectAt.apply(_hashArray22, arguments);
    }
  }, {
    key: 'clone',
    value: function clone() {
      var _hashArray23;

      return (_hashArray23 = this._hashArray).clone.apply(_hashArray23, arguments);
    }
  }, {
    key: 'all',
    get: function get() {
      return this._hashArray._list;
    }
  }]);

  return RingaHashArray;
}(_RingaObject3.default);

exports.default = RingaHashArray;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeRingaEventDetails = mergeRingaEventDetails;
function mergeRingaEventDetails(ringaEvent, detail) {
  var warnOnOverwrite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var nextDetail = Object.assign({}, detail); // Make sure we clone!!
  var prevDetail = ringaEvent.detail || {};

  for (var key in prevDetail) {
    if (prevDetail.hasOwnProperty(key)) {
      if (true && nextDetail[key] !== undefined && (warnOnOverwrite || ringaEvent.debug)) {
        console.warn("mergeRingaEventDetails(): overwriting property '" + key + "' on " + ringaEvent + ".\n" + ("Old value: " + prevDetail[key] + "\n") + ("New value: " + nextDetail[key] + "\n"));
      }
      if (nextDetail[key] === undefined) {
        nextDetail[key] = prevDetail[key];
      }
    }
  }
  ringaEvent.detail = nextDetail;
  return nextDetail;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.busses = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaObject2 = __webpack_require__(2);

var _RingaObject3 = _interopRequireDefault(_RingaObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Used to auto-generate non-conflicting Bus ids as the application runs.
 *
 * @type {{count: number}}
 */
var busses = exports.busses = {
  count: 0
};

/**
 * Basic event bus implementation that works with Ringa.
 *
 * Due to the ability to structure Busses in a tree, this can handle bubbling and capture phases.
 *
 * Note: the methods of this Class are designed to match the spec for EventTarget in the DOM.
 */

var Bus = function (_RingaObject) {
  _inherits(Bus, _RingaObject);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  function Bus(id) {
    _classCallCheck(this, Bus);

    var _this = _possibleConstructorReturn(this, (Bus.__proto__ || Object.getPrototypeOf(Bus)).call(this, id || 'bus' + busses.count++));

    _this._map = {};
    _this._captureMap = {};

    _this.children = [];
    _this.parent = undefined;
    return _this;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Adds a child to this Bus.
   *
   * @param bus The bus to add as a child.
   */


  _createClass(Bus, [{
    key: 'addChild',
    value: function addChild(bus) {
      if (bus.parent) {
        throw new Error('Cannot add a Bus that has a child that already has a parent: \'' + bus.id + '\'');
      }

      bus.parent = this;
      this.children.push(bus);
    }
  }, {
    key: 'removeChild',
    value: function removeChild(bus) {
      var ix = void 0;
      if ((ix = this.children.indexOf(bus)) !== -1) {
        var child = this.children[ix];
        this.children.splice(ix, 1);
        child.parent = undefined;
      }
    }
  }, {
    key: 'getChildAt',
    value: function getChildAt(index) {
      return this.children[index];
    }

    /**
     * Adds an event listener handler for a particular event type.
     *
     * @param type The type of event
     * @param handler The handling function
     */

  }, {
    key: 'addEventListener',
    value: function addEventListener(type, handler) {
      var isCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var map = isCapture ? this._captureMap : this._map;

      map[type] = map[type] || [];
      map[type].push(handler);
    }

    /**
     * Returns true if there is at least one handler for the provided type.
     *
     * @param type Event type.
     * @returns {*} True if the event type has an associated handler.
     */

  }, {
    key: 'hasListener',
    value: function hasListener(type) {
      return !!this._map[type];
    }

    /**
     * Removes the specific handler associated with the provided event type.
     *
     * @param type Event type.
     * @param handler The handling function to remove.
     */

  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, handler) {
      if (this._map[type]) {
        var ix = this._map[type].indexOf(handler);
        if (ix !== -1) {
          this._map[type].splice(ix, 1);
        }
      }
    }

    /**
     * Dispatches an event on this bus.
     *
     * @param event A RingaEvent or similar.
     */

  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(event) {
      // Capture Phase
      if (this.parent) {
        var pStack = [this.parent];

        while (pStack[0].parent) {
          pStack.unshift(pStack[0].parent);
        }

        pStack.forEach(function (p) {
          p._dispatch(event, true);
        });
      }

      // Local
      this._dispatch(event);

      // Bubble Phase
      var p = this.parent;

      while (p) {
        p._dispatch(event);
        p = p.parent;
      }
    }

    /**
     * Internal dispatch that handles propagating an event to this Bus's immediate listeners.
     *
     * @param event The event to dispatch
     * @private
     */

  }, {
    key: '_dispatch',
    value: function _dispatch(event, capturePhase) {
      var map = capturePhase ? this._captureMap : this._map;

      if (map[event.type]) {
        map[event.type].forEach(function (handler) {
          handler(event);
        });
      }
    }
  }]);

  return Bus;
}(_RingaObject3.default);

exports.default = Bus;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ThreadFactory = __webpack_require__(11);

var _ThreadFactory2 = _interopRequireDefault(_ThreadFactory);

var _RingaObject2 = __webpack_require__(2);

var _RingaObject3 = _interopRequireDefault(_RingaObject2);

var _hasharray = __webpack_require__(12);

var _hasharray2 = _interopRequireDefault(_hasharray);

var _RingaEvent = __webpack_require__(6);

var _RingaEvent2 = _interopRequireDefault(_RingaEvent);

var _ModelWatcher = __webpack_require__(9);

var _ModelWatcher2 = _interopRequireDefault(_ModelWatcher);

var _snakeCase = __webpack_require__(33);

var _snakeCase2 = _interopRequireDefault(_snakeCase);

var _executors = __webpack_require__(1);

var _function = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Controller is the hub that links event types through a bus (e.g. a DOM node) to an async executor tree.
 */
var Controller = function (_RingaObject) {
  _inherits(Controller, _RingaObject);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructs a new controller.
   *
   * @param id The id of this controller, primarily used for internal hashes and debugging. Must be unique.
   * @param bus The native browser DOMNode element (not a React Node) to attach event listeners to OR a custom event bus.
   * @param options See documentation on Controller options. Defaults are provided, so this is optional.
   */
  function Controller(name, bus, options) {
    _classCallCheck(this, Controller);

    // We want to error if bus is defined but is not actually a bus.
    // If Bus is an object, though, and options is undefined, this means
    // the user is probably doing this:
    // new Controller('id', {options: true});
    // And skipping providing a bus, and that is okay.
    var _this = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this, name));

    if (bus && !(typeof bus.addEventListener === 'function')) {
      if (true && options) {
        throw Error('Controller(): invalid bus or DOM node passed into constructor!');
      }

      options = bus;
    }

    _this.bus = bus;
    _this.modelWatcher = undefined;

    _this.options = options || {};
    _this.options.timeout = _this.options.timeout || 5000;
    _this.options.throwKillsThread = _this.options.throwKillsThread === undefined ? true : _this.options.throwKillsThread;
    _this.options.consoleLogFails = _this.options.consoleLogFails === undefined ? true : _this.options.consoleLogFails;
    _this.options.injections = _this.options.injections || {};
    _this.options.warnOnDetailOverwrite = _this.options.warnOnDetailOverwrite === undefined ? false : _this.options.warnOnDetailOverwrite;

    _this.threads = new _hasharray2.default('id');

    _this.eventTypeToThreadFactory = new Map();
    _this.eventTypeToWatchers = new Map();
    _this.watcherToArgNames = new Map();

    _this._eventHandler = _this._eventHandler.bind(_this);
    return _this;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------


  _createClass(Controller, [{
    key: 'addModel',


    //-----------------------------------
    // Methods
    //-----------------------------------
    /**
     * Special method that attaches a model to this Controller through a ModelWatcher.
     *
     * At the time this was built, it was only functional to support injection for the react-ringa project and dependency
     * injection.
     *
     * If no internal ModelWatcher exists, the Controller builds one and then adds the model to that watcher.
     *
     * This method also adds the model as an injection by the models id to be available to all executors.
     *
     * @param model An instance that must be an extension of the Ringa.Model class.
     * @parma injectionId A custom name to use for the injection id if you don't want to use the default one on the Model.
     */
    value: function addModel(model) {
      var injectionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      if (!this.modelWatcher) {
        this.modelWatcher = new _ModelWatcher2.default(this.id + '_ModelWatcher');
      }

      this.modelWatcher.addModel(model, injectionId);

      this.injections[injectionId || model.id] = model;
      this.injections[model.name] = model;
    }

    /**
     * Called when there is safely an event bus to attach events to. This is where you could redispatch certain initialization
     * events.
     */

  }, {
    key: 'busMounted',
    value: function busMounted(bus) {}
    // To be overridden


    /**
     * Takes in a series of event types and converts them to static properties on the parent class.
     *
     * For example:
     *
     *   controller = new MyController();
     *   controller.addEventTypeStatics(['my event', 'otherEvent', 'YAY']);
     *
     *   MyController.MY_EVENT === 'my event';
     *   MyController.OTHER_EVENT = 'otherEvent'
     *   MyController.YAY = 'YAY;
     *
     * @param types An array of event types.
     */

  }, {
    key: 'addEventTypeStatics',
    value: function addEventTypeStatics(types) {
      var _this2 = this;

      types.forEach(function (type) {
        var TYPE_SNAKE_CASE = (0, _snakeCase2.default)(type).toUpperCase();

        if (_this2.constructor[TYPE_SNAKE_CASE]) {
          return;
        }

        _this2.constructor[TYPE_SNAKE_CASE] = _this2[TYPE_SNAKE_CASE] = type;
      });
    }

    /**
     * Returns the ThreadFactory associated with the provided eventType.
     *
     * @param eventType The event type - a String.
     * @returns {ThreadFactory} The ThreadFactory associated with the eventType.
     */

  }, {
    key: 'getThreadFactoryFor',
    value: function getThreadFactoryFor(eventType) {
      return this.eventTypeToThreadFactory[eventType];
    }

    /**
     * Listens for the event type on the attached event bus (or DOM node) and runs the provided executor or async tree.
     *
     * See online documentation for more details.
     *
     * @param eventType The event type, expected to be a String.
     * @param executor A single executor (function, event type, Promise, Ringa Command) or an array of these.
     * @param useCapture True if you want to use capture to listen to the event.
     * @returns {*} The ThreadFactory instance that will be run when the event is received.
     */

  }, {
    key: 'addListener',
    value: function addListener(eventType, executor, useCapture) {
      var threadFactory = void 0;

      if (true && arguments[2] && typeof arguments[2] !== 'boolean') {
        throw Error('Controller::addListener(): you provided a third argument which was not a boolean for useCapture (was ' + useCapture + '). This does nothing and probably means you forgot to wrap your second executor in an array.');
      }

      if (executor && !(executor instanceof _ThreadFactory2.default) && !(executor instanceof Array)) {
        executor = [executor];
      }

      if (!executor || executor instanceof Array) {
        threadFactory = new _ThreadFactory2.default(this.id + '_' + eventType + '_ThreadFactory', executor);
      } else if (executor instanceof _ThreadFactory2.default) {
        threadFactory = executor;
      } else if (true) {
        throw Error('Controller::addListener(): the provided executor is not valid! Did you forget to wrap in []?');
      }

      if (true && !threadFactory || !(threadFactory instanceof _ThreadFactory2.default)) {
        throw Error('Controller::addListener(): threadFactory not an instance of ThreadFactory');
      }

      if (true && threadFactory.controller) {
        throw Error('Controller::addListener(): threadFactory cannot have two parent controllers!');
      }

      if (true && this.eventTypeToThreadFactory[eventType]) {
        throw Error('Controller.addListener(): the event \'' + eventType + '\' has already been added! Use getThreadFactoryFor() to make modifications.');
      }

      this.addEventTypeStatics([eventType]);

      threadFactory.controller = this;

      this.eventTypeToThreadFactory[eventType] = threadFactory;

      this._attachListenerToBus(eventType, useCapture);

      return threadFactory;
    }
  }, {
    key: '_attachListenerToBus',
    value: function _attachListenerToBus(eventType, useCapture) {
      if (!this.bus) {
        return; // We will be attached once the bus comes in to the station.
      }

      if (typeof eventType === 'string') {
        this.bus.addEventListener(eventType, this._eventHandler, useCapture);
      } else {
        var _eventType = undefined;

        if (eventType.hasOwnProperty('toString')) {
          _eventType = eventType.toString();
        }

        if (_eventType) {
          this.bus.addEventListener(_eventType, this._eventHandler.bind(this));
        } else {
          throw Error('Controller::addListener(): provided eventType is invalid.', eventType);
        }
      }
    }
  }, {
    key: 'removeAllListeners',
    value: function removeAllListeners() {
      for (var eventType in this.eventTypeToThreadFactory) {
        this.removeListener(eventType);
      }
    }
  }, {
    key: 'detachAllListeners',
    value: function detachAllListeners() {
      if (this.bus) {
        for (var eventType in this.eventTypeToThreadFactory) {
          this.bus.removeEventListener(eventType, this._eventHandler);
        }
      }
    }
  }, {
    key: 'attachAllListeners',
    value: function attachAllListeners() {
      for (var eventType in this.eventTypeToThreadFactory) {
        this._attachListenerToBus(eventType);
      }
    }

    /**
     * Safely removes an event listener for a particular event type.
     *
     * @param eventType The event type to remove.
     * @returns {*} The ThreadFactory that the event type used to trigger.
     */

  }, {
    key: 'removeListener',
    value: function removeListener(eventType) {
      var threadFactory = this.eventTypeToThreadFactory[eventType];

      if (threadFactory) {
        delete this.eventTypeToThreadFactory[eventType];

        this.bus.removeEventListener(eventType, this._eventHandler);

        return threadFactory;
      }

      if (true) {
        throw Error('Controller:removeListener(): could not find a listener for \'' + eventType + '\'', this);
      }
    }

    /**
     * Returns true if the event bus (or DOM node) that this controller is attached to has a listener for the provided
     * event type.
     *
     * @param eventType The event type
     * @returns {boolean} True if the bus says it has a listener for the provided event type.
     */

  }, {
    key: 'isListening',
    value: function isListening(eventType) {
      if (this.bus && this.bus.hasListener) {
        return this.bus.hasListener(eventType);
      } else if (this.bus) {
        // Kinda risky, but there is no built-in way on DOM node to see if an event has been attached
        // without working some magic by overriding addEventListener or using jQuery, which we shall
        // not do because we are not barbarians.
        return true;
      }

      return false;
    }

    /**
     * Returns true if addListener has been called for the provided eventType. Note this will return true even if the bus
     * is not set.
     *
     * @param eventType The event type
     * @returns {boolean} True if addListener has been called with the provided event.
     */

  }, {
    key: 'hasListener',
    value: function hasListener(eventType) {
      return this.getThreadFactoryFor(eventType) !== undefined;
    }

    /**
     * Attaches a RingaEvent to a ThreadFactory and runs the ThreadFactory.
     *
     * @param ringaEvent A RingaEvent instance, properly initialized.
     * @param threadFactory A ThreadFactory instance, properly initialized.
     * @returns {*}
     */

  }, {
    key: 'invoke',
    value: function invoke(ringaEvent, threadFactory) {
      var thread = threadFactory.build(ringaEvent);

      this.threads.add(thread);

      ringaEvent._threads.push(thread);

      ringaEvent._dispatchEvent(_RingaEvent2.default.PREHOOK);

      // TODO PREHOOK should allow the handler to cancel running of the thread.
      thread.run(ringaEvent, this.threadDoneHandler.bind(this), this.threadFailHandler.bind(this));

      return thread;
    }

    //-----------------------------------
    // Events
    //-----------------------------------

  }, {
    key: '_eventHandler',
    value: function _eventHandler(event) {
      if (event instanceof _RingaEvent2.default) {
        return this.__eventHandler(event);
      }

      var ringaEvent = void 0;

      // This event might be a something like 'click' which does not have
      // an attached ringaEvent yet!
      if (!event.detail.ringaEvent) {
        ringaEvent = new _RingaEvent2.default(event.type, _typeof(event.detail) === 'object' ? event.detail : {}, event.bubbles, event.cancellable, event);

        if (_typeof(event.detail) === 'object') {
          event.detail.ringaEvent = ringaEvent;
        }
      } else {
        ringaEvent = event.detail.ringaEvent;
      }

      return this.__eventHandler(ringaEvent);
    }
  }, {
    key: '__eventHandler',
    value: function __eventHandler(ringaEvent) {
      var threadFactory = this.eventTypeToThreadFactory[ringaEvent.type];

      ringaEvent._caught(this);

      if (true && !threadFactory) {
        throw Error('Controller::__eventHandler(): caught an event but there is no associated ThreadFactory! Fatal error.');
      }

      var abort = void 0;
      try {
        abort = this.preInvokeHandler(ringaEvent);
      } catch (error) {
        // At this point we don't have a thread yet, so this is all kinds of whack.
        if (this.options.consoleLogFails) {
          console.error(error);
        }

        ringaEvent._fail(this, error, true);
      }

      if (abort === true) {
        return;
      }

      var thread = void 0;

      try {
        thread = this.invoke(ringaEvent, threadFactory);

        this.postInvokeHandler(ringaEvent, thread);
      } catch (error) {
        this.threadFailHandler(thread, error);
      }
    }
  }, {
    key: 'preInvokeHandler',
    value: function preInvokeHandler(ringaEvent) {
      // Can be extended by a subclass
      return false;
    }
  }, {
    key: 'postInvokeHandler',
    value: function postInvokeHandler(ringaEvent, thread) {
      // Can be extended by a subclass
    }
  }, {
    key: 'threadDoneHandler',
    value: function threadDoneHandler(thread) {
      if (true && !this.threads.has(thread.id)) {
        throw Error('Controller::threadDoneHandler(): could not find thread with id ' + thread.id);
      }

      this.threads.remove(thread);

      this.notify(thread.ringaEvent);

      thread.ringaEvent._done(this);
    }
  }, {
    key: 'threadFailHandler',
    value: function threadFailHandler(thread, error, kill) {
      if (this.options.consoleLogFails) {
        console.error(error, 'In thread ' + (thread ? thread.toString() : ''));
      }

      if (kill) {
        if (this.threads.has(thread.id)) {
          this.threads.remove(thread);
        } else if (true) {
          throw Error('Controller:threadFailHandler(): the CommandThread with the id ' + thread.id + ' was not found.');
        }
      }

      thread.ringaEvent._fail(this, error, kill);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(eventType, details) {
      if (!this.bus) {
        throw new Error('Controller::dispatch(): bus has not yet been set so you cannot dispatch (\'' + eventType + '\')! Wait for Controller::busMounted().');
      }

      return new _RingaEvent2.default(eventType, details).dispatch(this.bus);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.id;
    }
  }, {
    key: 'notify',
    value: function notify(ringaEvent, eventType) {
      var _this3 = this;

      eventType = eventType || ringaEvent.type;

      var watchers = this.eventTypeToWatchers[eventType];
      if (watchers && watchers.length) {
        (function () {
          var executor = {
            controller: _this3,
            toString: function toString() {
              return 'Controller::watch() for ' + eventType;
            }
          };

          watchers.forEach(function (watcher) {
            var argNames = _this3.watcherToArgNames[watcher];
            var args = (0, _executors.buildArgumentsFromRingaEvent)(executor, argNames, ringaEvent);

            watcher.apply(undefined, args);
          });
        })();
      }
    }
  }, {
    key: 'watch',
    value: function watch(eventTypes, injectableCallback) {
      var _this4 = this;

      if (true && !(eventTypes instanceof Array)) {
        throw new Error('Controller::watch(): eventTypes is not an Array!');
      }

      eventTypes.forEach(function (eventType) {
        _this4.eventTypeToWatchers[eventType] = _this4.eventTypeToWatchers[eventType] || [];
        _this4.eventTypeToWatchers[eventType].push(injectableCallback);
        _this4.watcherToArgNames[injectableCallback] = (0, _function.getArgNames)(injectableCallback);
      });
    }
  }, {
    key: 'unwatch',
    value: function unwatch(eventTypes, injectableCallback) {
      var _this5 = this;

      if (true && !(eventTypes instanceof Array)) {
        throw new Error('Controller::watch(): eventTypes is not an Array!');
      }

      var ix = void 0;

      eventTypes.forEach(function (eventType) {
        if ((ix = _this5.eventTypeToWatchers[eventType].indexOf(injectableCallback)) !== -1) {
          _this5.eventTypeToWatchers[eventType].splice(ix, 1);
        }
      });
    }
  }, {
    key: 'injections',
    get: function get() {
      return this.options.injections;
    }
  }, {
    key: 'bus',
    set: function set(value) {
      var _this6 = this;

      // If someone tries to reset the same bus, just ignore it because it would be dumb to detach all the listeners
      // and reattach them.
      if (this._bus === value) {
        return;
      }

      // If we are switching busses, we need to remove the listeners from the old bus
      if (this._bus) {
        this.detachAllListeners();
      }

      this._bus = value;

      // If the developer has called to attach previous listeners we need to make sure all of those
      // get attached now to our new bus.
      if (this._bus) {
        this.attachAllListeners();

        // We want to wait here. The reason is that if someone dispatches an event in the busMounted section
        // we want to make sure that all other Controllers within the same context in the dom have also
        // had time to mount before secondary events might be dispatched.
        setTimeout(function () {
          _this6.busMounted(_this6.bus);
        }, 0);
      }
    },
    get: function get() {
      return this._bus;
    }
  }]);

  return Controller;
}(_RingaObject3.default);

exports.default = Controller;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ExecutorAbstract2 = __webpack_require__(0);

var _ExecutorAbstract3 = _interopRequireDefault(_ExecutorAbstract2);

var _executors = __webpack_require__(1);

var _function = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Command is the base class for all command objects that are run in a Ringa application or module.
 */
var Command = function (_ExecutorAbstract) {
  _inherits(Command, _ExecutorAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param thread The parent thread that owns this command.
   */
  function Command(thread) {
    _classCallCheck(this, Command);

    var _this = _possibleConstructorReturn(this, (Command.__proto__ || Object.getPrototypeOf(Command)).call(this, thread));

    _this.cacheable = true;
    return _this;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------


  _createClass(Command, [{
    key: '_execute',


    //-----------------------------------
    // Methods
    //-----------------------------------

    /**
     * Internal execution method called by CommandThread only.
     *
     * @param doneHandler The handler to call when done() is called.
     * @param failHandler The handler to call when fail() is called;
     * @private
     */
    value: function _execute(doneHandler, failHandler) {
      var promise = void 0;

      _get(Command.prototype.__proto__ || Object.getPrototypeOf(Command.prototype), '_execute', this).call(this, doneHandler, failHandler);

      var args = (0, _executors.buildArgumentsFromRingaEvent)(this, this.argNames, this.thread.ringaEvent);

      var donePassedAsArg = this.argNames.indexOf('done') !== -1;

      promise = this.execute.apply(this, args);

      if (this.error) {
        return undefined;
      }

      // If the function returns true, we continue on the next immediate cycle assuming it didn't return a promise.
      // If, however the function requested that 'done' be passed, we assume it is an asynchronous
      // function and let the function determine when it will call done.
      if (!promise && !donePassedAsArg) {
        this.done();
      }

      if (promise) {
        this.waitForPromise(promise);
      }

      return promise;
    }

    /**
     * Override this method to provide functionality to the command.
     *
     * @returns {boolean}
     */

  }, {
    key: 'execute',
    value: function execute() {
      // To be overridden by subclass
      return false;
    }

    /**
     * Call this method if an error occurred during the processing of a command.
     *
     * @param error The error that has occurred.
     * @param kill True if you want the thread to die immediately.
     */

  }, {
    key: 'fail',
    value: function fail(error) {
      var kill = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _get(Command.prototype.__proto__ || Object.getPrototypeOf(Command.prototype), 'fail', this).call(this, error, kill);
    }
  }, {
    key: 'cache',
    get: function get() {
      return this._cache || (0, _function.getArgNames)(this.execute);
    },
    set: function set(value) {
      this._cache = value;
      this.argNames = value;
    }
  }]);

  return Command;
}(_ExecutorAbstract3.default);

exports.default = Command;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ExecutorAbstract2 = __webpack_require__(0);

var _ExecutorAbstract3 = _interopRequireDefault(_ExecutorAbstract2);

var _ExecutorFactory = __webpack_require__(5);

var _ExecutorFactory2 = _interopRequireDefault(_ExecutorFactory);

var _type = __webpack_require__(3);

var _executors = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Iterates over an Array found by name via standard injection scope.
 */
var ForEachExecutor = function (_ExecutorAbstract) {
  _inherits(ForEachExecutor, _ExecutorAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new ForEachExecutor.
   *
   * @param {Thread} thread The parent thread that owns this executor.
   * @param {Array} arrayProperty The property (found via the available injections) to do a forEach on.
   * @param {string} property The name property for each element in the loop to add to the event detail for the executor.
   * @param {*} executor  The Ringa executor to run for each item.
   * @param {bool} [sequential = true] True if we should wait for each previous executor to run before running the next.
   */
  function ForEachExecutor(thread, _ref) {
    var arrayProperty = _ref.arrayProperty,
        property = _ref.property,
        executor = _ref.executor,
        _ref$sequential = _ref.sequential,
        sequential = _ref$sequential === undefined ? true : _ref$sequential;

    _classCallCheck(this, ForEachExecutor);

    var _this = _possibleConstructorReturn(this, (ForEachExecutor.__proto__ || Object.getPrototypeOf(ForEachExecutor)).call(this, thread));

    _this.arrayProperty = arrayProperty;
    _this.property = property;
    _this.executor = executor;
    _this.sequential = sequential;
    return _this;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  /**
   * No timeout for forEach since we have no idea how long our children are going to take.
   *
   * @returns {number}
   */


  _createClass(ForEachExecutor, [{
    key: '_execute',


    //-----------------------------------
    // Methods
    //-----------------------------------
    /**
     * Internal execution method called by Thread only.
     *
     * @param {function} doneHandler The handler to call when done() is called.
     * @param {function} failHandler The handler to call when fail() is called;
     * @private
     */
    value: function _execute(doneHandler, failHandler) {
      var _this2 = this;

      _get(ForEachExecutor.prototype.__proto__ || Object.getPrototypeOf(ForEachExecutor.prototype), '_execute', this).call(this, doneHandler, failHandler);

      var executorFactory = (0, _type.wrapIfNotInstance)(this.executor, _ExecutorFactory2.default);
      var injections = (0, _executors.getInjections)(this.ringaEvent, this);
      var array = injections[this.arrayProperty];

      if (!array) {
        throw new Error('ForEachExecutor::_execute(): Could not find an array with the name ' + this.arrayProperty);
      }

      if (array.length === 0) {
        this.done();
      }

      this.executors = array.map(function (item, ix) {
        var executor = executorFactory.build(_this2.thread);
        executor._injections = {};
        executor._injections[_this2.property] = item;
        return executor;
      });

      if (this.sequential) {
        (function () {
          var ix = 0;

          var _next = function _next() {
            if (ix === _this2.executors.length) {
              return _this2.done();
            }

            _this2.executors[ix]._execute(function () {
              setTimeout(_next, 0);
            }, function (error) {
              var kill = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

              _this2.fail(error, kill);

              if (!kill) {
                _next();
              }
            });

            ix++;
          };

          _next();
        })();
      } else {
        (function () {
          var count = _this2.executors.length;

          var _fin = function _fin() {
            count--;
            if (count === 0) {
              _this2.done();
            }
          };

          var _fail = function _fail(error) {
            var kill = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            _this2.fail(error, kill);

            _fin();
          };

          _this2.executors.forEach(function (executor) {
            executor._execute(_fin, _fail);
          });
        })();
      }
    }
  }, {
    key: 'timeout',
    get: function get() {
      return -1;
    }
  }]);

  return ForEachExecutor;
}(_ExecutorAbstract3.default);

exports.default = ForEachExecutor;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ExecutorAbstract2 = __webpack_require__(0);

var _ExecutorAbstract3 = _interopRequireDefault(_ExecutorAbstract2);

var _ExecutorFactory = __webpack_require__(5);

var _ExecutorFactory2 = _interopRequireDefault(_ExecutorFactory);

var _function = __webpack_require__(4);

var _executors = __webpack_require__(1);

var _type = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IifExecutor = function (_ExecutorAbstract) {
  _inherits(IifExecutor, _ExecutorAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new IifExecutor.
   *
   * @param thread The parent thread that owns this executor.
   * @param condition A callback function whose return value can be truthy or falsey, determining whether to run the trueExecutor or the falseExecutor.
   * @param trueExecutor  The executor run if condition returns a truthy value
   * @param falseExecutor The executor run if condition returns a falsey value
   */
  function IifExecutor(thread, _ref) {
    var condition = _ref.condition,
        trueExecutor = _ref.trueExecutor,
        falseExecutor = _ref.falseExecutor;

    _classCallCheck(this, IifExecutor);

    var _this = _possibleConstructorReturn(this, (IifExecutor.__proto__ || Object.getPrototypeOf(IifExecutor)).call(this, thread));

    _this.condition = condition;
    _this.trueExecutor = trueExecutor;
    _this.falseExecutor = falseExecutor;
    return _this;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------


  _createClass(IifExecutor, [{
    key: '_execute',


    //-----------------------------------
    // Methods
    //-----------------------------------
    /**
     * Internal execution method called by Thread only.
     *
     * @param doneHandler The handler to call when done() is called.
     * @param failHandler The handler to call when fail() is called;
     * @private
     */
    value: function _execute(doneHandler, failHandler) {
      _get(IifExecutor.prototype.__proto__ || Object.getPrototypeOf(IifExecutor.prototype), '_execute', this).call(this, doneHandler, failHandler);

      var argNames = (0, _function.getArgNames)(this.condition);
      var args = (0, _executors.buildArgumentsFromRingaEvent)(this, argNames, this.ringaEvent);
      var conditionResult = this.condition.apply(this, args);
      var executor = !!conditionResult ? this.trueExecutor : this.falseExecutor;

      if (executor) {
        var executorFactory = (0, _type.wrapIfNotInstance)(executor, _ExecutorFactory2.default);

        executorFactory.build(this.thread)._execute(this.done, this.fail);
      } else {
        this.done();
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.id + ': ' + this.condition.toString().substring(0, 64);
    }
  }, {
    key: 'timeout',
    get: function get() {
      return -1;
    }
  }]);

  return IifExecutor;
}(_ExecutorAbstract3.default);

exports.default = IifExecutor;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ExecutorAbstract2 = __webpack_require__(0);

var _ExecutorAbstract3 = _interopRequireDefault(_ExecutorAbstract2);

var _ExecutorFactory = __webpack_require__(5);

var _ExecutorFactory2 = _interopRequireDefault(_ExecutorFactory);

var _function = __webpack_require__(4);

var _executors = __webpack_require__(1);

var _type = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntervalExecutor = function (_ExecutorAbstract) {
  _inherits(IntervalExecutor, _ExecutorAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new IntervalExecutor, which recursively uses the setTimeout function to run an executor repeatedly.
   *
   * @param thread The parent thread that owns this executor.
   * @param condition Interval is halted when this callback returns falsey.
   * @param executor  The executor that runs on every interval
   * @param milliseconds The time between each interval
   * @param options Defaults are provided, so this is optional.
   * @param [options.maxLoops=-1] When maximum loops is exceeded, done() is called on the executor. -1 for no maximum.
   */
  function IntervalExecutor(thread, _ref) {
    var condition = _ref.condition,
        executor = _ref.executor,
        milliseconds = _ref.milliseconds,
        _ref$options = _ref.options,
        options = _ref$options === undefined ? {} : _ref$options;

    _classCallCheck(this, IntervalExecutor);

    var _this = _possibleConstructorReturn(this, (IntervalExecutor.__proto__ || Object.getPrototypeOf(IntervalExecutor)).call(this, thread));

    _this.condition = condition;
    _this.executor = executor;
    _this.executorFactory = (0, _type.wrapIfNotInstance)(executor, _ExecutorFactory2.default);
    _this.milliseconds = milliseconds;
    _this.maxLoops = options.maxLoops || -1;
    _this.loops = 0;
    return _this;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------

  /**
   * Internal execution method called by Thread only.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */


  _createClass(IntervalExecutor, [{
    key: '_execute',
    value: function _execute(doneHandler, failHandler) {
      _get(IntervalExecutor.prototype.__proto__ || Object.getPrototypeOf(IntervalExecutor.prototype), '_execute', this).call(this, doneHandler, failHandler);

      var argNames = (0, _function.getArgNames)(this.condition);
      this.args = (0, _executors.buildArgumentsFromRingaEvent)(this, argNames, this.ringaEvent);

      this._interval();
    }

    /**
     * Internal recursive loop method.  Runs executor every `milliseconds` provided
     * that the condition callback still evaluates truthy and `maxLoops` is not exceeded
     *
     * @private
     */

  }, {
    key: '_interval',
    value: function _interval() {
      this.loops += 1;
      if (!this.condition.apply(this, this.args) || this._hasExceededMaxLoops()) {
        this.done();
      } else {
        this.resetTimeout();
        this.executorFactory.build(this.thread)._execute(this._intervalDone.bind(this), this._intervalFail.bind(this));
        setTimeout(this._interval.bind(this), this.milliseconds);
      }
    }
  }, {
    key: '_hasExceededMaxLoops',
    value: function _hasExceededMaxLoops() {
      return this.maxLoops > -1 && this.loops > this.maxLoops;
    }
  }, {
    key: 'resetTimeout',
    value: function resetTimeout() {
      // TODO: add more intelligent timeout management
      this.endTimeoutCheck();
      this.startTimeoutCheck();
    }
  }, {
    key: '_intervalDone',
    value: function _intervalDone() {
      // TODO: remove or add useful functionality (discuss)
    }
  }, {
    key: '_intervalFail',
    value: function _intervalFail(error, kill) {
      this.fail(error, kill);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.id + ': ' + this.condition.toString().substring(0, 64);
    }
  }]);

  return IntervalExecutor;
}(_ExecutorAbstract3.default);

exports.default = IntervalExecutor;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ExecutorAbstract2 = __webpack_require__(0);

var _ExecutorAbstract3 = _interopRequireDefault(_ExecutorAbstract2);

var _ExecutorFactory = __webpack_require__(5);

var _ExecutorFactory2 = _interopRequireDefault(_ExecutorFactory);

var _type = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SpawnExecutor = function (_ExecutorAbstract) {
  _inherits(SpawnExecutor, _ExecutorAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new SpawnExecutor, which will fire off the executor and call `this.done()` immediately
   *
   * @param thread The parent thread that owns this executor.
   * @param executor The executor to spawn
   */
  function SpawnExecutor(thread, executor) {
    _classCallCheck(this, SpawnExecutor);

    var _this = _possibleConstructorReturn(this, (SpawnExecutor.__proto__ || Object.getPrototypeOf(SpawnExecutor)).call(this, thread));

    _this.executor = executor;
    _this.executorFactory = (0, _type.wrapIfNotInstance)(executor, _ExecutorFactory2.default);
    return _this;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Internal execution method called by Thread only.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */


  _createClass(SpawnExecutor, [{
    key: '_execute',
    value: function _execute(doneHandler, failHandler) {
      _get(SpawnExecutor.prototype.__proto__ || Object.getPrototypeOf(SpawnExecutor.prototype), '_execute', this).call(this, doneHandler, failHandler);

      this.executorFactory.build(this.thread)._execute(this._dummyDone, this._dummyFail);

      this.done();
    }
  }, {
    key: '_dummyDone',
    value: function _dummyDone() {}
  }, {
    key: '_dummyFail',
    value: function _dummyFail(error) {
      throw new Error('SpawnExecutor::_dummyFail(): Error caught from spawned executor', error);
    }
  }]);

  return SpawnExecutor;
}(_ExecutorAbstract3.default);

exports.default = SpawnExecutor;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ExecutorFactory2 = __webpack_require__(5);

var _ExecutorFactory3 = _interopRequireDefault(_ExecutorFactory2);

var _ringaEvent = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AssignFactory = function (_ExecutorFactory) {
  _inherits(AssignFactory, _ExecutorFactory);

  function AssignFactory(executee, detail) {
    _classCallCheck(this, AssignFactory);

    var _this = _possibleConstructorReturn(this, (AssignFactory.__proto__ || Object.getPrototypeOf(AssignFactory)).call(this, executee));

    _this.detail = detail;
    return _this;
  }

  _createClass(AssignFactory, [{
    key: 'build',
    value: function build(thread) {
      (0, _ringaEvent.mergeRingaEventDetails)(thread.ringaEvent, this.detail, thread.controller.options.warnOnDetailOverwrite);

      return _get(AssignFactory.prototype.__proto__ || Object.getPrototypeOf(AssignFactory.prototype), 'build', this).call(this, thread);
    }
  }]);

  return AssignFactory;
}(_ExecutorFactory3.default);

exports.default = AssignFactory;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function preserveCamelCase(str) {
	var isLastCharLower = false;
	var isLastCharUpper = false;
	var isLastLastCharUpper = false;

	for (var i = 0; i < str.length; i++) {
		var c = str.charAt(i);

		if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
			str = str.substr(0, i) + '-' + str.substr(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(c) && c.toLowerCase() === c) {
			str = str.substr(0, i - 1) + '-' + str.substr(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = c.toLowerCase() === c;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = c.toUpperCase() === c;
		}
	}

	return str;
}

module.exports = function () {
	var str = [].map.call(arguments, function (x) {
		return x.trim();
	}).filter(function (x) {
		return x.length;
	}).join('-');

	if (str.length === 0) {
		return '';
	}

	if (str.length === 1) {
		return str.toLowerCase();
	}

	str = preserveCamelCase(str);

	return str.replace(/^[_.\- ]+/, '').toLowerCase().replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
		return p1.toUpperCase();
	});
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

(function (global) {
  'use strict';

  var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|'[^']*'|'[^']*'/g;
    var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
    var timezoneClip = /[^-+\dA-Z]/g;

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc, gmt) {

      // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
      if (arguments.length === 1 && kindOf(date) === 'string' && !/\d/.test(date)) {
        mask = date;
        date = undefined;
      }

      date = date || new Date();

      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      if (isNaN(date)) {
        throw TypeError('Invalid date');
      }

      mask = String(dateFormat.masks[mask] || mask || dateFormat.masks['default']);

      // Allow setting the utc/gmt argument via the mask
      var maskSlice = mask.slice(0, 4);
      if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
        mask = mask.slice(4);
        utc = true;
        if (maskSlice === 'GMT:') {
          gmt = true;
        }
      }

      var _ = utc ? 'getUTC' : 'get';
      var d = date[_ + 'Date']();
      var D = date[_ + 'Day']();
      var m = date[_ + 'Month']();
      var y = date[_ + 'FullYear']();
      var H = date[_ + 'Hours']();
      var M = date[_ + 'Minutes']();
      var s = date[_ + 'Seconds']();
      var L = date[_ + 'Milliseconds']();
      var o = utc ? 0 : date.getTimezoneOffset();
      var W = getWeek(date);
      var N = getDayOfWeek(date);
      var flags = {
        d: d,
        dd: pad(d),
        ddd: dateFormat.i18n.dayNames[D],
        dddd: dateFormat.i18n.dayNames[D + 7],
        m: m + 1,
        mm: pad(m + 1),
        mmm: dateFormat.i18n.monthNames[m],
        mmmm: dateFormat.i18n.monthNames[m + 12],
        yy: String(y).slice(2),
        yyyy: y,
        h: H % 12 || 12,
        hh: pad(H % 12 || 12),
        H: H,
        HH: pad(H),
        M: M,
        MM: pad(M),
        s: s,
        ss: pad(s),
        l: pad(L, 3),
        L: pad(Math.round(L / 10)),
        t: H < 12 ? 'a' : 'p',
        tt: H < 12 ? 'am' : 'pm',
        T: H < 12 ? 'A' : 'P',
        TT: H < 12 ? 'AM' : 'PM',
        Z: gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
        o: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
        W: W,
        N: N
      };

      return mask.replace(token, function (match) {
        if (match in flags) {
          return flags[match];
        }
        return match.slice(1, match.length - 1);
      });
    };
  }();

  dateFormat.masks = {
    'default': 'ddd mmm dd yyyy HH:MM:ss',
    'shortDate': 'm/d/yy',
    'mediumDate': 'mmm d, yyyy',
    'longDate': 'mmmm d, yyyy',
    'fullDate': 'dddd, mmmm d, yyyy',
    'shortTime': 'h:MM TT',
    'mediumTime': 'h:MM:ss TT',
    'longTime': 'h:MM:ss TT Z',
    'isoDate': 'yyyy-mm-dd',
    'isoTime': 'HH:MM:ss',
    'isoDateTime': 'yyyy-mm-dd\'T\'HH:MM:sso',
    'isoUtcDateTime': 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
    'expiresHeaderFormat': 'ddd, dd mmm yyyy HH:MM:ss Z'
  };

  // Internationalization strings
  dateFormat.i18n = {
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };

  function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
      val = '0' + val;
    }
    return val;
  }

  /**
   * Get the ISO 8601 week number
   * Based on comments from
   * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
   *
   * @param  {Object} `date`
   * @return {Number}
   */
  function getWeek(date) {
    // Remove time components of date
    var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Change date to Thursday same week
    targetThursday.setDate(targetThursday.getDate() - (targetThursday.getDay() + 6) % 7 + 3);

    // Take January 4th as it is always in week 1 (see ISO 8601)
    var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

    // Change date to Thursday same week
    firstThursday.setDate(firstThursday.getDate() - (firstThursday.getDay() + 6) % 7 + 3);

    // Check if daylight-saving-time-switch occured and correct for it
    var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
    targetThursday.setHours(targetThursday.getHours() - ds);

    // Number of weeks between target Thursday and first Thursday
    var weekDiff = (targetThursday - firstThursday) / (86400000 * 7);
    return 1 + Math.floor(weekDiff);
  }

  /**
   * Get ISO-8601 numeric representation of the day of the week
   * 1 (for Monday) through 7 (for Sunday)
   * 
   * @param  {Object} `date`
   * @return {Number}
   */
  function getDayOfWeek(date) {
    var dow = date.getDay();
    if (dow === 0) {
      dow = 7;
    }
    return dow;
  }

  /**
   * kind-of shortcut
   * @param  {*} val
   * @return {String}
   */
  function kindOf(val) {
    if (val === null) {
      return 'null';
    }

    if (val === undefined) {
      return 'undefined';
    }

    if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) !== 'object') {
      return typeof val === 'undefined' ? 'undefined' : _typeof(val);
    }

    if (Array.isArray(val)) {
      return 'array';
    }

    return {}.toString.call(val).slice(8, -1).toLowerCase();
  };

  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
      return dateFormat;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = dateFormat;
  } else {
    global.dateFormat = dateFormat;
  }
})(undefined);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */

    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(34)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        module.exports = factory(require('stackframe'));
    } else {
        root.ErrorStackParser = factory(root.StackFrame);
    }
})(undefined, function ErrorStackParser(StackFrame) {
    'use strict';

    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;

    return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        },

        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
            // Fail-fast but return locations like "(native)"
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
            var parts = regExp.exec(urlLike.replace(/[\(\)]/g, ''));
            return [parts[1], parts[2] || undefined, parts[3] || undefined];
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
            var filtered = error.stack.split('\n').filter(function (line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);

            return filtered.map(function (line) {
                if (line.indexOf('(eval ') > -1) {
                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
                }
                var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
                var locationParts = this.extractLocation(tokens.pop());
                var functionName = tokens.join(' ') || undefined;
                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

                return new StackFrame({
                    functionName: functionName,
                    fileName: fileName,
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
            var filtered = error.stack.split('\n').filter(function (line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);

            return filtered.map(function (line) {
                // Throw away eval information until we implement stacktrace.js/stackframe#8
                if (line.indexOf(' > eval') > -1) {
                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
                }

                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                    // Safari eval frames only have function names and nothing else
                    return new StackFrame({
                        functionName: line
                    });
                } else {
                    var tokens = line.split('@');
                    var locationParts = this.extractLocation(tokens.pop());
                    var functionName = tokens.join('@') || undefined;

                    return new StackFrame({
                        functionName: functionName,
                        fileName: locationParts[0],
                        lineNumber: locationParts[1],
                        columnNumber: locationParts[2],
                        source: line
                    });
                }
            }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame({
                        fileName: match[2],
                        lineNumber: match[1],
                        source: lines[i]
                    }));
                }
            }

            return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame({
                        functionName: match[3] || undefined,
                        fileName: match[2],
                        lineNumber: match[1],
                        source: lines[i]
                    }));
                }
            }

            return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
            var filtered = error.stack.split('\n').filter(function (line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);

            return filtered.map(function (line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionCall = tokens.shift() || '';
                var functionName = functionCall.replace(/<anonymous function(: (\w+))?>/, '$2').replace(/\([^\)]*\)/g, '') || undefined;
                var argsRaw;
                if (functionCall.match(/\(([^\)]*)\)/)) {
                    argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
                }
                var args = argsRaw === undefined || argsRaw === '[arguments not available]' ? undefined : argsRaw.split(',');

                return new StackFrame({
                    functionName: functionName,
                    args: args,
                    fileName: locationParts[0],
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        }
    };
});

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*===========================================================================*\
 * Requires
\*===========================================================================*/
var JClass = __webpack_require__(27);

/*===========================================================================*\
 * HashArray
\*===========================================================================*/
var HashArray = JClass._extend({
  //-----------------------------------
  // Constructor
  //-----------------------------------
  init: function init(keyFields, callback, options) {
    keyFields = keyFields instanceof Array ? keyFields : [keyFields];

    this._map = {};
    this._list = [];
    this.callback = callback;

    this.keyFields = keyFields;

    this.isHashArray = true;

    this.options = options || {
      ignoreDuplicates: false
    };

    if (callback) {
      callback('construct');
    }
  },
  //-----------------------------------
  // add()
  //-----------------------------------
  addOne: function addOne(obj) {
    var needsDupCheck = false;
    for (var key in this.keyFields) {
      key = this.keyFields[key];
      var inst = this.objectAt(obj, key);
      if (inst) {
        if (this._map[inst]) {
          if (this.options.ignoreDuplicates) return;
          if (this._map[inst].indexOf(obj) != -1) {
            // Cannot add the same item twice
            needsDupCheck = true;
            continue;
          }
          this._map[inst].push(obj);
        } else this._map[inst] = [obj];
      }
    }

    if (!needsDupCheck || this._list.indexOf(obj) == -1) this._list.push(obj);
  },
  add: function add() {
    for (var i = 0; i < arguments.length; i++) {
      this.addOne(arguments[i]);
    }

    if (this.callback) {
      this.callback('add', Array.prototype.slice.call(arguments, 0));
    }

    return this;
  },
  addAll: function addAll(arr) {
    if (arr.length < 100) this.add.apply(this, arr);else {
      for (var i = 0; i < arr.length; i++) {
        this.add(arr[i]);
      }
    }

    return this;
  },
  addMap: function addMap(key, obj) {
    this._map[key] = obj;
    if (this.callback) {
      this.callback('addMap', {
        key: key,
        obj: obj
      });
    }

    return this;
  },
  //-----------------------------------
  // Intersection, union, etc.
  //-----------------------------------
  /**
   * Returns a new HashArray that contains the intersection between this (A) and the hasharray passed in (B). Returns A ^ B.
   */
  intersection: function intersection(other) {
    var self = this;

    if (!other || !other.isHashArray) throw Error('Cannot HashArray.intersection() on a non-hasharray object. You passed in: ', other);

    var ret = this.clone(null, true),
        allItems = this.clone(null, true).addAll(this.all.concat(other.all));

    allItems.all.forEach(function (item) {
      if (self.collides(item) && other.collides(item)) ret.add(item);
    });

    return ret;
  },
  /**
   * Returns a new HashArray that contains the complement (difference) between this hash array (A) and the hasharray passed in (B). Returns A - B.
   */
  complement: function complement(other) {
    var self = this;

    if (!other || !other.isHashArray) throw Error('Cannot HashArray.complement() on a non-hasharray object. You passed in: ', other);

    var ret = this.clone(null, true);

    this.all.forEach(function (item) {
      if (!other.collides(item)) ret.add(item);
    });

    return ret;
  },
  //-----------------------------------
  // Retrieval
  //-----------------------------------
  get: function get(key) {
    return !(this._map[key] instanceof Array) || this._map[key].length != 1 ? this._map[key] : this._map[key][0];
  },
  getAll: function getAll(keys) {
    keys = keys instanceof Array ? keys : [keys];

    if (keys[0] == '*') return this.all;

    var res = new HashArray(this.keyFields);
    for (var key in keys) {
      res.add.apply(res, this.getAsArray(keys[key]));
    }return res.all;
  },
  getAsArray: function getAsArray(key) {
    return this._map[key] || [];
  },
  getUniqueRandomIntegers: function getUniqueRandomIntegers(count, min, max) {
    var res = [],
        map = {};

    count = Math.min(Math.max(max - min, 1), count);

    while (res.length < count) {
      var r = Math.floor(min + Math.random() * (max + 1));
      if (map[r]) continue;
      map[r] = true;
      res.push(r);
    }

    return res;
  },
  sample: function sample(count, keys) {
    // http://en.wikipedia.org/wiki/Image_(mathematics)
    var image = this.all,
        ixs = {},
        res = [];

    if (keys) image = this.getAll(keys);

    var rand = this.getUniqueRandomIntegers(count, 0, image.length - 1);

    for (var i = 0; i < rand.length; i++) {
      res.push(image[rand[i]]);
    }return res;
  },
  //-----------------------------------
  // Peeking
  //-----------------------------------
  has: function has(key) {
    return this._map.hasOwnProperty(key);
  },
  collides: function collides(item) {
    for (var k in this.keyFields) {
      if (this.has(this.objectAt(item, this.keyFields[k]))) return true;
    }return false;
  },
  hasMultiple: function hasMultiple(key) {
    return this._map[key] instanceof Array;
  },
  //-----------------------------------
  // Removal
  //-----------------------------------
  removeByKey: function removeByKey() {
    var removed = [];
    for (var i = 0; i < arguments.length; i++) {
      var key = arguments[i];
      var items = this._map[key].concat();
      if (items) {
        removed = removed.concat(items);
        for (var j in items) {
          var item = items[j];
          for (var ix in this.keyFields) {
            var key2 = this.objectAt(item, this.keyFields[ix]);
            if (key2 && this._map[key2]) {
              var ix = this._map[key2].indexOf(item);
              if (ix != -1) {
                this._map[key2].splice(ix, 1);
              }

              if (this._map[key2].length == 0) delete this._map[key2];
            }
          }

          this._list.splice(this._list.indexOf(item), 1);
        }
      }
      delete this._map[key];
    }

    if (this.callback) {
      this.callback('removeByKey', removed);
    }

    return this;
  },
  remove: function remove() {
    for (var i = 0; i < arguments.length; i++) {
      var item = arguments[i];
      for (var ix in this.keyFields) {
        var key = this.objectAt(item, this.keyFields[ix]);
        if (key) {
          var ix = this._map[key].indexOf(item);
          if (ix != -1) this._map[key].splice(ix, 1);

          if (this._map[key].length == 0) delete this._map[key];
        }
      }

      this._list.splice(this._list.indexOf(item), 1);
    }

    if (this.callback) {
      this.callback('remove', arguments);
    }

    return this;
  },
  removeAll: function removeAll() {
    var old = this._list.concat();
    this._map = {};
    this._list = [];

    if (this.callback) {
      this.callback('remove', old);
    }

    return this;
  },
  //-----------------------------------
  // Utility
  //-----------------------------------
  objectAt: function objectAt(obj, path) {
    if (typeof path === 'string') {
      return obj[path];
    }

    var dup = path.concat();
    // else assume array.
    while (dup.length && obj) {
      obj = obj[dup.shift()];
    }

    return obj;
  },
  //-----------------------------------
  // Iteration
  //-----------------------------------
  forEach: function forEach(keys, callback) {
    keys = keys instanceof Array ? keys : [keys];

    var objs = this.getAll(keys);

    objs.forEach(callback);

    return this;
  },
  forEachDeep: function forEachDeep(keys, key, callback) {
    keys = keys instanceof Array ? keys : [keys];

    var self = this,
        objs = this.getAll(keys);

    objs.forEach(function (item) {
      callback(self.objectAt(item, key), item);
    });

    return this;
  },
  //-----------------------------------
  // Cloning
  //-----------------------------------
  clone: function clone(callback, ignoreItems) {
    var n = new HashArray(this.keyFields.concat(), callback ? callback : this.callback);
    if (!ignoreItems) n.add.apply(n, this.all.concat());
    return n;
  },
  //-----------------------------------
  // Mathematical
  //-----------------------------------
  sum: function sum(keys, key, weightKey) {
    var self = this,
        ret = 0;
    this.forEachDeep(keys, key, function (value, item) {
      if (weightKey !== undefined) value *= self.objectAt(item, weightKey);

      ret += value;
    });
    return ret;
  },
  average: function average(keys, key, weightKey) {
    var ret = 0,
        tot = 0,
        weightsTotal = 0,
        self = this;

    if (weightKey !== undefined) this.forEachDeep(keys, weightKey, function (value) {
      weightsTotal += value;
    });

    this.forEachDeep(keys, key, function (value, item) {
      if (weightKey !== undefined) value *= self.objectAt(item, weightKey) / weightsTotal;

      ret += value;
      tot++;
    });

    return weightKey !== undefined ? ret : ret / tot;
  },
  //-----------------------------------
  // Filtering
  //-----------------------------------
  filter: function filter(keys, callbackOrKey) {
    var self = this;

    var callback = typeof callbackOrKey == 'function' ? callbackOrKey : defaultCallback;

    var ha = new HashArray(this.keyFields);
    ha.addAll(this.getAll(keys).filter(callback));
    return ha;

    function defaultCallback(item) {
      var val = self.objectAt(item, callbackOrKey);
      return val !== undefined && val !== false;
    }
  }
});

//-----------------------------------
// Operators
//-----------------------------------
Object.defineProperty(HashArray.prototype, 'all', {
  get: function get() {
    return this._list;
  }
});

Object.defineProperty(HashArray.prototype, 'map', {
  get: function get() {
    return this._map;
  }
});

module.exports = HashArray;

//-----------------------------------
// Browser
//-----------------------------------
if (typeof window !== 'undefined') window.HashArray = HashArray;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * jclass v1.1.9
 * https://github.com/riga/jclass
 *
 * Marcel Rieger, 2015
 * MIT licensed, http://www.opensource.org/licenses/mit-license
 */

(function (factory) {

  /**
   * Make jclass available in any context.
   */

  if (true) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object") {
    // CommonJS
    exports = factory();

    if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") {
      // NodeJS
      module.exports = exports;
    }
  } else if (window) {
    // Browser
    window.JClass = factory();
  } else if ((typeof console === "undefined" ? "undefined" : _typeof(console)) == "object" && console.error instanceof Function) {
    // error case
    console.error("cannot determine environment");
  }
})(function () {

  /**
   * Helper functions.
   */

  /**
   * Checks whether a passed object is a function.
   *
   * @param obj - The object to check.
   * @returns {boolean}
   */
  var isFn = function isFn(obj) {
    return obj instanceof Function;
  };

  /**
   * Extends a target object by one or more source objects with shallow key comparisons. Note that
   * the extension is done in-place.
   *
   * @param {object} target - The target object to extend.
   * @param {...object} source - Source objects.
   * @returns {object} The extended object.
   */
  var extend = function extend(target) {
    var sources = Array.prototype.slice.call(arguments, 1);

    // loop through all sources
    for (var i in sources) {
      var source = sources[i];

      // object check
      if ((typeof source === "undefined" ? "undefined" : _typeof(source)) != "object") {
        continue;
      }

      // loop through all source attributes
      for (var key in source) {
        target[key] = source[key];
      }
    }

    return target;
  };

  /**
   * Default options.
   */

  var defaultOptions = {
    // internal object for indicating that class objects don't have a class object themselves,
    // may not be used by users
    _isClassObject: false
  };

  /**
   * Flags.
   */

  // flag to distinguish between prototype and class instantiation 
  var initializing = false;

  /**
   * Base class definition.
   */

  // empty BaseClass implementation
  var BaseClass = function BaseClass() {};

  // add the _subClasses entry
  BaseClass._subClasses = [];

  // empty init method
  BaseClass.prototype.init = function () {};

  /**
   * Extend mechanism. Returns a derived class.
   *
   * @param {object} instanceMembers - Members that will be owned by instances.
   * @param {object} classMembers - Members that will be owned by the class itself.
   * @returns {JClass}
   */
  BaseClass._extend = function (instanceMembers, classMembers, options) {

    // default arguments
    if (instanceMembers === undefined) {
      instanceMembers = {};
    }
    if (classMembers === undefined) {
      classMembers = {};
    }
    if (options === undefined) {
      options = {};
    }

    // mixin default options
    options = extend({}, defaultOptions, options);

    // sub class dummy constructor
    var JClass = function JClass() {
      // nothing happens here when we are initializing
      if (initializing) {
        return;
      }

      // store a reference to the class itself
      this._class = JClass;

      // all construction is actually done in the init method
      if (this.init instanceof Function) {
        this.init.apply(this, arguments);
      }
    };

    // alias for readability
    var SuperClass = this;

    // create an instance of the super class via new
    // the flag sandwich prevents a call to the init method
    initializing = true;
    var prototype = new SuperClass();
    initializing = false;

    // get the prototype of the super class
    var superPrototype = SuperClass.prototype;

    // the instance of the super class is our new prototype
    JClass.prototype = prototype;

    // enforce the constructor to be what we expect
    // calls to the constructor will invoke the init method (see above)
    JClass.prototype.constructor = JClass;

    // store a reference to the super class
    JClass._superClass = SuperClass;

    // store references to all extending classes
    JClass._subClasses = [];
    SuperClass._subClasses.push(JClass);

    // make this class extendable as well
    JClass._extend = SuperClass._extend;

    // _extends returns true if the class itself extended "target"
    // in any hierarchy, e.g. every class extends "JClass" itself
    JClass._extends = function (target) {
      // this function operates recursive, so stop when the super class is our BaseClass
      if (this._superClass == BaseClass) {
        return false;
      }

      // success case
      if (target == this._superClass || target == BaseClass) {
        return true;
      }

      // continue with the next super class
      return this._superClass._extends(target);
    };

    // propagate instance members directly to the created protoype,
    // the member is either a normal member or a descriptor
    for (var key in instanceMembers) {
      var property = Object.getOwnPropertyDescriptor(instanceMembers, key);
      var member = property.value;

      // descriptor flag set?
      if (member !== null && (typeof member === "undefined" ? "undefined" : _typeof(member)) == "object" && member.descriptor) {
        Object.defineProperty(prototype, key, member);

        // getter/setter syntax
      } else if (!("value" in property) && ("set" in property || "get" in property)) {
        Object.defineProperty(prototype, key, property);

        // normal member, simple assignment
      } else {
        prototype[key] = member;

        // if both member and the super member are distinct functions
        // add the super member to the member as "_super"
        var superMember = superPrototype[key];
        if (isFn(member) && isFn(superMember) && member !== superMember) {
          member._super = superMember;
        }
      }
    }

    // propagate class members to the _members object
    if (!options._isClassObject) {
      // try to find the super class of the _members object 
      var ClassMembersSuperClass = SuperClass._members === undefined ? BaseClass : SuperClass._members._class;

      // create the actual class of the _members instance
      // with an updated version of our options
      var opts = extend({}, options, { _isClassObject: true });
      var ClassMembersClass = ClassMembersSuperClass._extend(classMembers, {}, opts);

      // store the actual JClass in ClassMembersClass
      ClassMembersClass._instanceClass = JClass;

      // create the _members instance
      JClass._members = new ClassMembersClass();
    }

    // return the new class
    return JClass;
  };

  /**
   * Converts arbitrary protoype-style classes to our JClass definition.
   *
   * @param {function} cls - The class to convert.
   * @returns {JClass}
   */
  BaseClass._convert = function (cls, options) {
    // the properties consist of the class' prototype
    var instanceMembers = cls.prototype;

    // add the constructor function
    instanceMembers.init = function () {
      // simply create an instance of our target class
      var origin = this._origin = BaseClass._construct(cls, arguments);

      // add properties for each own property in _origin
      Object.keys(origin).forEach(function (key) {
        if (!origin.hasOwnProperty(key)) {
          return;
        }

        Object.defineProperty(this, key, {
          get: function get() {
            return origin[key];
          }
        });
      }, this);
    };

    // finally, create and return our new class
    return BaseClass._extend(instanceMembers, {}, options);
  };

  /**
   * Returns an instance of a class with a list of arguments. This provides an apply-like
   * constructor usage. Note that this approach does not work with native constructors (e.g. String
   * or Boolean).
   *
   * @param {Class|JClass} cls - The class to instantiate. This may be a JClass or a prototype-based
   *   class.
   * @param {array} [args=[]] - Arguments to pass to the constructor.
   * @returns {instance}
   */
  BaseClass._construct = function (cls, args) {
    // empty default args
    if (args === undefined) {
      args = [];
    }

    // create a class wrapper that calls cls like a function
    var Class = function Class() {
      return cls.apply(this, args);
    };

    // copy the prototype
    Class.prototype = cls.prototype;

    // return a new instance
    return new Class();
  };

  /**
   * Returns a property descriptor of the super class.
   *
   * @param {JClass|instance} cls - A JClass or an instance of a JClass to retrieve the property
   *   descriptor from.
   * @param {string} prop - The name of the property descriptor to get.
   * @returns {object}
   */
  BaseClass._superDescriptor = function (cls, prop) {
    // if cls is an instance, use its class
    if ("_class" in cls && cls instanceof cls._class) {
      cls = cls._class;
    }

    // a JClass?
    if ("_extends" in cls && cls._extends instanceof Function && cls._extends(this)) {
      return Object.getOwnPropertyDescriptor(cls._superClass.prototype, prop);
    } else {
      return undefined;
    }
  };

  /**
   * Return the BaseClass.
   */

  return BaseClass;
});

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Special language-specific overrides.
 *
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 *
 * @type {Object}
 */
var LANGUAGES = {
  tr: {
    regexp: /\u0130|\u0049|\u0049\u0307/g,
    map: {
      '\u0130': 'i',
      'I': '\u0131',
      'I\u0307': 'i'
    }
  },
  az: {
    regexp: /[\u0130]/g,
    map: {
      '\u0130': 'i',
      'I': '\u0131',
      'I\u0307': 'i'
    }
  },
  lt: {
    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
    map: {
      'I': 'i\u0307',
      'J': 'j\u0307',
      '\u012E': '\u012F\u0307',
      '\xCC': 'i\u0307\u0300',
      '\xCD': 'i\u0307\u0301',
      '\u0128': 'i\u0307\u0303'
    }
  }
};

/**
 * Lowercase a string.
 *
 * @param  {String} str
 * @return {String}
 */
module.exports = function (str, locale) {
  var lang = LANGUAGES[locale];

  str = str == null ? '' : String(str);

  if (lang) {
    str = str.replace(lang.regexp, function (m) {
      return lang.map[m];
    });
  }

  return str.toLowerCase();
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lowerCase = __webpack_require__(28);

var NON_WORD_REGEXP = __webpack_require__(32);
var CAMEL_CASE_REGEXP = __webpack_require__(30);
var CAMEL_CASE_UPPER_REGEXP = __webpack_require__(31);

/**
 * Sentence case a string.
 *
 * @param  {string} str
 * @param  {string} locale
 * @param  {string} replacement
 * @return {string}
 */
module.exports = function (str, locale, replacement) {
  if (str == null) {
    return '';
  }

  replacement = typeof replacement !== 'string' ? ' ' : replacement;

  function replace(match, index, value) {
    if (index === 0 || index === value.length - match.length) {
      return '';
    }

    return replacement;
  }

  str = String(str)
  // Support camel case ("camelCase" -> "camel Case").
  .replace(CAMEL_CASE_REGEXP, '$1 $2')
  // Support odd camel case ("CAMELCase" -> "CAMEL Case").
  .replace(CAMEL_CASE_UPPER_REGEXP, '$1 $2')
  // Remove all non-word characters and replace with a single space.
  .replace(NON_WORD_REGEXP, replace);

  // Lower case the entire string.
  return lowerCase(str, locale);
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A]+)([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var noCase = __webpack_require__(29);

/**
 * Snake case a string.
 *
 * @param  {string} value
 * @param  {string} [locale]
 * @return {string}
 */
module.exports = function (value, locale) {
  return noCase(value, locale, '_');
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */

    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        module.exports = factory();
    } else {
        root.StackFrame = factory();
    }
})(undefined, function () {
    'use strict';

    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function _capitalize(str) {
        return str[0].toUpperCase() + str.substring(1);
    }

    function _getter(p) {
        return function () {
            return this[p];
        };
    }

    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
    var numericProps = ['columnNumber', 'lineNumber'];
    var stringProps = ['fileName', 'functionName', 'source'];
    var arrayProps = ['args'];

    function StackFrame(obj) {
        if (obj instanceof Object) {
            var props = booleanProps.concat(numericProps.concat(stringProps.concat(arrayProps)));
            for (var i = 0; i < props.length; i++) {
                if (obj.hasOwnProperty(props[i]) && obj[props[i]] !== undefined) {
                    this['set' + _capitalize(props[i])](obj[props[i]]);
                }
            }
        }
    }

    StackFrame.prototype = {
        getArgs: function getArgs() {
            return this.args;
        },
        setArgs: function setArgs(v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        getEvalOrigin: function getEvalOrigin() {
            return this.evalOrigin;
        },
        setEvalOrigin: function setEvalOrigin(v) {
            if (v instanceof StackFrame) {
                this.evalOrigin = v;
            } else if (v instanceof Object) {
                this.evalOrigin = new StackFrame(v);
            } else {
                throw new TypeError('Eval Origin must be an Object or StackFrame');
            }
        },

        toString: function toString() {
            var functionName = this.getFunctionName() || '{anonymous}';
            var args = '(' + (this.getArgs() || []).join(',') + ')';
            var fileName = this.getFileName() ? '@' + this.getFileName() : '';
            var lineNumber = _isNumber(this.getLineNumber()) ? ':' + this.getLineNumber() : '';
            var columnNumber = _isNumber(this.getColumnNumber()) ? ':' + this.getColumnNumber() : '';
            return functionName + args + fileName + lineNumber + columnNumber;
        }
    };

    for (var i = 0; i < booleanProps.length; i++) {
        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = function (p) {
            return function (v) {
                this[p] = Boolean(v);
            };
        }(booleanProps[i]);
    }

    for (var j = 0; j < numericProps.length; j++) {
        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
        StackFrame.prototype['set' + _capitalize(numericProps[j])] = function (p) {
            return function (v) {
                if (!_isNumber(v)) {
                    throw new TypeError(p + ' must be a Number');
                }
                this[p] = Number(v);
            };
        }(numericProps[j]);
    }

    for (var k = 0; k < stringProps.length; k++) {
        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
        StackFrame.prototype['set' + _capitalize(stringProps[k])] = function (p) {
            return function (v) {
                this[p] = String(v);
            };
        }(stringProps[k]);
    }

    return StackFrame;
});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaHashArray2 = __webpack_require__(13);

var _RingaHashArray3 = _interopRequireDefault(_RingaHashArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Thread = function (_RingaHashArray) {
  _inherits(Thread, _RingaHashArray);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  function Thread(name, threadFactory, options) {
    _classCallCheck(this, Thread);

    var _this = _possibleConstructorReturn(this, (Thread.__proto__ || Object.getPrototypeOf(Thread)).call(this, name));

    _this.options = options;
    _this.threadFactory = threadFactory;

    _this.running = false;

    // TODO: a executor thread can potentially spawn child executor threads
    _this.children = [];
    return _this;
  }

  _createClass(Thread, [{
    key: 'buildExecutors',


    //-----------------------------------
    // Methods
    //-----------------------------------
    value: function buildExecutors() {
      var _this2 = this;

      this.threadFactory.all.forEach(function (executorFactory) {
        var executor = executorFactory.build(_this2);

        _this2.add(executor);
      });
    }
  }, {
    key: 'run',
    value: function run(ringaEvent, doneHandler, failHandler) {
      if (true && this.running) {
        throw Error('Thread::run(): you cannot start a thread while it is already running!');
      }

      if (true && this.threadFactory.all.length === 0) {
        throw Error('Thread::run(): attempting to run a thread with no executors!');
      }

      if (true && !ringaEvent) {
        throw Error('Thread::run(): cannot run a thread without a RingaEvent!');
      }

      this.ringaEvent = ringaEvent;
      this.doneHandler = doneHandler;
      this.failHandler = failHandler;

      this.buildExecutors();

      // The current executor we are running
      this.index = 0;

      this.executeNext();
    }
  }, {
    key: 'executeNext',
    value: function executeNext() {
      var executor = this.all[this.index];

      try {
        this.ringaEvent.addDebug('Executing: ' + executor);

        executor._execute(this._executorDoneHandler.bind(this), this._executorFailHandler.bind(this));
      } catch (error) {
        this._executorFailHandler(error);
      }
    }
  }, {
    key: 'kill',
    value: function kill() {
      this.running = false;
    }

    //-----------------------------------
    // Events
    //-----------------------------------

  }, {
    key: '_executorDoneHandler',
    value: function _executorDoneHandler() {
      var executor = void 0;

      if (!this.all[this.index]) {
        this._finCouldNotFindError();
      } else {
        executor = this.all[this.index].destroy();
      }

      this.ringaEvent.addDebug('Done: ' + executor);

      this.index++;

      if (this.ringaEvent.detail._promise) {
        delete this.ringaEvent.detail._promise;
      }

      if (this.index < this.all.length) {
        setTimeout(this.executeNext.bind(this), 0);
      } else {
        this.doneHandler(this);
      }
    }
  }, {
    key: '_executorFailHandler',
    value: function _executorFailHandler(error, kill) {
      var executor = void 0;

      if (!this.all[this.index]) {
        this._finCouldNotFindError(error);
      } else {
        executor = this.all[this.index].destroy();
      }

      this.ringaEvent.addDebug('Fail: ' + executor);

      this.error = error;

      this.failHandler(this, error, kill);

      if (this.ringaEvent.detail._promise) {
        delete this.ringaEvent.detail._promise;
      }

      if (!kill) {
        this._executorDoneHandler();
      }
    }
  }, {
    key: '_finCouldNotFindError',
    value: function _finCouldNotFindError(error) {
      var e = this.all && this.all.length ? this.all.map(function (e) {
        return e.toString();
      }).join(', ') : 'No executors found on thread ' + this.toString();

      console.error('Thread: could not find executor to destroy it! This could be caused by an internal Ringa error or an error in an executor. All information below:\n' + ('\t- Executor Index: ' + this.index + '\n') + ('\t- All Executors: ' + e + '\n') + (error ? '\t- Executor Failure that triggered this was:\n' + (error.stack ? '\t' + error.stack + '\n' : '' + error) : '') + '\t- Failure Dispatch Stack Trace:\n' + ('\t' + new Error().stack));
    }
  }, {
    key: 'controller',
    get: function get() {
      return this.threadFactory.controller;
    }
  }]);

  return Thread;
}(_RingaHashArray3.default);

exports.default = Thread;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ExecutorAbstract2 = __webpack_require__(0);

var _ExecutorAbstract3 = _interopRequireDefault(_ExecutorAbstract2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * EventExecutor dispatches an event. There are two primary ways to do this in a executor tree:
 *
 *   controller.addListener('event', ['someEvent']); // 'someEvent' will be dispatched on the bus of controller without details
 *   controller.addListener('event', [event('someEvent', {prop: 'details'}, someOtherBus)]); // With details and a custom bus.
 */
var EventExecutor = function (_ExecutorAbstract) {
  _inherits(EventExecutor, _ExecutorAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new EventExecutor
   *
   * @param thread The parent thread that owns this command.
   * @param ringaEventFactory The event to dispatch and watch!
   */
  function EventExecutor(thread, ringaEventFactory) {
    _classCallCheck(this, EventExecutor);

    var _this = _possibleConstructorReturn(this, (EventExecutor.__proto__ || Object.getPrototypeOf(EventExecutor)).call(this, thread));

    _this.ringaEventFactory = ringaEventFactory;
    return _this;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Internal execution method called by CommandThread only.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */


  _createClass(EventExecutor, [{
    key: '_execute',
    value: function _execute(doneHandler, failHandler) {
      _get(EventExecutor.prototype.__proto__ || Object.getPrototypeOf(EventExecutor.prototype), '_execute', this).call(this, doneHandler, failHandler);

      this.dispatchedRingaEvent = this.ringaEventFactory.build(this);

      this.dispatchedRingaEvent.then(this.dispatchedRingaEventDoneHandler.bind(this));
      this.dispatchedRingaEvent.catch(this.dispatchedRingaEventFailHandler.bind(this));

      // If this executor has custom injections, we need to pass those to the event.
      if (this._injections) {
        for (var key in this._injections) {
          this.dispatchedRingaEvent.detail[key] = this._injections[key];
        }
      }

      var bus = this.dispatchedRingaEvent.bus || this.controller.bus;

      this.ringaEvent.lastEvent = this.dispatchedRingaEvent;

      this.dispatchedRingaEvent.dispatch(bus);

      if ((this.dispatchedRingaEvent.detail.requireCatch === undefined || this.dispatchedRingaEvent.detail.requireCatch) && !this.dispatchedRingaEvent.caught) {
        this.fail(Error('EventExecutor::_execute(): event ' + this.dispatchedRingaEvent.type + ' was expected to be caught and it was not.'));
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.id + '[dispatching \'' + this.ringaEventFactory.eventType + '\']';
    }
  }, {
    key: '_timeoutHandler',
    value: function _timeoutHandler() {}
    // Noop, we never timeout an EventExecutor because we leave that up to the controller that handles the next event.


    //-----------------------------------
    // Events
    //-----------------------------------

  }, {
    key: 'dispatchedRingaEventDoneHandler',
    value: function dispatchedRingaEventDoneHandler() {
      // TODO write unit tests for this
      if (this.dispatchedRingaEvent.detail) {
        for (var key in this.dispatchedRingaEvent.detail) {
          if (this.ringaEvent.detail[key] === undefined) {
            this.ringaEvent.detail[key] = this.dispatchedRingaEvent.detail[key];
          }
        }
      }

      this.done();
    }
  }, {
    key: 'dispatchedRingaEventFailHandler',
    value: function dispatchedRingaEventFailHandler(error) {
      // Alright, this failure is a timeout on our dispatched event, so the other handling thread will have already dealt with it. Don't display
      // the error again.
      if (this.dispatchedRingaEvent._threadTimedOut) {
        // Lets clear our own timeout and just neither be done nor fail.
        return;
      }

      this.fail(error);
    }
  }]);

  return EventExecutor;
}(_ExecutorAbstract3.default);

exports.default = EventExecutor;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ExecutorAbstract2 = __webpack_require__(0);

var _ExecutorAbstract3 = _interopRequireDefault(_ExecutorAbstract2);

var _executors = __webpack_require__(1);

var _function = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * FunctionExecutor is a wrapper for a single function. As a general rule you will not use this directly.
 */
var FunctionExecutor = function (_ExecutorAbstract) {
  _inherits(FunctionExecutor, _ExecutorAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param thread The parent thread that owns this command.
   * @param func The function that is run when the CommandThread calls _execute().
   */
  function FunctionExecutor(thread, func) {
    _classCallCheck(this, FunctionExecutor);

    var _this = _possibleConstructorReturn(this, (FunctionExecutor.__proto__ || Object.getPrototypeOf(FunctionExecutor)).call(this, thread));

    _this.func = func;
    _this.expectedArguments = (0, _function.getArgNames)(func);
    return _this;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Internal execution method called by CommandThread only.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */


  _createClass(FunctionExecutor, [{
    key: '_execute',
    value: function _execute(doneHandler, failHandler) {
      var promise = void 0;

      _get(FunctionExecutor.prototype.__proto__ || Object.getPrototypeOf(FunctionExecutor.prototype), '_execute', this).call(this, doneHandler, failHandler);

      var args = (0, _executors.buildArgumentsFromRingaEvent)(this, this.expectedArguments, this.ringaEvent);

      // If the function requested that 'done' be passed, we assume it is an asynchronous
      // function and let the function determine when it will call done.
      var donePassedAsArg = this.expectedArguments.indexOf('done') !== -1;

      // Functions can return a promise and if they do, our Thread will wait for the promise to finish.
      promise = this.func.apply(undefined, args);

      // We call done if:
      // 1) A promise is not returned AND
      // 2) 'done' was not passed as an argument
      if (!promise && !donePassedAsArg) {
        this.done();
      }

      if (promise) {
        this.waitForPromise(promise);
      }

      return promise;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.id + ': ' + this.func.toString().substr(0, 128);
    }
  }]);

  return FunctionExecutor;
}(_ExecutorAbstract3.default);

exports.default = FunctionExecutor;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ExecutorAbstract2 = __webpack_require__(0);

var _ExecutorAbstract3 = _interopRequireDefault(_ExecutorAbstract2);

var _ExecutorFactory = __webpack_require__(5);

var _ExecutorFactory2 = _interopRequireDefault(_ExecutorFactory);

var _type = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParallelExecutor = function (_ExecutorAbstract) {
  _inherits(ParallelExecutor, _ExecutorAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new ParallelExecutor
   *
   * @param thread The parent thread that owns this executor.
   * @param executorArray The executors to run in parallel
   */
  function ParallelExecutor(thread, executorArray) {
    _classCallCheck(this, ParallelExecutor);

    var _this = _possibleConstructorReturn(this, (ParallelExecutor.__proto__ || Object.getPrototypeOf(ParallelExecutor)).call(this, thread));

    _this.executorArray = executorArray;
    _this.executorFactoryArray = executorArray.map(function (e) {
      return (0, _type.wrapIfNotInstance)(e, _ExecutorFactory2.default);
    });
    _this.awaitingExecutors = executorArray.length;
    return _this;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Internal execution method called by Thread only.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */


  _createClass(ParallelExecutor, [{
    key: '_execute',
    value: function _execute(doneHandler, failHandler) {
      var _this2 = this;

      _get(ParallelExecutor.prototype.__proto__ || Object.getPrototypeOf(ParallelExecutor.prototype), '_execute', this).call(this, doneHandler, failHandler);
      this.executorFactoryArray.forEach(function (executorFactory) {
        executorFactory.build(_this2.thread)._execute(_this2._parallelDone.bind(_this2), _this2._parallelFail.bind(_this2));
      });
    }
  }, {
    key: '_parallelDone',
    value: function _parallelDone() {
      this.awaitingExecutors -= 1;

      if (this.awaitingExecutors === 0) {
        this.done();
      }
    }
  }, {
    key: '_parallelFail',
    value: function _parallelFail(error) {
      this.fail(error);
    }
  }]);

  return ParallelExecutor;
}(_ExecutorAbstract3.default);

exports.default = ParallelExecutor;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ExecutorAbstract2 = __webpack_require__(0);

var _ExecutorAbstract3 = _interopRequireDefault(_ExecutorAbstract2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PromiseExecutor = function (_ExecutorAbstract) {
  _inherits(PromiseExecutor, _ExecutorAbstract);

  function PromiseExecutor() {
    _classCallCheck(this, PromiseExecutor);

    return _possibleConstructorReturn(this, (PromiseExecutor.__proto__ || Object.getPrototypeOf(PromiseExecutor)).apply(this, arguments));
  }

  return PromiseExecutor;
}(_ExecutorAbstract3.default);

exports.default = PromiseExecutor;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ExecutorAbstract2 = __webpack_require__(0);

var _ExecutorAbstract3 = _interopRequireDefault(_ExecutorAbstract2);

var _function = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SleepExecutor = function (_ExecutorAbstract) {
  _inherits(SleepExecutor, _ExecutorAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new SleepExecutor, which will wait `milliseconds` before calling `this.done()`
   *
   * @param thread The parent thread that owns this executor.
   * @param milliseconds The number of milliseconds to sleep
   */
  function SleepExecutor(thread, milliseconds) {
    _classCallCheck(this, SleepExecutor);

    var _this = _possibleConstructorReturn(this, (SleepExecutor.__proto__ || Object.getPrototypeOf(SleepExecutor)).call(this, thread));

    _this.milliseconds = milliseconds;
    return _this;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Internal execution method called by Thread only.
   *
   * @param doneHandler The handler to call when done() is called.
   * @param failHandler The handler to call when fail() is called;
   * @private
   */


  _createClass(SleepExecutor, [{
    key: '_execute',
    value: function _execute(doneHandler, failHandler) {
      _get(SleepExecutor.prototype.__proto__ || Object.getPrototypeOf(SleepExecutor.prototype), '_execute', this).call(this, doneHandler, failHandler);

      (0, _function.sleep)(this.milliseconds).then(this.done);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.id + ': Sleep for ' + this.milliseconds + 'milliseconds';
    }
  }]);

  return SleepExecutor;
}(_ExecutorAbstract3.default);

exports.default = SleepExecutor;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelWatcher = exports.Model = exports.Bus = exports.RingaObject = exports.RingaEvent = exports.Controller = exports.ThreadFactory = exports.ExecutorFactory = exports.Command = undefined;
exports.dispatch = dispatch;
exports.forEach = forEach;
exports.forEachParallel = forEachParallel;
exports.iif = iif;
exports.interval = interval;
exports.spawn = spawn;
exports.stop = stop;
exports.assign = assign;
exports.event = event;
exports.notify = notify;
exports.debug = debug;
exports.__hardReset = __hardReset;

var _Command = __webpack_require__(17);

var _Command2 = _interopRequireDefault(_Command);

var _ExecutorFactory = __webpack_require__(5);

var _ExecutorFactory2 = _interopRequireDefault(_ExecutorFactory);

var _ThreadFactory = __webpack_require__(11);

var _ThreadFactory2 = _interopRequireDefault(_ThreadFactory);

var _Controller = __webpack_require__(16);

var _Controller2 = _interopRequireDefault(_Controller);

var _RingaEvent = __webpack_require__(6);

var _RingaEvent2 = _interopRequireDefault(_RingaEvent);

var _RingaObject = __webpack_require__(2);

var _RingaObject2 = _interopRequireDefault(_RingaObject);

var _RingaEventFactory = __webpack_require__(10);

var _RingaEventFactory2 = _interopRequireDefault(_RingaEventFactory);

var _AssignFactory = __webpack_require__(22);

var _AssignFactory2 = _interopRequireDefault(_AssignFactory);

var _Model = __webpack_require__(8);

var _Model2 = _interopRequireDefault(_Model);

var _ModelWatcher = __webpack_require__(9);

var _ModelWatcher2 = _interopRequireDefault(_ModelWatcher);

var _Bus = __webpack_require__(15);

var _Bus2 = _interopRequireDefault(_Bus);

var _IifExecutor = __webpack_require__(19);

var _IifExecutor2 = _interopRequireDefault(_IifExecutor);

var _ForEachExecutor = __webpack_require__(18);

var _ForEachExecutor2 = _interopRequireDefault(_ForEachExecutor);

var _IntervalExecutor = __webpack_require__(20);

var _IntervalExecutor2 = _interopRequireDefault(_IntervalExecutor);

var _SpawnExecutor = __webpack_require__(21);

var _SpawnExecutor2 = _interopRequireDefault(_SpawnExecutor);

var _type = __webpack_require__(3);

var _debug = __webpack_require__(7);

var _executors = __webpack_require__(1);

var _ExecutorAbstract = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dispatch(eventType, detail) {
  var bus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;

  if ((0, _type.isDOMNode)(detail)) {
    bus = detail;
    detail = undefined;
  }
  return new _RingaEvent2.default(eventType, detail).dispatch(bus);
}

function forEach(arrayProperty, property, executor) {
  return new _ExecutorFactory2.default(_ForEachExecutor2.default, { arrayProperty: arrayProperty, property: property, executor: executor });
}

function forEachParallel(arrayProperty, property, executor) {
  return new _ExecutorFactory2.default(_ForEachExecutor2.default, { arrayProperty: arrayProperty, property: property, executor: executor, sequential: false });
}

function iif(condition, trueExecutor, falseExecutor) {
  return new _ExecutorFactory2.default(_IifExecutor2.default, { condition: condition, trueExecutor: trueExecutor, falseExecutor: falseExecutor });
}

function interval(condition, executor, milliseconds, options) {
  return new _ExecutorFactory2.default(_IntervalExecutor2.default, { condition: condition, executor: executor, milliseconds: milliseconds, options: options });
}

function spawn(executor) {
  return new _ExecutorFactory2.default(_SpawnExecutor2.default, executor);
}

var debugStyle = 'background: #660000; color: white; font-weight: bold;';
function stop($ringaEvent, stop, done) {
  stop();

  var funcName = 'go' + $ringaEvent.id;

  console.log('%cRinga STOP! RingaEvent:', debugStyle);
  console.log($ringaEvent.debugDisplay());
  console.log('%cDispatched From:', debugStyle);
  console.log('%c' + $ringaEvent.dispatchStack.join('\n').toString().replace(/@/g, '\t'), debugStyle);
  console.log('%c\'window.ringaEvent\' has been set and is ready for editing.', debugStyle);
  console.log('%cTo resume this stopped event thread, run \'' + funcName + '()\' in the console.', debugStyle);

  if (typeof window !== 'undefined') {

    window.ringaEvent = $ringaEvent;
    window[funcName] = function () {
      window.ringaEvent = undefined;
      window[funcName] = undefined;
      console.log('%cResuming Ringa Thread...', debugStyle);
      done();
    };
  }
}

function assign(executor, detail) {
  return new _AssignFactory2.default(executor, detail);
}

function event(eventType, detail, bus) {
  var requireCatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var bubbles = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var cancellable = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

  return new _RingaEventFactory2.default(eventType, detail, bus, requireCatch, bubbles, cancellable);
}

function notify(eventType) {
  return function ($controller, $ringaEvent) {
    $controller.notify($ringaEvent, eventType);
  };
}

function debug() {
  return {
    injectionNames: (0, _debug.injectionNames)(),
    constructorNames: (0, _debug.constructorNames)(),
    uglifyWhitelist: (0, _debug.uglifyWhitelist)()
  };
}

if (typeof window !== 'undefined') {
  window.ringaDebug = debug;
}

function __hardReset() {
  _RingaObject.ids.map = {};
  _RingaObject.ids.counts = new WeakMap();
  _ExecutorAbstract.executorCounts.map = new Map();
  _Bus.busses.count = 0;
  _executors.injectionInfo.byName = {};
}

exports.Command = _Command2.default;
exports.ExecutorFactory = _ExecutorFactory2.default;
exports.ThreadFactory = _ThreadFactory2.default;
exports.Controller = _Controller2.default;
exports.RingaEvent = _RingaEvent2.default;
exports.RingaObject = _RingaObject2.default;
exports.Bus = _Bus2.default;
exports.Model = _Model2.default;
exports.ModelWatcher = _ModelWatcher2.default;
exports.default = {
  Controller: _Controller2.default,
  Command: _Command2.default,
  ExecutorFactory: _ExecutorFactory2.default,
  ThreadFactory: _ThreadFactory2.default,
  Event: _RingaEvent2.default,
  RingaEvent: _RingaEvent2.default,
  Model: _Model2.default,
  ModelWatcher: _ModelWatcher2.default,
  Bus: _Bus2.default,
  RingaObject: _RingaObject2.default,
  dispatch: dispatch,
  iif: iif,
  forEach: forEach,
  forEachParallel: forEachParallel,
  interval: interval,
  spawn: spawn,
  event: event,
  assign: assign,
  notify: notify,
  stop: stop
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=ringa.js.map