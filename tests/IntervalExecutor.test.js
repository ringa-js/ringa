/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {interval, loop, event, __hardReset} from '../src/index';
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
        }, 5)
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(a).toBe(1);
      done();
    });

  }, 50);

  //-----------------------------
  // Loop syntax works
  //-----------------------------
  it('Loop syntax works', (done) => {
    let a = 0;

    controller.addListener('myEvent', [
      loop(() => { return a < 1; },
        () => {
          a += 1;
        })
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(a).toBe(1);
      done();
    });

  }, 50);

  //--------------------------------------
  // Calls the provided executor 10 times
  //--------------------------------------
  it('Calls the provided executor 10 times', (done) => {
    let a = 0;

    controller.addListener('myEvent', [
      interval(() => { return a < 10; },
        () => {
          a += 1;
        }, 5)
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(a).toBe(10);
      done();
    });

  }, 250);

  //----------------------------
  // Will kill an infinite loop
  //----------------------------
  it('Will kill an infinite loop', (done) => {
    controller.addListener('myEvent', [
      interval(() => true, () => {}, 0, {maxLoops: 100}),
      () => done()
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
  }, 500);

  //----------------------------------------------
  // Condition can access details passed to event
  //----------------------------------------------
  it('Condition can access details passed to event', (done) => {
    let value = 'value';

    controller.addListener('myEvent', [
      interval((testDetail) => {
        expect(testDetail).toBe(value);
        done();
        return false;
      },
        () => {}, 10)
      ]);

    Ringa.dispatch('myEvent', {testDetail: value}, domNode);
  }, 50);

  //---------------------------------
  // Condition can access injections
  //---------------------------------
  it('Condition can access injections', (done) => {
    controller.addListener('myEvent', [
      interval(($controller, $thread, $detail) => {
        expect($controller).toBeDefined();
        expect($thread).toBeDefined();
        expect($detail).toBeDefined();
        done();
        return false;
      },
        () => {}, 10)
      ]);

    Ringa.dispatch('myEvent', domNode);
  }, 50);
});
