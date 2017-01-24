import inject from './decorators/inject';
import Command from './commands/Command';
import CommandFactory from './CommandFactory';
import CommandThreadFactory from './CommandThreadFactory';
import Controller from './Controller';
import RingaEvent from './RingaEvent';
import RingaEventFactory from './RingaEventFactory';

const ForceUpdate = Symbol('ForceUpdate');

export { inject, Command, CommandFactory, CommandThreadFactory, Controller, RingaEvent, ForceUpdate };

export default {
  inject,
  ForceUpdate,
  Controller,
  Command,
  CommandFactory,
  CommandThreadFactory,
  Event: RingaEvent,
  dispatch: (eventType, details, domNode = document) => {
    return new RingaEvent(eventType, details).dispatch(domNode);
  },
  iif: (condition, executor) => {

  },
  Spawn: (executor) => {

  },
  Bind: (commandAbstract, ...params) => {

  },
  EventFactory: (eventType, detail, domNode, requireCatch = false, bubbles = true, cancellable = true) => {
    return new RingaEventFactory(eventType, detail, domNode, requireCatch, bubbles, cancellable);
  }
};