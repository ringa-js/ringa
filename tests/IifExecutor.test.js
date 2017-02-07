/* eslint-disable no-unused-vars */

window.__DEV__ = true;
window.__TEST__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {iif, event, __hardReset} from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

describe('iifExecutor', () => {
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

  //-----------------------------------
  // Executes truthy executor signature
  //-----------------------------------
  it('Executes truthy executor signature', (done) => {
    controller.addListener('myEvent', [
      iif(() => true, () => done())
      ]);

    Ringa.dispatch('myEvent', domNode);
  }, 50);

  //-----------------------------------
  // Executes falsy executor signature
  //-----------------------------------
  it('Executes falsy executor signature', (done) => {
    controller.addListener('myEvent', [
      iif(() => false, undefined, () => done())
      ]);

    Ringa.dispatch('myEvent', domNode);
  }, 50);

  //-------------------------------------------------
  // Executes nested iif truthy -> thruthy
  //-------------------------------------------------
  it('Executes nested iif truthy -> thruthy', (done) => {
    controller.addListener('myEvent', [
      iif(() => true,
        iif(() => true,
          () => done(),
          undefined),
        undefined)
      ]);

    Ringa.dispatch('myEvent', domNode);
  }, 50);

  //-----------------------------------------------
  // Executes nested iif truthy -> falsy
  //-----------------------------------------------
  it('Executes nested iif truthy -> falsy', (done) => {
    controller.addListener('myEvent', [
      iif(() => true,
        iif(() => false,
          undefined,
          () => done()),
        undefined)
      ]);

    Ringa.dispatch('myEvent', domNode);
  }, 50);

  //-------------------------------------------------
  // Executes nested iif falsy -> thruthy
  //-------------------------------------------------
  it('Executes nested iif falsy -> thruthy', (done) => {
    controller.addListener('myEvent', [
      iif(() => false,
        undefined,
        iif(() => true,
          () => done(),
          undefined))
      ]);

    Ringa.dispatch('myEvent', domNode);
  }, 50);

  //-----------------------------------------------
  // Executes nested iif falsy -> falsy
  //-----------------------------------------------
  it('Executes nested iif falsy -> falsy', (done) => {
    controller.addListener('myEvent', [
      iif(() => false,
        undefined,
        iif(() => false,
          undefined,
          () => done()))
      ]);

    Ringa.dispatch('myEvent', domNode);
  }, 50);

  //-------------------------------------------
  // Executes an event dispatch from true path
  //-------------------------------------------
  it('Executes an event dispatch from true path', (done) => {
    controller.addListener('myFirstEvent', [
      iif(() => true,
        event('mySecondEvent', {}, domNode))
      ]);

    controller.addListener('mySecondEvent', [
      () => done()
      ])

    Ringa.dispatch('myFirstEvent', domNode);
  }, 50);

  //--------------------------------------------
  // Executes an event dispatch from false path
  //--------------------------------------------
  it('Executes an event dispatch from false path', (done) => {
    controller.addListener('myFirstEvent', [
      iif(() => false,
        undefined,
        event('mySecondEvent', {}, domNode))
      ]);

    controller.addListener('mySecondEvent', [
      () => done()
      ])

    Ringa.dispatch('myFirstEvent', domNode);
  }, 50);

  //----------------------------------------------------
  // Executes an event dispatch by name from false path
  //----------------------------------------------------
  it('Executes an event dispatch from false path', (done) => {
    controller.addListener('myFirstEvent', [
      iif(() => false,
        undefined,
        'mySecondEvent')
      ]);

    controller.addListener('mySecondEvent', [
      () => done()
      ])

    Ringa.dispatch('myFirstEvent', domNode);
  }, 50);

  //---------------------------------------------------
  // Executes an event dispatch by name from true path
  //---------------------------------------------------
  it('Executes an event dispatch by name from true path', (done) => {
    controller.addListener('myFirstEvent', [
      iif(() => true,
        'mySecondEvent')
      ]);

    controller.addListener('mySecondEvent', [
      () => done()
      ])

    Ringa.dispatch('myFirstEvent', domNode);
  }, 50);

  //-----------------------------------------------------
  // Does not execute falsy executor with true condition
  //-----------------------------------------------------
  it('Does not execute falsy executor with true condition', (done) => {
    let a = false;
    controller.addListener('myEvent', [
      iif(() => true,
        () => {},
        () => { a = true })
      ]);

    let event = Ringa.dispatch('myEvent', domNode);

    event.addDoneListener(() => {
      expect(a).toBe(false);
      done();
    })
  }, 50);

  //-------------------------------------------------------
  // Does not execute truthy executor with false condition
  //-------------------------------------------------------
  it('Does not execute truthy executor with false condition', (done) => {
    let a = false;
    controller.addListener('myEvent', [
      iif(() => false,
        () => { a = true },
        () => {})
      ]);

    let event = Ringa.dispatch('myEvent', domNode);

    event.addDoneListener(() => {
      expect(a).toBe(false);
      done();
    })
  }, 50);
});
