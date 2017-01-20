/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ring from '../src/index';
import CommandSimple from './shared/CommandSimple';

const TEST_EVENT = 'testEvent';

describe('Controller', () => {
  let command, domNode, reactNode, commandThreadFactory, commandThread, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new Ring.Controller('testController', domNode);

    commandThreadFactory = new Ring.CommandThreadFactory('testCommandThreadFactory', [
      CommandSimple
    ]);

    controller.addListener(TEST_EVENT, commandThreadFactory);

    // Build a thread but do not run it right away because we are testing!
    commandThread = commandThreadFactory.build(new Ring.Event(TEST_EVENT), false);
  });

  it('should have a properly defined id', () => {
    expect(controller.id).toEqual('testController');
  });
});
