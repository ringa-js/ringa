/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {__hardReset} from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

describe('parallelExecutor', () => {
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
  // Executes an executor inside parallel notation
  //-----------------------------------------------
  it('Executes an executor inside parallel notation', (done) => {
    let callback = jest.fn();

    controller.addListener('myEvent', [
      [callback]
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(callback).toBeCalled();
      done();
    });
  }, 50);

  //-------------------------------------------------
  // Executes two executors inside parallel notation
  //-------------------------------------------------
  it('Executes two executors inside parallel notation', (done) => {
    let callbackOne = jest.fn();
    let callbackTwo = jest.fn();

    controller.addListener('myEvent', [
      [callbackOne, callbackTwo]
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(callbackOne).toBeCalled();
      expect(callbackTwo).toBeCalled();
      done();
    });
  }, 50);

  //-----------------------------------------------------------
  // should execute parallel executors between others in order
  //-----------------------------------------------------------
  it('should execute parallel executors between others in order', (done) => {
    let callOrder = '';

    controller.addListener('myEvent', [
      () => {callOrder += '1'},
      [() => {callOrder += '2'},
       () => {callOrder += '2'}],
      () => {callOrder += '3'}
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(callOrder).toBe('1223');
      done();
    });
  }, 50);
});
