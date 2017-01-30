import Command from './executors/Command';
import ExecutorFactory from './ExecutorFactory';
import ThreadFactory from './ThreadFactory';
import Controller from './Controller';
import RingaEvent from './RingaEvent';
import RingaEventFactory from './RingaEventFactory';
import AssignFactory from './factories/AssignFactory';

export function dispatch (eventType, details, domNode = document) {
  return new RingaEvent(eventType, details).dispatch(domNode);
};
export function iif (condition, executor) {

};
export function spawn (executor) {

};
export function assign (executor, detail) {
  return new AssignFactory(executor, detail);
};
export function event (eventType, detail, domNode, requireCatch = false, bubbles = true, cancellable = true) {
  return new RingaEventFactory(eventType, detail, domNode, requireCatch, bubbles, cancellable);
};
export function notify(eventType) {
  return ($controller, $ringaEvent) => {
    $controller.notify($ringaEvent, eventType);
  };
};

export { Command, ExecutorFactory, ThreadFactory, Controller, RingaEvent };

export default {
  Controller,
  Command,
  ExecutorFactory,
  ThreadFactory,
  Event: RingaEvent,
  dispatch,
  iif,
  spawn,
  event,
  assign,
  notify
};