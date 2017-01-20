/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ring from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

const TEST_EVENT = 'testEvent';

describe('LifeCycle (event -> controller -> thread -> command', () => {
  let command, domNode, reactNode, commandThreadFactory, commandThread, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new TestController('testController', domNode, {
      timeout: 50
    });

    commandThreadFactory = controller.addListener(TEST_EVENT, [
      CommandSimple
    ]);

    // Build a thread but do not run it right away because we are testing!
    commandThread = commandThreadFactory.build(new Ring.Event(TEST_EVENT), false);
  });

  //-----------------------------------
  // RingEvent -> 1 Command
  //-----------------------------------
  it('should setup a single command to properly respond to a RingEvent', (done) => {
    let testObject = {
      value: 'test'
    };

    let ringEvent = Ring.dispatch(TEST_EVENT, { testObject }, domNode).addDoneListener(() => {
      expect(testObject.executed).toEqual(true);
      done();
    });
  });

  //-----------------------------------
  // RingEvent -> 2 Commands
  //-----------------------------------
  it('should properly handle multiple commands responding to a RingEvent', (done) => {
    let testObject = {
      value: 'test'
    };

    commandThreadFactory.add(CommandSimple);

    let ringEvent = Ring.dispatch(TEST_EVENT, { testObject }, domNode);

    ringEvent.addDoneListener(() => {
      expect(testObject.count).toEqual(2);
      done();
    });
  });
});
