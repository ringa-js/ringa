/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa from '../src/index';
import TestController from './shared/TestController';

const TEST_EVENT = 'testEvent';

describe('CommandFunctionWrapper', () => {
  let command, domNode, reactNode, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new TestController('testController', domNode, {
      timeout: 500
    });
  });

  it('basic case should work', (done) => {
    controller.addListener(TEST_EVENT, [() => {
      done();
    }]);

    controller.dispatch(TEST_EVENT);
  });

  it('injection should work', (done) => {
    let _ringaEvent;
    let _controller = controller;

    controller.addListener(TEST_EVENT, [(val1, $ringaEvent, val2, $controller, val3) => {
      expect(_ringaEvent).toEqual($ringaEvent);
      expect(_controller).toEqual($controller);

      expect(val1).toEqual(1);
      expect(val2).toEqual(2);
      expect(val3).toEqual('3');

      done();
    }]);

    _ringaEvent = controller.dispatch(TEST_EVENT, {
      val1: 1,
      val2: 2,
      val3: '3'
    });
  });

  it('asynchronous should work', (done) => {
    let _done = done;

    controller.addListener(TEST_EVENT, [(done) => {
      setTimeout(() => {
        _done();
      }, 50);
    }]);

    controller.dispatch(TEST_EVENT);
  });
});
