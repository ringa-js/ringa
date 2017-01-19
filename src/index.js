import inject from './decorators/inject';
import Command from './Command';
import CommandFactory from './CommandFactory';
import CommandThreadFactory from './CommandThreadFactory';
import Controller from './Controller';
import Injector from './Injector';
import Event from './RingEvent';

const ForceUpdate = Symbol('ForceUpdate');

export { inject, Command, CommandFactory, CommandThreadFactory, Controller, Injector, Event as RingEvent, ForceUpdate };

export default {
  inject,
  ForceUpdate,
  Controller,
  Command,
  CommandFactory,
  CommandThreadFactory,
  Injector,
  Event,
  dispatch: (eventType, details, domNode = document) => {
    return new Event(eventType, details).dispatch(domNode);
  }
};