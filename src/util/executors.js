import {uglifyWhitelist} from './debug';

export const injectionInfo = {
  byName: {}
};

let hasWarnedAboutWhitelist = false;
let lastWarnedLength = 0;
const needsAddingToWhitelist = [];

export const getInjections = function(ringaEvent, executor = undefined) {
  let mergeControllerInjections = function(injections, controller) {
    // Merge controller.options.injections into our injector
    let i = controller.options.injections;
    for (let key in i) {
      let _i = i[key];
      if (typeof i[key] === 'function') {
        _i = i[key]();
      }

      injections[key] = _i;
    }
  }

  let injections;

  // In the RingaEvent.then() resolve callback, we don't have a currently running executor so we have to
  // check for that here and then pass undefined if we don't have one.
  if (executor) {
    injections = executor._injections = executor._injections || {
        $controller: executor.controller,
        $thread: executor.thread,
        $ringaEvent: ringaEvent,
        event: ringaEvent.event, // Used for DOM events that trigger a Ringa action
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

    if (executor._customInjections) {
      injections = Object.assign(injections, executor._customInjections);
    }

    // Merge only injections for the controller that is the current context for the executor.
    mergeControllerInjections(injections, executor.controller);
  } else {
    injections = {};

    // We loop through all the controllers that caught and handled the event and combine all of their injections
    // together... this probably needs to be thought through some more, but it will work for 99% of cases.
    // Note that this means the if Controllers A and B both handled the event in order (A, B) and they both
    // have an injection named 'model', then only the 'model' injection from A will be available.
    ringaEvent._controllers.forEach(controller => {
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

  let re = ringaEvent;
  let events = [];

  while (re) {
    events.push(re);
    re = re.lastEvent;
  }

  // TODO write units tests to verify this is working okay.
  events.reverse().forEach(event => {
    if (event.detail) {
      for (let key in event.detail) {
        if (key === 'ringaEvent')
          continue;
        injections[key] = event.detail[key];
      }
    }
  });

  if (__DEV__) {
    for (var key in injections) {
      if (/[0-9]$/g.test(key)) {
        continue;
      }

      if (RINGA_CURRENT_WHITELIST instanceof Array) {
        if (RINGA_CURRENT_WHITELIST.indexOf(key) === -1 && needsAddingToWhitelist.indexOf(key) === -1) {
          needsAddingToWhitelist.push(key);
        }
      } else if (!hasWarnedAboutWhitelist) {
        hasWarnedAboutWhitelist = true;

        console.error('Ringa Non-Fatal Error: please setup your build to set window.RINGA_CURRENT_WHITELIST to the current Array whitelist you use in your production build.' +
          'You can use the Webpack Define plugin, for example, to do this. By setting this up, Ringa will let you know while running when it encounters a' +
          ' new variable that is not already defined in your build. This will greatly help when deploying to production. Please also remember NOT to uglify class names!' +
          ' Here is an example of how to do this with the define plugin if you store your whitelist in an external file:\n\n' +
          '    new webpack.DefinePlugin({\n' +
          '      __DEV__: true,\n' +
          '      RINGA_CURRENT_WHITELIST: `${JSON.stringify(require(\'./uglifyMangleWhitelist.json\'))}`\n' +
          '      ...\n' +
          '    });\n' +
          'Another option if you want your application to rebuild every time you edit the whitelist would be to import your uglify whitelist JSON directly into your javascript build (e.g. App.js).');
      }

      injectionInfo.byName[key] = key;
    }

    if (needsAddingToWhitelist.length !== lastWarnedLength) {
      const whitelist = uglifyWhitelist(RINGA_CURRENT_WHITELIST);

      console.error(`Ringa Whitelist Update!`);
      if (needsAddingToWhitelist.length < 10) {
        console.error(`Found these variables: ${needsAddingToWhitelist.join(',')}`);
      }
      console.error(`Update Uglify Whitelist (${needsAddingToWhitelist.length} new items)! Replace this is in your production settings and in RINGA_CURRENT_WHITELIST: \n\n` + JSON.stringify(whitelist));

      lastWarnedLength = needsAddingToWhitelist.length;
    }
  }

  return injections;
}

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
export const buildArgumentsFromRingaEvent = function(executor, expectedArguments, ringaEvent) {
  let args = [];

  if (!(expectedArguments instanceof Array)) {
    throw Error('buildArgumentsFromRingaEvent(): An internal error has occurred in that expectedArguments is not an Array!');
  }

  let injections = getInjections(ringaEvent, executor);

  expectedArguments.forEach((argName) => {
    if (injections.hasOwnProperty(argName)) {
      args.push(injections[argName]);
    } else if (argName.startsWith('_')) {
      // We make an exception and don't try to inject for arguments that begin with _ and do not warn either.
    } else {
      let s = ringaEvent.dispatchStack ? ringaEvent.dispatchStack[0] : 'unknown stack.';

      let str = `Ringa Injection Warning:\n` +
                `\t` + ringaEvent.debugHistory + `\n` +
                (executor ? `\tExecutor: '${executor.toString()}' of type ${executor.constructor.name}\n` : `No active Executor\n`) +
                `\tMissing: ${argName}\n` +
                `\tRequired: ${expectedArguments.join(', ')}\n` +
                `\tAvailable: ${Object.keys(injections).sort().join(', ')}\n` +
                `\tIf you are minifying JS, make sure you add the original, unmangled property name to the UglifyJSPlugin mangle exceptions.\n` +
                `\tDispatched from: ${s}`;
      console.warn(str);

      args.push(undefined);
    }
  });

  return args;
};
