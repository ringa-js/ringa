/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {__hardReset} from '../src/index';
import CommandSimple from './shared/CommandSimple';
import CommandComplexArgs from './shared/CommandComplexArgs';
import CommandPromise from './shared/CommandPromise';
import {getArgNames} from '../src/util/function';
import {buildArgumentsFromRingaEvent} from '../src/util/executors';

const TEST_EVENT = 'testEvent';

describe('Command', () => {
  let command, commandComplex, domNode, reactNode, threadFactory, thread, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new Ringa.Controller('testController', domNode, {
      timeout: 100000
    });

    threadFactory = new Ringa.ThreadFactory('testCommandThreadFactory', [
      CommandSimple
    ]);

    controller.addListener(TEST_EVENT, threadFactory);

    // Build a thread but do not run it right away because we are testing!
    thread = threadFactory.build(new Ringa.Event(TEST_EVENT), false);

    command = new CommandSimple(thread, ['testObject']);
    commandComplex = new CommandComplexArgs(thread);

    commandComplex.argNames = getArgNames(commandComplex.execute);
  });

  afterEach(() => {
    __hardReset();
  });

  it('should have properly setup the beforeEach objects', () => {
    expect(domNode.nodeType).toEqual(1);
    expect(controller.id).toEqual('Controller1');
    expect(threadFactory.name).toEqual('testCommandThreadFactory');
    expect(thread.name).toEqual('ThreadFactory1_Thread0');
    expect(threadFactory.id).toEqual('ThreadFactory1');
    expect(thread.id).toEqual('Thread1');
  });

  it('should have a properly defined id', () => {
    expect(command.id).toEqual('Controller1_CommandSimple1');
  });

  it('should start and properly store the thread', () => {
    expect(command.thread).toEqual(thread);
  });

  it('should proxy the ringaEvent property from the thread', () => {
    expect(command.ringaEvent).toEqual(thread.ringaEvent);
  });

  it('should proxy the controller property from the thread', () => {
    expect(command.controller).toEqual(thread.controller);
  });

  it('should have a working buildArgumentsFromRingaEvent function (success scenario 1)', () => {
    let ringaEvent = new Ringa.Event('testEvent', {
      testObject: 'test',
      a: 'a',
      b: 'b',
      c: 'c'
    });

    let args = buildArgumentsFromRingaEvent(commandComplex, commandComplex.argNames, ringaEvent);

    // ringaEvent, target, controller, thread, testObject, a, b, c
    expect(args[0]).toEqual(ringaEvent);
    expect(args[1]).toEqual(undefined);
    expect(args[2]).toEqual(controller);
    expect(args[3]).toEqual(thread);
    expect(args[4]).toEqual('test');
    expect(args[5]).toEqual('a');
    expect(args[6]).toEqual('b');
    expect(args[7]).toEqual('c');
    expect(args.length).toEqual(8);
  });

  it('should have a working buildArgumentsFromRingaEvent function (2/X)', () => {
    let ringaEvent = new Ringa.Event('testEvent', {
      testObject: 'test',
      a: 'a',
      b: 'b'
    });

    expect(() => {
      buildArgumentsFromRingaEvent(commandComplex, commandComplex.argNames, ringaEvent);
    }).toThrow();
  });

  it('should have a working buildArgumentsFromRingaEvent function (2/X)', () => {
    let ringaEvent = new Ringa.Event('testEvent', undefined);

    expect(() => {
      buildArgumentsFromRingaEvent(commandComplex, commandComplex.argNames, ringaEvent);
    }).toThrow();
  });

  it('should work properly when a promise is returned', (done) => {

    controller.addListener('promiseTest', [
      CommandPromise,
      $lastPromiseResult => {
        expect($lastPromiseResult.someValue).toEqual('CommandPromise:someValue');
        done();
      }
    ]);

    Ringa.dispatch('promiseTest', {
      shouldFail: false
    }, domNode);
  }, 100000);

  it('should work properly when a promise is returned and fails', (done) => {

    controller.options.consoleLogFails = false;

    controller.addListener('promiseTest', [
      CommandPromise,
      $lastPromiseError => {
        expect($lastPromiseError).toEqual('CommandPromise:someError');
        done();
      }
    ]);

    Ringa.dispatch('promiseTest', {
      shouldFail: true
    }, domNode);
  }, 500);
});
