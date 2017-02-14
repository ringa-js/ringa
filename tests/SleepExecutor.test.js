/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {__hardReset} from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

describe('sleepExecutor', () => {
  let command, domNode, reactNode, controller;

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

  //------------------------------------------
  // Waits before executing the next executor
  //------------------------------------------
  it('Waits before executing the next executor', (done) => {
    let tracker = 0;
    let pacer;

    controller.addListener('myEvent', [
      () => { pacer = setInterval(() => tracker += 1, 10) },
      50,
      () => clearInterval(pacer)
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(tracker).toBeGreaterThanOrEqual(4);
      done();
    });
  }, 75);
});
