import inject from './decorators/inject';
import Command from './commands/Command';
import CommandFactory from './CommandFactory';
import CommandThreadFactory from './CommandThreadFactory';
import Controller from './Controller';
import Event from './RingEvent';

const ForceUpdate = Symbol('ForceUpdate');

export { inject, Command, CommandFactory, CommandThreadFactory, Controller, Event as RingEvent, ForceUpdate };

export default {
  inject,
  ForceUpdate,
  Controller,
  Command,
  CommandFactory,
  CommandThreadFactory,
  Event,
  dispatch: (eventType, details, domNode = document) => {
    return new Event(eventType, details).dispatch(domNode);
  },
  iif: (condition, executor) => {

  },
  Spawn: (executor) => {

  },
  Bind: (commandAbstract, ...params) => {

  }
};