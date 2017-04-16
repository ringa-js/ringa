/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import Ringa, {__hardReset} from '../src/index';
import Model from '../src/Model';

describe('Model', () => {
  let model, childModel, watcher;

  beforeEach(() => {
    model = new Model();
    childModel = new Model();

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

  describe('addProperty', () => {
    //---------------------------------------------
    // should add property
    //---------------------------------------------
    it('should add property', () => {
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

    //-------------------------------
    // should accept a custom setter
    //-------------------------------
    it('should accept a custom setter', (done) => {
      model.addProperty('myProp', 'default', {
        set: function(value) {
          this[`_myProp`] = value + 'Custom';
        }
      });

      model.myProp = 'newValue';

      expect(model.myProp).toEqual('newValueCustom');
      done();
    });

    //-------------------------------
    // should accept a custom getter
    //-------------------------------
    it('should accept a custom getter', (done) => {
      model.addProperty('myProp', 'default', {
        get: function() {
          return this[`_myProp`] + 'Custom';
        }
      });

      expect(model.myProp).toEqual('defaultCustom');
      done();
    });

    //------------------------------------------------
    // should allow properties set through constructor
    //------------------------------------------------
    it('should accept a custom getter', (done) => {
      model = new Model('someName', {
        myProp: 123456
      });

      model.addProperty('myProp', 'default');

      expect(model.myProp).toEqual(123456);
      done();
    });

    //------------------------------------------------
    // should allow properties set through constructor
    //------------------------------------------------
    it('should accept a custom getter', (done) => {
      model = new Model({
        myProp: 123456
      });

      model.addProperty('myProp', 'default');

      expect(model.myProp).toEqual(123456);
      done();
    });

    //------------------------------------------------
    // should automatically set parentModel
    //------------------------------------------------
    it('should automatically set parentModel', (done) => {
      model = new Model();

      let childModel = new Model();

      model.addProperty('childModel', childModel);

      expect(childModel.parentModel).toEqual(model);

      done();
    });

    //------------------------------------------------
    // should automatically clear parentModel
    //------------------------------------------------
    it('should automatically set parentModel', (done) => {
      model = new Model();

      let childModel = new Model();

      model.addProperty('childModel', childModel);

      expect(childModel.parentModel).toEqual(model);

      let newChildModel = model.childModel = new Model();

      expect(childModel.parentModel).toEqual(undefined);
      expect(newChildModel.parentModel).toEqual(model);

      done();
    });
  });
});
