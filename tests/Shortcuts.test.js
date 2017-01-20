/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ring from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

const TEST_EVENT = 'testEvent';

describe('Shortcuts / Wrappers', () => {
  let command, domNode, reactNode, commandThreadFactory, commandThread, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new TestController('testController', domNode);

    commandThreadFactory = new Ring.CommandThreadFactory('testCommandThreadFactory', [
      CommandSimple
    ]);

    controller.addListener(TEST_EVENT, commandThreadFactory);

    // Build a thread but do not run it right away because we are testing!
    commandThread = commandThreadFactory.build(new Ring.Event(TEST_EVENT), false);
  });

  it('Ring.dispatch() should dispatch and manage an event', () => {
    let ringEvent = Ring.dispatch(TEST_EVENT, {
      testObject: {value: 'test'}
    }, domNode);

    expect(ringEvent.dispatched).toEqual(true);
    expect(ringEvent.controller).toEqual(controller);
    expect(ringEvent.commandThread.id).toEqual('testController_CommandThread');
  });
});
