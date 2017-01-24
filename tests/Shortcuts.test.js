/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

const TEST_EVENT = 'testEvent';

describe('Shortcuts / Wrappers', () => {
  let command, domNode, reactNode, commandThreadFactory, commandThread, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new TestController('testController', domNode, {
      timeout: 50
    });

    commandThreadFactory = new Ringa.CommandThreadFactory('testCommandThreadFactory', [
      CommandSimple
    ]);

    controller.addListener(TEST_EVENT, commandThreadFactory);

    // Build a thread but do not run it right away because we are testing!
    commandThread = commandThreadFactory.build(new Ringa.Event(TEST_EVENT), false);
  });

  it('Ringa.dispatch() should dispatch and manage an event', (done) => {
    let ringaEvent = Ringa.dispatch(TEST_EVENT, {
      testObject: {
        value: 'test'
      }
    }, domNode);

    ringaEvent.addDoneListener(done);
  });
});
