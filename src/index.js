import Command from './executors/Command';
import ExecutorFactory from './ExecutorFactory';
import ThreadFactory from './ThreadFactory';
import Controller from './Controller';
import RingaEvent from './RingaEvent';
import RingaObject from './RingaObject';
import RingaEventFactory from './RingaEventFactory';
import AssignFactory from './factories/AssignFactory';
import Model from './Model';
import ModelWatcher from './ModelWatcher';
import Bus, {busses} from './Bus';
import IifExecutor from './executors/IifExecutor';
import {isDOMNode} from './util/type';

import {ids} from './RingaObject';
import {executorCounts} from './ExecutorAbstract';

export function dispatch (eventType, details, bus = document) {
  if (isDOMNode(details)) {
    bus = details;
    details = undefined;
  }
  return new RingaEvent(eventType, details).dispatch(bus);
}

export function iif (condition, trueExecutor, falseExecutor) {
  return new ExecutorFactory(IifExecutor, { condition, trueExecutor, falseExecutor });
}

export function spawn (executor) {

}

export function assign (executor, detail) {
  return new AssignFactory(executor, detail);
}

export function event (eventType, detail, bus, requireCatch = false, bubbles = true, cancellable = true) {
  return new RingaEventFactory(eventType, detail, bus, requireCatch, bubbles, cancellable);
}

export function notify(eventType) {
  return ($controller, $ringaEvent) => {
    $controller.notify($ringaEvent, eventType);
  };
}

export function __hardReset() {
  ids.map = {};
  executorCounts.map = new Map();
  busses.count = 0;
}

export { Command, ExecutorFactory, ThreadFactory, Controller, RingaEvent, RingaObject, Bus };

export default {
  Controller,
  Command,
  ExecutorFactory,
  ThreadFactory,
  Event: RingaEvent,
  Model,
  ModelWatcher,
  Bus,
  RingaObject,
  dispatch,
  iif,
  spawn,
  event,
  assign,
  notify
};