/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {__hardReset} from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

describe('Timeouts', () => {
  let domNode, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new TestController('testController', domNode, {
      timeout: 500
    });
  });

  afterEach(() => {
    __hardReset();
  });

  //------------------------------------------------
  // Event1 -> Event2 -> TIMEOUT, Event1 does not timeout!
  //------------------------------------------------
  it('Event1 -> Event2 -> Event2 TIMEOUT. Expect that Event1 does not timeout!', (done) => {
    let controller2 = new TestController('testController2', domNode);

    controller2.options.consoleLogFails = false;

    // Force that timeout!
    controller2.options.timeout = 50;

    controller2.addListener('TestEvent2', (done) => {
      // Expecting done should force a timeout.
    });
    controller.addListener('TestEvent', 'TestEvent2');

    let event = Ringa.dispatch('TestEvent', domNode);

    setTimeout(() => {
      expect(event._threadTimedOut).toEqual(false);
      expect(event.lastEvent._threadTimedOut).toEqual(true);

      done();
    }, 100);
  }, 1000);
});
