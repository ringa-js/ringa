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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaObject2 = __webpack_require__(1);

var _RingaObject3 = _interopRequireDefault(_RingaObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Command is the base class for all command objects that are run in a Ringa application or module.
 */
var CommandAbstract = function (_RingaObject) {
  _inherits(CommandAbstract, _RingaObject);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param commandThread The parent thread that owns this command.
   */
  function CommandAbstract(commandThread) {
    _classCallCheck(this, CommandAbstract);

    var _this = _possibleConstructorReturn(this, (CommandAbstract.__proto__ || Object.getPrototypeOf(CommandAbstract)).call(this));

    if (true && !commandThread.controller) {
      throw Error('Command(): attempting to build a command connected to a CommandThread that has no attached controller.');
    }

    _this.id = commandThread.controller.id + '_' + _this.constructor.name;

    _this.commandThread = commandThread;
    return _this;
  }

  //-----------------------------------
  // Properties
  //-----------------------------------


  _createClass(CommandAbstract, [{
    key: 'startTimeoutCheck',


    //-----------------------------------
    // Methods
    //-----------------------------------
    value: function startTimeoutCheck() {
      if (this.controller.options.timeout !== -1) {
        this._timeoutToken = setTimeout(this._timeoutHandler.bind(this), this.controller.options.timeout);
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
     * Internal execution method called by CommandThread only. This must be overridden in a
     * subclass to provide the appropriate functionality.
     *
     * @param doneHandler The handler to call when done() is called.
     * @param failHandler The handler to call when fail() is called;
     * @private
     */

  }, {
    key: '_execute',
    value: function _execute(doneHandler, failHandler) {
      this.doneHandler = doneHandler;
      this.failHandler = failHandler;

      this.startTimeoutCheck();
    }

    /**
     * Call this method when the Command is ready to hand off control back to the parent CommandThread.
     */

  }, {
    key: 'done',
    value: function done() {
      this.endTimeoutCheck();

      this.doneHandler(true);
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

      this.error = error;

      this.failHandler(error, kill);
    }

    /**
     * By default is this commands id.
     *
     * @returns {string|*}
     */

  }, {
    key: 'toString',
    value: function toString() {
      return this.id;
    }

    //-----------------------------------
    // Methods
    //-----------------------------------

  }, {
    key: '_timeoutHandler',
    value: function _timeoutHandler() {
      var message = void 0;

      if (true) {
        message = 'CommandAbstract::_timeoutHandler(): the timeout for this command was exceeded ' + this.toString();
      }

      if (false) {
        message = 'Ringa: command timeout exceeded ' + this.toString();
      }

      console.error(message);

      this.fail(new Error(message), this);
    }
  }, {
    key: 'ringaEvent',
    get: function get() {
      return this.commandThread.ringaEvent;
    }
  }, {
    key: 'controller',
    get: function get() {
      return this.commandThread.controller;
    }
  }]);

  return CommandAbstract;
}(_RingaObject3.default);

exports.default = CommandAbstract;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RingaObject = function () {
  function RingaObject(id) {
    _classCallCheck(this, RingaObject);

    this.id = id;
  }

  _createClass(RingaObject, [{
    key: 'toString',
    value: function toString(value) {
      return this.id + ' ' + (value || ' | RingaObject::toString() is to be overridden.');
    }
  }]);

  return RingaObject;
}();

exports.default = RingaObject;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaObject2 = __webpack_require__(1);

var _RingaObject3 = _interopRequireDefault(_RingaObject2);

var _errorStackParser = __webpack_require__(12);

var _errorStackParser2 = _interopRequireDefault(_errorStackParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var eventIx = 0;

/**
 * RingaEvent wraps a CustomEvent that is dispatched on the DOM:
 *
 *   let event = new RingaEvent('change', {
 *     property: 'index',
 *     newValue: 1
 *   });
 *
 *   event.dispatch();
 *
 * By default, the event will be dispatched on the document object, but you can provide a custom DOMNode to dispatch
 * from:
 *
 *   event.dispatch(myDiv);
 *
 * All RingaEvents bubble and are cancelable by default.
 */

var RingaEvent = function (_RingaObject) {
  _inherits(RingaEvent, _RingaObject);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Build a RingaEvent that wraps a CustomEvent internally.
   *
   * @param type
   * @param detail
   * @param bubbles
   * @param cancelable
   */
  function RingaEvent(type) {
    var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var bubbles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var cancelable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    _classCallCheck(this, RingaEvent);

    var _this = _possibleConstructorReturn(this, (RingaEvent.__proto__ || Object.getPrototypeOf(RingaEvent)).call(this, 'event_' + type + '_' + eventIx++));

    _this.detail = detail;
    detail.ringaEvent = _this;

    _this.customEvent = new CustomEvent(type, {
      detail: detail,
      bubbles: bubbles,
      cancelable: cancelable
    });

    _this.dispatched = false;
    _this.controller = undefined;

    _this._errors = undefined;

    _this.listeners = {};

    _this.caught = false;
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
     * Dispatch the event on the provided domNode.
     *
     * Note: this method is always delayed so you must not access its properties
     * until a frame later.
     *
     * @param domNode
     */
    value: function dispatch() {
      var domNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

      setTimeout(this._dispatch.bind(this, domNode), 0);

      return this;
    }
  }, {
    key: '_dispatch',
    value: function _dispatch(domNode) {
      if (true && this.dispatched) {
        throw Error('RingaEvent::dispatch(): events should only be dispatched once!', this);
      }

      this.dispatched = true;

      // TODO this should be in dispatch not _dispatch
      if (true) {
        this.dispatchStack = _errorStackParser2.default.parse(new Error());
        this.dispatchStack.shift(); // Remove a reference to RingaEvent.dispatch()
        if (this.dispatchStack[0].toString().search('Object.dispatch') !== -1) {
          this.dispatchStack.shift(); // Remove a reference to Object.dispatch()
        }
      } else {
        this.dispatchStack = 'To turn on stack traces, build Ringa in development mode. See documentation.';
      }

      domNode.dispatchEvent(this.customEvent);
    }

    /**
     * Completely kills the current Ringa thread, keeping any subsequent commands from running.
     */

  }, {
    key: 'fail',
    value: function fail(error) {
      this.killed = true;

      this.pushError(error);
    }
  }, {
    key: 'pushError',
    value: function pushError(error) {
      this._errors = this._errors || [];
      this.errors.push(error);
    }
  }, {
    key: 'toString',
    value: function toString() {
      console.log('[' + this.type + ']', this.detail, this.target, this.stack);
    }
  }, {
    key: '_done',
    value: function _done() {
      this._dispatchEvent(RingaEvent.DONE);
    }
  }, {
    key: '_fail',
    value: function _fail(error) {
      this._dispatchEvent(RingaEvent.FAIL, undefined, error);
    }
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
      this.listeners[eventType].push(handler);

      return this;
    }
  }, {
    key: 'addDoneListener',
    value: function addDoneListener(handler) {
      return this.addListener(RingaEvent.DONE, handler);
    }
  }, {
    key: 'addFailListener',
    value: function addFailListener(handler) {
      return this.addListener(RingaEvent.FAIL, handler);
    }
  }, {
    key: 'type',
    get: function get() {
      return this.customEvent.type;
    }
  }, {
    key: 'bubbles',
    get: function get() {
      return this.customEvent.bubbles;
    }
  }, {
    key: 'cancelable',
    get: function get() {
      return this.customEvent.cancelable;
    }
  }, {
    key: 'target',
    get: function get() {
      return this.customEvent.target;
    }
  }, {
    key: 'currentTarget',
    get: function get() {
      return this.customEvent.currentTarget;
    }
  }, {
    key: 'errors',
    get: function get() {
      return this._errors;
    }
  }]);

  return RingaEvent;
}(_RingaObject3.default);

RingaEvent.DONE = 'done';
RingaEvent.FAIL = 'fail';
RingaEvent.PREHOOK = 'prehook';

exports.default = RingaEvent;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CommandAbstract = __webpack_require__(0);

var _CommandAbstract2 = _interopRequireDefault(_CommandAbstract);

var _CommandFunctionWrapper = __webpack_require__(18);

var _CommandFunctionWrapper2 = _interopRequireDefault(_CommandFunctionWrapper);

var _CommandPromiseWrapper = __webpack_require__(19);

var _CommandPromiseWrapper2 = _interopRequireDefault(_CommandPromiseWrapper);

var _CommandEventWrapper = __webpack_require__(17);

var _CommandEventWrapper2 = _interopRequireDefault(_CommandEventWrapper);

var _CommandsParallelWrapper = __webpack_require__(20);

var _CommandsParallelWrapper2 = _interopRequireDefault(_CommandsParallelWrapper);

var _RingaEventFactory = __webpack_require__(5);

var _RingaEventFactory2 = _interopRequireDefault(_RingaEventFactory);

var _function = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommandFactory = function () {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructs a CommandFactory.
   *
   * @param executee This can be a Class, a instance, a function... we determine what type of
   *   CommandAbstract to build based on what is passed in. This makes things extensible.
   */
  function CommandFactory(executee) {
    _classCallCheck(this, CommandFactory);

    this.executee = executee;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------


  _createClass(CommandFactory, [{
    key: 'cacheArguments',
    value: function cacheArguments(instance) {
      this.argNames = (0, _function.getArgNames)(instance.execute);
    }
  }, {
    key: 'build',
    value: function build(commandThread) {
      if (typeof this.executee === 'string') {
        var ringaEventFactory = new _RingaEventFactory2.default(this.executee);
        return new _CommandEventWrapper2.default(commandThread, ringaEventFactory);
      } else if (typeof this.executee.then === 'function') {
        return new _CommandPromiseWrapper2.default(commandThread, this.executee);
      } else if (typeof this.executee === 'function') {
        if (this.executee.prototype instanceof _CommandAbstract2.default) {
          var instance = new this.executee(commandThread, this.argNames);

          if (!this.argNames) {
            this.cacheArguments(instance);
            instance.argNames = this.argNames;
          }

          return instance;
        } else {
          return new _CommandFunctionWrapper2.default(commandThread, this.executee);
        }
      } else if (this.executee instanceof Array) {
        // This might be a group of CommandAbstracts that should be run synchronously
        return new _CommandsParallelWrapper2.default(commandThread, this.executee);
      } else if (_typeof(this.executee) === 'object' && this.executee instanceof _RingaEventFactory2.default) {
        return new _CommandEventWrapper2.default(commandThread, this.executee);
      }

      if (true) {
        throw Error('CommandFactory::build(): the type of executee you provided is not supported by Ringa: ' + _typeof(this.executee) + ': ' + this.executee);
      }
    }
  }]);

  return CommandFactory;
}();

exports.default = CommandFactory;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaHashArray2 = __webpack_require__(7);

var _RingaHashArray3 = _interopRequireDefault(_RingaHashArray2);

var _CommandThread = __webpack_require__(16);

var _CommandThread2 = _interopRequireDefault(_CommandThread);

var _CommandFactory = __webpack_require__(3);

var _CommandFactory2 = _interopRequireDefault(_CommandFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommandThreadFactory = function (_RingaHashArray) {
  _inherits(CommandThreadFactory, _RingaHashArray);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  function CommandThreadFactory(id, commandFactories, options) {
    _classCallCheck(this, CommandThreadFactory);

    var _this = _possibleConstructorReturn(this, (CommandThreadFactory.__proto__ || Object.getPrototypeOf(CommandThreadFactory)).call(this, id || 'commandFactory'));

    options = options || {};
    options.synchronous = options.synchronous === undefined ? false : options.synchronous;

    var addOne = _this._hashArray.addOne;
    _this._hashArray.addOne = function (obj) {
      if (!(obj instanceof _CommandFactory2.default)) {
        obj = new _CommandFactory2.default(obj);
      }

      addOne.call(this, obj);
    };

    if (commandFactories) {
      _this.addAll(commandFactories);
    }

    _this.threadId = 0;
    return _this;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------


  _createClass(CommandThreadFactory, [{
    key: 'build',
    value: function build(ringaEvent) {
      if (true && !this.controller) {
        console.log('CommandThreadFactory::build(): controller was not set before the build method was called.');
      }

      var commandThread = new _CommandThread2.default(this.id + '_Thread' + this.threadId, this);

      this.threadId++;

      return commandThread;
    }
  }]);

  return CommandThreadFactory;
}(_RingaHashArray3.default);

exports.default = CommandThreadFactory;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaEvent = __webpack_require__(2);

var _RingaEvent2 = _interopRequireDefault(_RingaEvent);

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
    this.detail = detail;
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
    value: function build(callee) {
      var newDetail = {};

      Object.assign(newDetail, this.detail);

      newDetail._callee = callee;
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(14);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hasharray = __webpack_require__(6);

var _hasharray2 = _interopRequireDefault(_hasharray);

var _RingaObject2 = __webpack_require__(1);

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
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[ID]';
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';
    var changeHandler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

    _classCallCheck(this, RingaHashArray);

    var _this = _possibleConstructorReturn(this, (RingaHashArray.__proto__ || Object.getPrototypeOf(RingaHashArray)).call(this, id));

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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This method is used for injecting RingaEvent.detail properties into a function owned by a CommandAbstract. It uses the data
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
 * controller: the Controller object that is handling this thread
 * commandThread: the CommandThread object that built this Command
 * ringaEvent: the ringaEvent itself (instead of one of its detail properties)
 * customEvent: the customEvent that is wrapped by the ringaEvent that was used to bubble up the DOM
 * target: the target DOMNode that triggered the customEvent was dispatched on.
 * done: the parent CommandAbstract::done(). CommandFunction is an example of where this is needed.
 * fail: the parent CommandAbstract::fail(). CommandFunction is an example of where this is needed.
 *
 * @param commandAbstract The CommandAbstract subclass instance.
 * @param expectedArguments An array of argument names that the target function expects.
 * @param ringaEvent An instance of RingaEvent that has been dispatched and contains a details Object with properties to be injected.
 *
 * @returns {Array}
 */
var buildArgumentsFromRingaEvent = exports.buildArgumentsFromRingaEvent = function buildArgumentsFromRingaEvent(commandAbstract, expectedArguments, ringaEvent) {
  var args = [];

  if (!(expectedArguments instanceof Array)) {
    throw Error('buildArgumentsFromRingaEvent(): An internal error has occurred in that expectedArguments is not an Array!');
  }

  var injections = commandAbstract._injections = commandAbstract._injections || {
    controller: commandAbstract.controller,
    commandThread: commandAbstract.commandThread,
    ringaEvent: ringaEvent,
    customEvent: ringaEvent.customEvent,
    target: ringaEvent.target,
    done: commandAbstract.done,
    fail: commandAbstract.fail
  };

  // Merge controller.options.injections into our injector
  for (var key in commandAbstract.controller.options.injections) {
    injections[key] = commandAbstract.controller.options.injections[key];
  }

  expectedArguments.forEach(function (argName) {
    if (ringaEvent.detail && ringaEvent.detail.hasOwnProperty(argName)) {
      args.push(ringaEvent.detail[argName]);
    } else if (injections.hasOwnProperty(argName)) {
      args.push(injections[argName]);
    } else {
      var message = commandAbstract.toString() + ': the property \'' + argName + '\' was not provided on the dispatched ringaEvent.' + 'Expected Arguments were: [\'' + expectedArguments.join('\'.\'') + '\'] Dispatched from: ' + (ringaEvent.dispatchStack ? ringaEvent.dispatchStack[0] : 'unknown stack.');

      throw Error(message);
    }
  });

  return args;
};

/***/ }),
/* 9 */
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

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CommandThreadFactory = __webpack_require__(4);

var _CommandThreadFactory2 = _interopRequireDefault(_CommandThreadFactory);

var _RingaObject2 = __webpack_require__(1);

var _RingaObject3 = _interopRequireDefault(_RingaObject2);

var _hasharray = __webpack_require__(6);

var _hasharray2 = _interopRequireDefault(_hasharray);

var _RingaEvent = __webpack_require__(2);

var _RingaEvent2 = _interopRequireDefault(_RingaEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Controller is the hub for events dispatched on the DOM invoking threads of commands.
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
   * @param domNode The native browser DOMNode element (not a React Node) to attach event listeners to.
   * @param options See documentation on Controller options. Defaults are provided, so this is optional.
   */
  function Controller(id, domNode, options) {
    _classCallCheck(this, Controller);

    var _this = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this, id));

    if (true && !domNode) {
      throw Error('Controller:constructor(): no DOMNode provided to constructor!');
    }

    _this.domNode = domNode;

    _this.options = options || {};
    _this.options.timeout = _this.options.timeout || 5000;
    _this.options.throwKillsThread = _this.options.throwKillsThread === undefined ? true : false;
    _this.options.consoleLogFails = _this.options.consoleLogFails === undefined ? true : false;
    _this.options.injections = _this.options.injections || {};

    _this.commandThreads = new _hasharray2.default('id');

    _this.eventTypeToCommandThreadFactory = new Map();

    _this._eventHandler = _this._eventHandler.bind(_this);
    return _this;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------


  _createClass(Controller, [{
    key: 'getListener',
    value: function getListener(eventType) {
      return this.eventTypeToCommandThreadFactory[eventType];
    }
  }, {
    key: 'addListener',
    value: function addListener(eventType, commandThreadFactoryOrArray) {
      var commandThreadFactory = void 0;

      if (!commandThreadFactoryOrArray || commandThreadFactoryOrArray instanceof Array) {
        commandThreadFactory = new _CommandThreadFactory2.default(this.id + '_' + eventType + '_CommandThreadFactory', commandThreadFactoryOrArray);
      } else if (typeof commandThreadFactoryOrArray.build === 'function') {
        commandThreadFactory = commandThreadFactoryOrArray;
      } else if (true) {
        throw Error('Controller::addListener(): the provided commandThreadFactoryOrArray is not valid!');
      }

      if (true && !commandThreadFactory || !(commandThreadFactory instanceof _CommandThreadFactory2.default)) {
        throw Error('Controller::addListener(): commandThreadFactory not an instance of CommandThreadFactory');
      }

      if (true && commandThreadFactory.controller) {
        throw Error('Controller::addListener(): commandThreadFactory cannot have two parent controllers!');
      }

      if (true && this.eventTypeToCommandThreadFactory[eventType]) {
        throw Error('Controller.addListener(): the event \'' + eventType + '\' has already been added! Use getListener() to make modifications.');
      }

      commandThreadFactory.controller = this;

      this.eventTypeToCommandThreadFactory[eventType] = commandThreadFactory;

      if (typeof eventType === 'string') {
        this.domNode.addEventListener(eventType, this._eventHandler);
      } else {
        var _eventType = undefined;

        if (eventType.hasOwnProperty('toString')) {
          _eventType = eventType.toString();
        }

        if (_eventType) {
          this.domNode.addEventListener(_eventType, this._eventHandler.bind(this));
        } else {
          throw Error('Controller::addListener(): provided eventType is invalid.', eventType);
        }
      }

      return commandThreadFactory;
    }
  }, {
    key: 'removeListener',
    value: function removeListener(eventType) {
      var commandThreadFactory = this.eventTypeToCommandThreadFactory[eventType];

      if (commandThreadFactory) {
        delete this.eventTypeToCommandThreadFactory[eventType];

        this.domNode.removeEventListener(eventType, this._eventHandler);

        return commandThreadFactory;
      }

      if (true) {
        throw Error('Controller:removeListener(): could not find a listener for \'' + eventType + '\'', this);
      }
    }
  }, {
    key: 'hasListener',
    value: function hasListener(eventType) {
      return this.getListener(eventType) !== undefined;
    }
  }, {
    key: 'invoke',
    value: function invoke(ringaEvent, commandThreadFactory) {
      var commandThread = commandThreadFactory.build(ringaEvent);

      this.commandThreads.add(commandThread);

      ringaEvent._dispatchEvent(_RingaEvent2.default.PREHOOK);

      // TODO PREHOOK should allow the handler to cancel running of the thread.
      commandThread.run(ringaEvent, this.threadDoneHandler.bind(this), this.threadFailHandler.bind(this));

      return commandThread;
    }

    //-----------------------------------
    // Events
    //-----------------------------------

  }, {
    key: '_eventHandler',
    value: function _eventHandler(customEvent) {
      // This event might be a something like 'click' which does not have
      // an attached ringaEvent yet!
      customEvent.detail.ringaEvent = customEvent.detail.ringaEvent || new _RingaEvent2.default(customEvent.type, customEvent.detail, customEvent.bubbles, customEvent.cancellable);

      // TODO, how do we handle two controllers handling the same event?
      if (customEvent.detail.ringaEvent.controller) {
        throw Error('Controller::_eventHandler(): event was received that has already been handled by another controller: ' + customEvent);
      }

      customEvent.detail.ringaEvent.controller = this;

      var commandThreadFactory = this.eventTypeToCommandThreadFactory[customEvent.type];

      if (true && !commandThreadFactory) {
        throw Error('Controller::_eventHandler(): caught an event but there is no associated CommandThreadFactory! Fatal error.');
      }

      customEvent.detail.ringaEvent.caught = true;

      var abort = void 0;
      try {
        abort = this.preInvokeHandler(customEvent.detail.ringaEvent);
      } catch (error) {
        // At this point we don't have a thread yet, so this is all kinds of whack.
        if (this.options.consoleLogFails) {
          console.error(error);
        }

        customEvent.detail.ringaEvent._fail(error);
      }

      if (abort === true) {
        return;
      }

      try {
        var _commandThread = this.invoke(customEvent.detail.ringaEvent, commandThreadFactory);

        this.postInvokeHandler(customEvent.detail.ringaEvent, _commandThread);
      } catch (error) {
        this.threadFailHandler(commandThread, error);
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
    value: function postInvokeHandler(ringaEvent, commandThread) {
      // Can be extended by a subclass
    }
  }, {
    key: 'threadDoneHandler',
    value: function threadDoneHandler(commandThread) {
      if (true && !this.commandThreads.has(commandThread.id)) {
        throw Error('Controller::threadDoneHandler(): could not find thread with id ' + commandThread.id);
      }

      this.commandThreads.remove(commandThread);

      commandThread.ringaEvent._done();
    }
  }, {
    key: 'threadFailHandler',
    value: function threadFailHandler(commandThread, error, kill) {
      if (this.options.consoleLogFails) {
        console.error(error);
      }

      if (kill) {
        if (this.commandThreads.has(commandThread.id)) {
          this.commandThreads.remove(commandThread);
        } else if (true) {
          throw Error('Controller:threadFailHandler(): the CommandThread with the id ' + commandThread.id + ' was not found.');
        }
      }

      commandThread.ringaEvent._fail(error);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(eventType, details) {
      return new _RingaEvent2.default(eventType, details).dispatch(this.domNode);
    }
  }]);

  return Controller;
}(_RingaObject3.default);

exports.default = Controller;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CommandAbstract2 = __webpack_require__(0);

var _CommandAbstract3 = _interopRequireDefault(_CommandAbstract2);

var _command = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Command is the base class for all command objects that are run in a Ringa application or module.
 */
var Command = function (_CommandAbstract) {
  _inherits(Command, _CommandAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param commandThread The parent thread that owns this command.
   * @param argNames For efficiency, the CommandFactory instrospects this Command's execute(...) arguments.
   */
  function Command(commandThread, argNames) {
    _classCallCheck(this, Command);

    var _this = _possibleConstructorReturn(this, (Command.__proto__ || Object.getPrototypeOf(Command)).call(this, commandThread));

    _this.argNames = argNames;
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


  _createClass(Command, [{
    key: '_execute',
    value: function _execute(doneHandler, failHandler) {
      _get(Command.prototype.__proto__ || Object.getPrototypeOf(Command.prototype), '_execute', this).call(this, doneHandler, failHandler);

      var args = (0, _command.buildArgumentsFromRingaEvent)(this, this.argNames, this.commandThread.ringaEvent);

      var donePassedAsArg = this.argNames.indexOf('done') !== -1;

      // If the function returns true, we continue on the next immediate cycle.
      // If, however the function requested that 'done' be passed, we assume it is an asynchronous
      // function and let the function determine when it will call done.
      if (this.execute.apply(this, args) && !donePassedAsArg) {
        this.done();
      }
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
  }]);

  return Command;
}(_CommandAbstract3.default);

exports.default = Command;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */

    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(13)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
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
/* 13 */
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*===========================================================================*\
 * Requires
\*===========================================================================*/
var JClass = __webpack_require__(15);

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
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RingaHashArray2 = __webpack_require__(7);

var _RingaHashArray3 = _interopRequireDefault(_RingaHashArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommandThread = function (_RingaHashArray) {
  _inherits(CommandThread, _RingaHashArray);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  function CommandThread(id, commandThreadFactory, options) {
    _classCallCheck(this, CommandThread);

    var _this = _possibleConstructorReturn(this, (CommandThread.__proto__ || Object.getPrototypeOf(CommandThread)).call(this, id));

    _this.options = options;
    _this.commandThreadFactory = commandThreadFactory;

    _this.running = false;

    // TODO: a command thread can potentially spawn child command threads
    _this.children = [];
    return _this;
  }

  _createClass(CommandThread, [{
    key: 'buildCommands',


    //-----------------------------------
    // Methods
    //-----------------------------------
    value: function buildCommands() {
      var _this2 = this;

      this.commandThreadFactory.all.forEach(function (commandFactory) {
        var command = commandFactory.build(_this2);

        _this2.add(command);
      });
    }
  }, {
    key: 'run',
    value: function run(ringaEvent, doneHandler, failHandler) {
      if (true && this.running) {
        throw Error('CommandThread::run(): you cannot start a thread while it is already running!');
      }

      if (true && this.commandThreadFactory.all.length === 0) {
        throw Error('CommandThread::run(): attempting to run a thread with no commands!');
      }

      if (true && !ringaEvent) {
        throw Error('CommandThread::run(): cannot run a thread without a RingaEvent!');
      }

      this.ringaEvent = ringaEvent;
      this.doneHandler = doneHandler;
      this.failHandler = failHandler;

      this.buildCommands();

      // The current command we are running
      this.index = 0;

      this.executeNext();
    }
  }, {
    key: 'executeNext',
    value: function executeNext() {
      var command = this.all[this.index];

      try {
        command._execute(this._commandDoneHandler.bind(this), this._commandFailHandler.bind(this));
      } catch (error) {
        this._commandFailHandler(error);
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
    key: '_commandDoneHandler',
    value: function _commandDoneHandler(error) {
      this.index++;

      if (this.index < this.all.length) {
        setTimeout(this.executeNext.bind(this), 0);
      } else {
        this.doneHandler(this);
      }
    }
  }, {
    key: '_commandFailHandler',
    value: function _commandFailHandler(error, kill) {
      this.error = error;

      this.failHandler(this, error, kill);

      if (!kill) {
        this._commandDoneHandler(error);
      }
    }
  }, {
    key: 'controller',
    get: function get() {
      return this.commandThreadFactory.controller;
    }
  }]);

  return CommandThread;
}(_RingaHashArray3.default);

exports.default = CommandThread;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CommandAbstract2 = __webpack_require__(0);

var _CommandAbstract3 = _interopRequireDefault(_CommandAbstract2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommandEventWrapper = function (_CommandAbstract) {
  _inherits(CommandEventWrapper, _CommandAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new CommandEventWrapper
   *
   * @param commandThread The parent thread that owns this command.
   * @param ringaEventFactory The event to dispatch and watch!
   */
  function CommandEventWrapper(commandThread, ringaEventFactory) {
    _classCallCheck(this, CommandEventWrapper);

    var _this = _possibleConstructorReturn(this, (CommandEventWrapper.__proto__ || Object.getPrototypeOf(CommandEventWrapper)).call(this, commandThread));

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


  _createClass(CommandEventWrapper, [{
    key: '_execute',
    value: function _execute(doneHandler, failHandler) {
      _get(CommandEventWrapper.prototype.__proto__ || Object.getPrototypeOf(CommandEventWrapper.prototype), '_execute', this).call(this, doneHandler, failHandler);

      this.dispatchedRingaEvent = this.ringaEventFactory.build(this);

      this.dispatchedRingaEvent.addDoneListener(this.dispatchedRingaEventDoneHandler.bind(this));
      this.dispatchedRingaEvent.addFailListener(this.dispatchedRingaEventFailHandler.bind(this));

      var domNode = this.dispatchedRingaEvent.domNode || this.ringaEvent.target;

      this.dispatchedRingaEvent.dispatch(domNode);

      if (this.dispatchedRingaEvent.detail.requireCatch && !this.dispatchedRingaEvent.caught) {
        this.fail(Error('CommandEventWrapper::_execute(): event ' + this.dispatchedRingaEvent.type + ' was expected to be caught and it was not.'));
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.id + ': ' + this.ringaEventFactory.eventType;
    }

    //-----------------------------------
    // Events
    //-----------------------------------

  }, {
    key: 'dispatchedRingaEventDoneHandler',
    value: function dispatchedRingaEventDoneHandler() {
      this.done();
    }
  }, {
    key: 'dispatchedRingaEventFailHandler',
    value: function dispatchedRingaEventFailHandler(error) {
      this.fail(error);
    }
  }]);

  return CommandEventWrapper;
}(_CommandAbstract3.default);

exports.default = CommandEventWrapper;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CommandAbstract2 = __webpack_require__(0);

var _CommandAbstract3 = _interopRequireDefault(_CommandAbstract2);

var _command = __webpack_require__(8);

var _function = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * CommandFunctionWrapper is a wrapper for a single function. As a general rule you will not use this directly.
 */
var CommandFunctionWrapper = function (_CommandAbstract) {
  _inherits(CommandFunctionWrapper, _CommandAbstract);

  //-----------------------------------
  // Constructor
  //-----------------------------------
  /**
   * Constructor for a new Command. This *must* be called via super() from a subclass constructor.
   *
   * @param commandThread The parent thread that owns this command.
   * @param func The function that is run when the CommandThread calls _execute().
   */
  function CommandFunctionWrapper(commandThread, func) {
    _classCallCheck(this, CommandFunctionWrapper);

    var _this = _possibleConstructorReturn(this, (CommandFunctionWrapper.__proto__ || Object.getPrototypeOf(CommandFunctionWrapper)).call(this, commandThread));

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


  _createClass(CommandFunctionWrapper, [{
    key: '_execute',
    value: function _execute(doneHandler, failHandler) {
      _get(CommandFunctionWrapper.prototype.__proto__ || Object.getPrototypeOf(CommandFunctionWrapper.prototype), '_execute', this).call(this, doneHandler, failHandler);

      var args = (0, _command.buildArgumentsFromRingaEvent)(this, this.expectedArguments, this.ringaEvent);

      var donePassedAsArg = this.expectedArguments.indexOf('done') !== -1;

      try {
        // If the function requested that 'done' be passed, we assume it is an asynchronous
        // function and let the function determine when it will call done.
        this.func.apply(undefined, args);

        if (!donePassedAsArg) {
          this.done();
        }
      } catch (error) {
        this.fail(error);
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.id + ': ' + this.func.toString().substr(0, 128);
    }
  }]);

  return CommandFunctionWrapper;
}(_CommandAbstract3.default);

exports.default = CommandFunctionWrapper;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CommandAbstract2 = __webpack_require__(0);

var _CommandAbstract3 = _interopRequireDefault(_CommandAbstract2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommandPromiseWrapper = function (_CommandAbstract) {
  _inherits(CommandPromiseWrapper, _CommandAbstract);

  function CommandPromiseWrapper() {
    _classCallCheck(this, CommandPromiseWrapper);

    return _possibleConstructorReturn(this, (CommandPromiseWrapper.__proto__ || Object.getPrototypeOf(CommandPromiseWrapper)).apply(this, arguments));
  }

  return CommandPromiseWrapper;
}(_CommandAbstract3.default);

exports.default = CommandPromiseWrapper;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CommandAbstract2 = __webpack_require__(0);

var _CommandAbstract3 = _interopRequireDefault(_CommandAbstract2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommandsParallelWrapper = function (_CommandAbstract) {
  _inherits(CommandsParallelWrapper, _CommandAbstract);

  function CommandsParallelWrapper() {
    _classCallCheck(this, CommandsParallelWrapper);

    return _possibleConstructorReturn(this, (CommandsParallelWrapper.__proto__ || Object.getPrototypeOf(CommandsParallelWrapper)).apply(this, arguments));
  }

  return CommandsParallelWrapper;
}(_CommandAbstract3.default);

exports.default = CommandsParallelWrapper;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RingaEvent = exports.Controller = exports.CommandThreadFactory = exports.CommandFactory = exports.Command = undefined;

var _Command = __webpack_require__(11);

var _Command2 = _interopRequireDefault(_Command);

var _CommandFactory = __webpack_require__(3);

var _CommandFactory2 = _interopRequireDefault(_CommandFactory);

var _CommandThreadFactory = __webpack_require__(4);

var _CommandThreadFactory2 = _interopRequireDefault(_CommandThreadFactory);

var _Controller = __webpack_require__(10);

var _Controller2 = _interopRequireDefault(_Controller);

var _RingaEvent = __webpack_require__(2);

var _RingaEvent2 = _interopRequireDefault(_RingaEvent);

var _RingaEventFactory = __webpack_require__(5);

var _RingaEventFactory2 = _interopRequireDefault(_RingaEventFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Command = _Command2.default;
exports.CommandFactory = _CommandFactory2.default;
exports.CommandThreadFactory = _CommandThreadFactory2.default;
exports.Controller = _Controller2.default;
exports.RingaEvent = _RingaEvent2.default;
exports.default = {
  Controller: _Controller2.default,
  Command: _Command2.default,
  CommandFactory: _CommandFactory2.default,
  CommandThreadFactory: _CommandThreadFactory2.default,
  Event: _RingaEvent2.default,
  dispatch: function dispatch(eventType, details) {
    var domNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;

    return new _RingaEvent2.default(eventType, details).dispatch(domNode);
  },
  iif: function iif(condition, executor) {},
  Spawn: function Spawn(executor) {},
  Bind: function Bind(commandAbstract) {},
  EventFactory: function EventFactory(eventType, detail, domNode) {
    var requireCatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var bubbles = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var cancellable = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

    return new _RingaEventFactory2.default(eventType, detail, domNode, requireCatch, bubbles, cancellable);
  }
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=ringa.js.map