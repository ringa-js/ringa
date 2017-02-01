/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {__hardReset} from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

const TEST_EVENT = 'testEvent';
const TEST_EVENT2 = 'testEvent2';

describe('operators', () => {
  let domNode, reactNode, controller;

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
  // Assign function
  //-----------------------------------
  it('Assign function', (done) => {
    let assignee = {
      prop: 'value'
    };

    controller.addListener(TEST_EVENT, [
      Ringa.assign((prop, ringaEvent) => {
        expect(prop).toEqual(assignee.prop);
        expect(ringaEvent.detail.prop).toEqual(assignee.prop);

        done();
      }, assignee)
    ]);

    Ringa.dispatch(TEST_EVENT, undefined, domNode);
  }, 50);


});
