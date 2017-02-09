/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {interval, event, __hardReset} from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

describe('intervalExecutor', () => {
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

  //------------------------------------
  // Does nothing if condition is false
  //------------------------------------
  it('Does nothing if condition is false', (done) => {
    let callback = jest.fn();

    controller.addListener('myEvent', [
      interval(() => false, callback, 50)
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(callback).not.toBeCalled();
      done();
    });

  }, 50);

  //-----------------------------
  // Calls the provided executor
  //-----------------------------
  it('Calls the provided executor', (done) => {
    let a = 0;

    controller.addListener('myEvent', [
      interval(() => { return a < 1; },
        () => {
          a += 1;
        }, 50)
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(a).toBe(1);
      done();
    });

  }, 500);

  //--------------------------------------
  // Calls the provided executor 50 times
  //--------------------------------------
  it('Calls the provided executor', (done) => {
    let a = 0;

    controller.addListener('myEvent', [
      interval(() => { return a < 50; },
        () => {
          a += 1;
        }, 5)
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(a).toBe(50);
      done();
    });

  }, 650);
});
