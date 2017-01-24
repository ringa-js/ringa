/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ring from '../src/index';
import TestController from './shared/TestController';
import CommandThrow from './shared/CommandThrow';
import CommandFail from './shared/CommandFail';
import CommandSimple from './shared/CommandSimple';

const TEST_EVENT = 'testEvent';
const TEST_EVENT2 = 'testEvent2';

describe('LifeCycle (event -> controller -> thread -> command', () => {
  let command, domNode, reactNode, commandThreadFactory,
    commandThreadFactory2, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new TestController('testController', domNode, {
      timeout: 500
    });

    commandThreadFactory = controller.addListener(TEST_EVENT);
    commandThreadFactory2 = controller.addListener(TEST_EVENT2);
  });

  //-----------------------------------
  // RingEvent -> 1 Command throw
  //-----------------------------------
  it('RingEvent -> 1 Command throw', (done) => {
    commandThreadFactory.add(CommandThrow);

    controller.options.consoleLogFails = false;

    let ringEvent = Ring.dispatch(TEST_EVENT, {
      error: 'some error'
    }, domNode).addDoneListener(() => {
      done('Unexpectedly called done when an error was thrown!');
    }).addFailListener((event) => {
      expect(event.error.message).toEqual('some error');
      done();
    });
  }, 50);

  //----------------------------------------------
  // RingEvent -> 1 Command Fail Call (kill false)
  //----------------------------------------------
  it('RingEvent -> 1 Command Fail Call (kill false)', (done) => {
    commandThreadFactory.add(CommandFail);
    commandThreadFactory.add(CommandSimple);

    controller.options.consoleLogFails = false;

    let ringEvent = Ring.dispatch(TEST_EVENT, {
      error: 'some error',
      kill: false,
      testObject: {}
    }, domNode).addDoneListener(() => {
      expect(ringEvent.detail.testObject.count).toEqual(1);
      done();
    }).addFailListener((event) => {
      expect(event.error).toEqual('some error');
    });
  }, 50);

  //----------------------------------------------
  // RingEvent -> 1 Command Fail Call (kill true)
  //----------------------------------------------
  it('RingEvent -> 1 Command Fail Call (kill true)', (done) => {
    commandThreadFactory.add(CommandFail);
    commandThreadFactory.add(CommandSimple);

    controller.options.consoleLogFails = false;

    let ringEvent = Ring.dispatch(TEST_EVENT, {
      error: 'some error',
      kill: true,
      testObject: {}
    }, domNode).addDoneListener(() => {
      done('Unexpectedly called done when a fail was expected!');
    }).addFailListener((event) => {
      expect(event.error).toEqual('some error');
      expect(ringEvent.detail.testObject.count).toEqual(undefined);
      done();
    });
  }, 50);
});
