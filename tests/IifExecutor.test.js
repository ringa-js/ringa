/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {iif, __hardReset} from '../src/index';
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

});
