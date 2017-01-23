/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ring from '../src/index';
import CommandSimple from './shared/CommandSimple';
import CommandComplexArgs from './shared/CommandComplexArgs';
import {getArgNames} from '../src/util/function';
import {buildArgumentsFromRingEvent} from '../src/util/command';

const TEST_EVENT = 'testEvent';

describe('Command', () => {
  let command, commandComplex, domNode, reactNode, commandThreadFactory, commandThread, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new Ring.Controller('testController', domNode, {
      timeout: 50
    });

    commandThreadFactory = new Ring.CommandThreadFactory('testCommandThreadFactory', [
      CommandSimple
    ]);

    controller.addListener(TEST_EVENT, commandThreadFactory);

    // Build a thread but do not run it right away because we are testing!
    commandThread = commandThreadFactory.build(new Ring.Event(TEST_EVENT), false);

    command = new CommandSimple(commandThread, ['testObject']);
    commandComplex = new CommandComplexArgs(commandThread);

    commandComplex.argNames = getArgNames(commandComplex.execute);
  });

  it('should have properly setup the beforeEach objects', () => {
    expect(domNode.nodeType).toEqual(1);
    expect(controller.id).toEqual('testController');
    expect(commandThreadFactory.id).toEqual('testCommandThreadFactory');
    expect(commandThread.id).toEqual('testController_CommandThread0');
  });

  it('should have a properly defined id', () => {
    expect(command.id).toEqual('testController_CommandSimple');
  });

  it('should start with finished set to false', () => {
    expect(command.finished).toEqual(false);
  });

  it('should start and properly store the commandThread', () => {
    expect(command.commandThread).toEqual(commandThread);
  });

  it('should start and store the cached argNames', () => {
    let argNames = ['testObject'];
    command = new CommandSimple(commandThread, argNames);
    expect(command.argNames).toEqual(argNames);
  });

  it('should proxy the ringEvent property from the commandThread', () => {
    expect(command.ringEvent).toEqual(commandThread.ringEvent);
  });

  it('should proxy the controller property from the commandThread', () => {
    expect(command.controller).toEqual(commandThread.controller);
  });

  it('should have a working buildArgumentsFromRingEvent function (success scenario 1)', () => {
    let ringEvent = new Ring.Event('testEvent', {
      testObject: 'test',
      a: 'a',
      b: 'b',
      c: 'c'
    });

    let args = buildArgumentsFromRingEvent(commandComplex, commandComplex.argNames, ringEvent);

    // ringEvent, target, controller, commandThread, testObject, a, b, c
    expect(args[0]).toEqual(ringEvent);
    expect(args[1]).toEqual(null);
    expect(args[2]).toEqual(controller);
    expect(args[3]).toEqual(commandThread);
    expect(args[4]).toEqual('test');
    expect(args[5]).toEqual('a');
    expect(args[6]).toEqual('b');
    expect(args[7]).toEqual('c');
    expect(args.length).toEqual(8);
  });

  it('should have a working buildArgumentsFromRingEvent function (2/X)', () => {
    let ringEvent = new Ring.Event('testEvent', {
      testObject: 'test',
      a: 'a',
      b: 'b'
    });

    expect(() => {
      buildArgumentsFromRingEvent(commandComplex, commandComplex.argNames, ringEvent);
    }).toThrow();
  });

  it('should have a working buildArgumentsFromRingEvent function (2/X)', () => {
    let ringEvent = new Ring.Event('testEvent', undefined);

    expect(() => {
      buildArgumentsFromRingEvent(commandComplex, commandComplex.argNames, ringEvent);
    }).toThrow();
  });
});
