import inject from './decorators/inject';
import Command from './commands/Command';
import CommandFactory from './CommandFactory';
import CommandThreadFactory from './CommandThreadFactory';
import Controller from './Controller';
import RingEvent from './RingEvent';

const ForceUpdate = Symbol('ForceUpdate');

export { inject, Command, CommandFactory, CommandThreadFactory, Controller, RingEvent, ForceUpdate };

export default {
  inject,
  ForceUpdate,
  Controller,
  Command,
  CommandFactory,
  CommandThreadFactory,
  Event: RingEvent,
  dispatch: (eventType, details, domNode = document) => {
    return new RingEvent(eventType, details).dispatch(domNode);
  },
  iif: (condition, executor) => {

  },
  Spawn: (executor) => {

  },
  Bind: (commandAbstract, ...params) => {

  }
};