import InspectorController from './debug/InspectorController';
import InspectorModel from './debug/InspectorModel';
import Command from './executors/Command';
import ExecutorFactory from './ExecutorFactory';
import ThreadFactory from './ThreadFactory';
import Controller from './Controller';
import RingaEvent, {eventIx} from './RingaEvent';
import RingaObject from './RingaObject';
import RingaEventFactory from './RingaEventFactory';
import AssignFactory from './factories/AssignFactory';
import Model from './Model';
import ModelWatcher from './ModelWatcher';
import Bus, {busses} from './Bus';
import IifExecutor from './executors/IifExecutor';
import ForEachExecutor from './executors/ForEachExecutor';
import IntervalExecutor from './executors/IntervalExecutor';
import SpawnExecutor from './executors/SpawnExecutor';
import {isDOMNode} from './util/type';
import {injectionNames, constructorNames, uglifyWhitelist} from './util/debug';
import {injectionInfo} from './util/executors';

import {ids} from './RingaObject';
import {executorCounts} from './ExecutorAbstract';

export function dispatch (eventType, detail, bus = document) {
  if (isDOMNode(detail)) {
    bus = detail;
    detail = undefined;
  }
  return new RingaEvent(eventType, detail).dispatch(bus);
}

export function forEach(arrayProperty, property, executor) {
  return new ExecutorFactory(ForEachExecutor, { arrayProperty, property, executor });
}

export function forEachParallel(arrayProperty, property, executor) {
  return new ExecutorFactory(ForEachExecutor, { arrayProperty, property, executor, sequential: false });
}

export function iif (condition, trueExecutor, falseExecutor) {
  return new ExecutorFactory(IifExecutor, { condition, trueExecutor, falseExecutor });
}

export function interval (condition, executor, milliseconds, options) {
  return new ExecutorFactory(IntervalExecutor, { condition, executor, milliseconds, options });
}

export function loop (condition, executor, options) {
  return new ExecutorFactory(IntervalExecutor, { condition, executor, milliseconds:0, options });
}

export function spawn (executor) {
  return new ExecutorFactory(SpawnExecutor, executor);
}

const debugStyle = 'background: #660000; color: white; font-weight: bold;';
export function stop ($ringaEvent, stop, done) {
  stop();

  let funcName = `go${$ringaEvent.id}`;

  console.log(`%cRinga STOP! RingaEvent:`, debugStyle);
  console.log($ringaEvent.debugDisplay());
  console.log(`%cDispatched From:`, debugStyle);
  console.log(`%c${$ringaEvent.dispatchStack.join('\n').toString().replace(/@/g, '\t')}`, debugStyle);
  console.log(`%c'window.ringaEvent' has been set and is ready for editing.`, debugStyle);
  console.log(`%cTo resume this stopped event thread, run '${funcName}()' in the console.`, debugStyle);

  if (typeof window !== 'undefined') {

    window.ringaEvent = $ringaEvent;
    window[funcName] = () => {
      window.ringaEvent = undefined;
      window[funcName] = undefined;
      console.log(`%cResuming Ringa Thread...`, debugStyle);
      done();
    };
  }
}

export function assign (executor, detail) {
  return new AssignFactory(executor, detail);
}

export function event (eventType, detail, bus, requireCatch = false, bubbles = true, cancellable = true, event = undefined) {
  return new RingaEventFactory(eventType, detail, bus, requireCatch, bubbles, cancellable, event);
}

export function notify(eventType) {
  return ($controller, $ringaEvent) => {
    $controller.notify($ringaEvent, eventType);
  };
}

export function debug() {
  return {
    injectionNames: injectionNames(),
    constructorNames: constructorNames(),
    uglifyWhitelist: uglifyWhitelist()
  };
}

if (typeof window !== 'undefined') {
  window.ringaDebug = debug;
}

export function __hardReset(debug) {
  ids.__hardReset(debug);
  executorCounts.map = new Map();
  busses.count = 0;
  injectionInfo.byName = {};
  eventIx.count = 0;
}

export { Command, ExecutorFactory, ThreadFactory, Controller, RingaEvent, RingaObject, Bus, Model, ModelWatcher, InspectorController, InspectorModel };

export default {
  InspectorController,
  InspectorModel,
  Controller,
  Command,
  ExecutorFactory,
  ThreadFactory,
  Event: RingaEvent,
  RingaEvent,
  Model,
  ModelWatcher,
  Bus,
  RingaObject,
  dispatch,
  iif,
  forEach,
  forEachParallel,
  interval,
  loop,
  spawn,
  event,
  assign,
  notify,
  stop
};