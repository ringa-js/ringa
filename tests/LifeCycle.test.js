/* eslint-disable no-unused-vars */

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ring from '../src/index';
import CommandSimple from './shared/CommandSimple';

const TEST_EVENT = 'testEvent';

describe('LifeCycle (event -> controller -> thread -> command', () => {
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

  it('should setup a single command to properly respond to a RingEvent', () => {
    let ringEvent = new Ring.Event(TEST_EVENT);
    ringEvent.dispatch(domNode);

    expect(ringEvent.dispatched).toEqual(true);
    expect(ringEvent.controller).toEqual(controller);
  });

  it('should setup a single command to properly respond to a RingEvent', () => {
    let ringEvent = new Ring.Event(TEST_EVENT);
    ringEvent.dispatch(domNode);

    expect(ringEvent.dispatched).toEqual(true);
    expect(ringEvent.controller).toEqual(controller);
  });
});
