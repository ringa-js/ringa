/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {__hardReset, RingaEvent} from '../src/index';
import TestController from './shared/TestController';
import CommandThrow from './shared/CommandThrow';
import CommandFail from './shared/CommandFail';
import CommandSimple from './shared/CommandSimple';

const TEST_EVENT = 'testEvent';
const TEST_EVENT2 = 'testEvent2';

describe('LifeCycleFail', () => {
  let command, domNode, reactNode, threadFactory,
    threadFactory2, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new TestController('testController', domNode, {
      timeout: 500
    });

    threadFactory = controller.addListener(TEST_EVENT);
    threadFactory2 = controller.addListener(TEST_EVENT2);
  });

  afterEach(() => {
    __hardReset();
  });

  //-----------------------------------
  // RingaEvent -> 1 Command throw
  //-----------------------------------
  it('RingaEvent -> 1 Command throw (do not kill)', (done) => {
    threadFactory.add(CommandThrow);

    controller.options.consoleLogFails = false;

    let ringaEvent = new RingaEvent(TEST_EVENT, {
      error: 'some error'
    });

    ringaEvent
      .catch((event) => {
        expect(event.error.message).toEqual('some error');
        done();
      });

    ringaEvent.dispatch(domNode);
  }, 200);

  //----------------------------------------------
  // RingaEvent -> 1 Command Fail Call (kill false)
  //----------------------------------------------
  it('RingaEvent -> 1 Command Fail Call (kill false)', (done) => {
    let didFail = false;

    threadFactory.add(CommandFail);
    threadFactory.add(CommandSimple);

    controller.options.consoleLogFails = false;

    let ringaEvent = Ringa.dispatch(TEST_EVENT, {
      error: 'some error',
      kill: false,
      testObject: {}
    }, domNode).addDoneListener(() => {
      expect(didFail).toEqual(true);
      expect(ringaEvent.detail.testObject.count).toEqual(1);
      done();
    }).addFailListener((event) => {
      didFail = true;
      expect(event.error).toEqual('some error');
    });
  }, 200);

  //----------------------------------------------
  // RingaEvent -> 1 Command Fail Call (kill true)
  //----------------------------------------------
  it('RingaEvent -> 1 Command Fail Call (kill true)', (done) => {
    threadFactory.add(CommandFail);
    threadFactory.add(CommandSimple);

    controller.options.consoleLogFails = false;

    Ringa.dispatch(TEST_EVENT, {
      error: 'some error',
      kill: true,
      testObject: {}
    }, domNode).addDoneListener(() => {
      done('Unexpectedly called done when a fail was expected!');
    }).addFailListener((event) => {
      expect(event.error).toEqual('some error');
      done();
    });
  }, 200);
});
