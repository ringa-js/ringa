/**
 * This method is used for injecting RingEvent.detail properties into a function owned by a CommandAbstract. It uses the data
 * gathered from introspecting a provided function to determine a set of arguments to
 * call the function with. It maps everything on ringEvent.detail to arguments on the function.
 *
 * If our function is:
 *
 *    execute(user, filter) {...}
 *
 *  Then expectedArguments should be ['user', 'filter']
 *
 *  To generate the expected arguments, see util/function.js::getArgNames.
 *
 * We want to find ringEvent.detail['user'] and ringEvent.detail['filter']
 * and pass those through and error if one of them is missing.
 *
 * Note that there are other properties that can be requested in the arguments list of execute:
 *
 * controller: the Controller object that is handling this thread
 * commandThread: the CommandThread object that built this Command
 * ringEvent: the ringEvent itself (instead of one of its detail properties)
 * customEvent: the customEvent that is wrapped by the ringEvent that was used to bubble up the DOM
 * target: the target DOMNode that triggered the customEvent was dispatched on.
 * done: the parent CommandAbstract::done(). CommandFunction is an example of where this is needed.
 * fail: the parent CommandAbstract::fail(). CommandFunction is an example of where this is needed.
 *
 * @param commandAbstract The CommandAbstract subclass instance.
 * @param expectedArguments An array of argument names that the target function expects.
 * @param ringEvent An instance of RingEvent that has been dispatched and contains a details Object with properties to be injected.
 *
 * @returns {Array}
 */
export const buildArgumentsFromRingEvent = function(commandAbstract, expectedArguments, ringEvent) {
  let args = [];

  if (!(expectedArguments instanceof Array)) {
    throw Error('buildArgumentsFromRingEvent(): An internal error has occurred in that expectedArguments is not an Array!');
  }

  let injections = commandAbstract._injections = commandAbstract._injections || {
      controller: commandAbstract.controller,
      commandThread: commandAbstract.commandThread,
      ringEvent: ringEvent,
      customEvent: ringEvent.customEvent,
      target: ringEvent.target,
      done: commandAbstract.done,
      fail: commandAbstract.fail
    };

  // Merge controller.options.injections into our injector
  for (var key in commandAbstract.controller.options.injections) {
    injections[key] = commandAbstract.controller.options.injections[key];
  }

  expectedArguments.forEach((argName) => {
    if (ringEvent.detail && ringEvent.detail.hasOwnProperty(argName)) {
      args.push(ringEvent.detail[argName]);
    } else if (injections.hasOwnProperty(argName)) {
      args.push(injections[argName]);
    } else {
      throw Error(commandAbstract.toString() +
        ': the property \'' +
        argName +
        '\' was not provided on the dispatched ringEvent.' +
        'Expected Arguments were: [\'' + expectedArguments.join('\'.\'') +
        '\'] Dispatched from: ' +
        ringEvent.dispatchStack ? ringEvent.dispatchStack[0] : 'unknown stack.', ringEvent);
    }
  });

  return args;
};