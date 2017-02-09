/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import Ringa, {__hardReset} from '../src/index';
import Model from '../src/Model';

describe('Model', () => {
  let model, watcher;

  beforeEach(() => {
    model = new Model();

    watcher = new Ringa.ModelWatcher('modelWatcher');

    watcher.addModel(model);
  });

  afterEach(() => {
    __hardReset();
  });

  //------------------------------------------------
  // should create without error and have proper id
  //------------------------------------------------
  it('should create without error and have proper id', () => {
    expect(model.id).toEqual('Model1');
  });

  //---------------------------------------------
  // should have property added with addProperty
  //---------------------------------------------
  it('should have property added with addProperty', () => {
    model.addProperty('myProp', true);

    expect(model.myProp).toEqual(true);
  });

  //----------------------------------------
  // should notify when property is changed
  //----------------------------------------
  it('should notify when property is changed', (done) => {
    model.addProperty('myProp', 'default');

    let handler = (arg) => {
      expect(arg[0].model).toEqual(model);
      expect(arg[0].value).toEqual('myPropVal');
      done();
    };

    watcher.watch('Model1', 'myProp', handler);

    model.myProp = 'myPropVal';
  });

  //---------------------------------------------------------
  // should not notify if property is assigned current value
  //---------------------------------------------------------
  it('should not notify if property is assigned current value', (done) => {
    model.addProperty('myProp', 'default');

    let handler = jest.fn();

    watcher.watch('Model1', 'myProp', handler);

    model.myProp = 'default';

    expect(handler).not.toBeCalled();
    done();
  });
});
