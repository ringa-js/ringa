/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {spawn, __hardReset} from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';
import {sleep} from '../src/util/function';

describe('spawnExecutor', () => {
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

  //-----------------------------------------
  // Does not wait for executor to call done
  //-----------------------------------------
  it('Does not wait for executor to call done', (done) => {
    let callback = jest.fn();
    let superLong = () => {
      sleep(500).then(callback);
    }

    controller.addListener('myEvent', [
      spawn(superLong)
      ]);

    let event = Ringa.dispatch('myEvent', domNode);
    event.addDoneListener(() => {
      expect(callback).not.toBeCalled();
      done();
    });
  }, 50);
});
