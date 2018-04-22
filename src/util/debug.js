import dateformat from 'dateformat';
import {injectionInfo} from './executors';
import {ids} from '../RingaObject';

export function now() {
  return new Date();
}

export function format(date) {
  if (!date) {
    return '?';
  }

  return dateformat(date, 'hh:mm:ss');
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
export function ringaEventToDebugString(ringaEvent) {
  let thread = ringaEvent.thread;
  let controller = ringaEvent.controller;
  let out = '';

  // Unfortunately because the state is not a "tree" we cannot generate this using
  // recursion, which would be much more elegant
  out += `${ringaEvent.id} ${ringaEvent.dispatched ? 'dispatched' : ''}\n`;

  if (controller) {
    out += `  ${controller.id}`;

    if (thread) {
      out += `    ${thread.id}`;

      thread._list.forEach(command => {
        out += `      ${command.id} [${format(command.startTime)} - ${format(command.endTime)}]\n`;
      });
    }
  } else {
    out += '  not yet caught.\n';
  }

  return out;
}

export function injectionNames() {
  return Object.keys(injectionInfo.byName);
}

export function constructorNames() {
  return Object.keys(ids.constructorNames);
}

export function uglifyWhitelist(mergeArray, includeConstructorNames = false) {
  let arr = injectionNames();

  if (includeConstructorNames) {
    arr = arr.concat(constructorNames());
  }

  if (mergeArray) {
    mergeArray.forEach(name => {
      if (!injectionInfo.byName[name]) {
        arr.push(name);
      }
    });
  }

  arr = arr.sort();

  return arr;
}
