/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {__hardReset} from '../src/index';
import TestController from './shared/TestController';

const TEST_EVENT = 'testEvent';

describe('FunctionExecutor', () => {
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

  it('basic case should work', (done) => {
    controller.addListener(TEST_EVENT, [() => {
      done();
    }]);

    controller.dispatch(TEST_EVENT);
  });

  it('injection should work', (done) => {
    let _controller = controller;

    controller.addListener(TEST_EVENT, [(val1, $ringaEvent, val2, $controller, val3) => {
      expect($ringaEvent.type).toEqual(TEST_EVENT);
      expect(_controller).toEqual($controller);

      expect(val1).toEqual(1);
      expect(val2).toEqual(2);
      expect(val3).toEqual('3');

      done();
    }]);

    controller.dispatch(TEST_EVENT, {
      val1: 1,
      val2: 2,
      val3: '3'
    });
  });

  it('asynchronous should work through a passed in done() call', (done) => {
    controller.addListener(TEST_EVENT, (done) => {
      setTimeout(() => {
        done(); // TEST_EVENT done()
      }, 50);
    });

    controller.dispatch(TEST_EVENT).then(() => {
      done();
    });
  });

  let promiseTest = (shouldFail) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) reject('someError');
        else resolve({someValue: 'someValue'});
      }, 10);
    });
  };

  it('should work properly when a promise is returned', (done) => {

    controller.addListener('promiseTest', [
      promiseTest,
      $lastPromiseResult => {
        expect($lastPromiseResult.someValue).toEqual('someValue');
        done();
      }
    ]);

    Ringa.dispatch('promiseTest', {
      shouldFail: false
    }, domNode);
  });

  it('should work properly when a promise is returned and fails', (done) => {

    controller.options.consoleLogFails = false;

    controller.addListener('promiseTest', promiseTest);

    Ringa.dispatch('promiseTest', {
      shouldFail: true
    }, domNode).catch($lastPromiseError => {
      expect($lastPromiseError.error).toEqual('someError');
      done();
    });
  });
});
