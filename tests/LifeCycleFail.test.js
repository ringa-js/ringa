/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ring from '../src/index';
import TestController from './shared/TestController';
import CommandThrow from './shared/CommandThrow';

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
});
