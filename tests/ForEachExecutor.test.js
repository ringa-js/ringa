/* eslint-disable no-unused-vars */

window.__DEV__ = true;
window.__TEST__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {forEach, forEachParallel, event, __hardReset} from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

describe('ForEachExecutor', () => {
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

  //----------------------------------------------------------------------
  // forEach: Iterates over an array calling the executor for each
  //----------------------------------------------------------------------
  it('forEach: Iterates over an array calling the executor for each', (done) => {
    let result = [];

    controller.addListener('myEvent', forEach('items', 'item', (item) => {
      result.push(item);
    }));

    Ringa.dispatch('myEvent', {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }, domNode).then(() => {
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      done();
    });
  }, 50);

  //---------------------------------------------------------------------------------------
  // forEach: Iterates over an array calling the executor for each (sequential check)
  //---------------------------------------------------------------------------------------
  it('forEach: Iterates over an array calling the executor for each (sequential check)', (done) => {
    let result = [];

    controller.addListener('itemEvent', [
      (item) => {result.push(item);},
      (item) => {result.push(item);}
    ]);

    controller.addListener('myEvent', forEach('items', 'item', 'itemEvent'));

    Ringa.dispatch('myEvent', {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }, domNode).then(() => {
      expect(result).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]);
      done();
    });
  });

  //----------------------------------------------------------------------
  // forEachParallel: Iterates over an array calling the executor for each
  //----------------------------------------------------------------------
  it('forEachParallel: Iterates over an array calling the executor for each', (done) => {
    let result = [];

    controller.addListener('myEvent', forEachParallel('items', 'item', (item) => {
      result.push(item);
    }));

    Ringa.dispatch('myEvent', {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }, domNode).then(() => {
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      done();
    });
  }, 50);

  //---------------------------------------------------------------------------------------
  // forEachParallel: Iterates over an array calling the executor for each (parallel check)
  //---------------------------------------------------------------------------------------
  it('forEachParallel: Iterates over an array calling the executor for each (parallel check)', (done) => {
    let result = [];

    controller.addListener('itemEvent', [
      (item) => {result.push(item);},
      (item) => {result.push(item);}
    ]);

    controller.addListener('myEvent', forEachParallel('items', 'item', 'itemEvent'));

    Ringa.dispatch('myEvent', {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }, domNode).then(() => {
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      done();
    });
  }, 50);
});
