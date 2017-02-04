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
import IifExecutor from './executors/IifExecutor';
import {isNode} from './util/type';

import {ids} from './RingaObject';
import {executorCounts} from './ExecutorAbstract';

export function dispatch (eventType, detail, domNode = document) {
  if (isNode(detail)) {
    domNode = detail;
    detail = undefined;
  }
  return new RingaEvent(eventType, detail).dispatch(domNode);
}

export function iif (condition, trueExecutor, falseExecutor) {
  return new ExecutorFactory(IifExecutor, { condition, trueExecutor, falseExecutor });
}

export function spawn (executor) {

}

export function assign (executor, detail) {
  return new AssignFactory(executor, detail);
}

export function event (eventType, detail, domNode, requireCatch = false, bubbles = true, cancellable = true) {
  return new RingaEventFactory(eventType, detail, domNode, requireCatch, bubbles, cancellable);
}

export function notify(eventType) {
  return ($controller, $ringaEvent) => {
    $controller.notify($ringaEvent, eventType);
  };
}

export function __hardReset() {
  ids.map = {};
  executorCounts.map = new Map();
}

export { Command, ExecutorFactory, ThreadFactory, Controller, RingaEvent, RingaObject };

export default {
  Controller,
  Command,
  ExecutorFactory,
  ThreadFactory,
  Event: RingaEvent,
  Model,
  ModelWatcher,
  RingaObject,
  dispatch,
  iif,
  spawn,
  event,
  assign,
  notify
};