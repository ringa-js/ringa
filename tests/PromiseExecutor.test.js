/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {__hardReset} from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

describe('promiseExecutor', () => {
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

  //-----------------------------------------------
  // should execute a function following a promise
  //-----------------------------------------------
  it('should execute a function following a promise', (done) => {

    controller.addListener('myEvent', [
        new Promise((resolve, reject) => {
          resolve({result: []});
        }),
        () => done()
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
  }, 50);

  //-------------------------------------------------------------
  // should finish the promise before executing the next command
  //-------------------------------------------------------------
  it('should finish the promise before executing the next command', (done) => {
    let a = '';

    controller.addListener('myEvent', [
        new Promise((resolve, reject) => {
          setTimeout(() => {
            a += 'promiseFirst';
            resolve();
          }, 50);
        }),
        () => { a += '--functionSecond' }
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(a).toBe('promiseFirst--functionSecond');
      done();
    });
  }, 100);
});
