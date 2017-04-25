/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import Ringa, {__hardReset} from '../src/index';
import Model from '../src/Model';

describe('Model', () => {
  let model, childModel, childModel2, watcher;

  beforeEach(() => {
    model = new Model();
    childModel = new Model();
    childModel2 = new Model('grandchildmodel');

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

    //---------------------------------------------
    // should add property and set options
    //---------------------------------------------
    it('should add property and set options', () => {
      model.addProperty('myProp', true, {
        someOptions: 'yay some options'
      });

      expect(model.propertyOptions.myProp).toEqual({
        someOptions: 'yay some options'
      });
    });

    //----------------------------------------
    // should notify when property is changed
    //----------------------------------------
    it('should notify when property is changed', (done) => {
      model.addProperty('myProp', 'default');

      let handler = (arg) => {
        expect(arg[0].watchedModel).toEqual(model);
        expect(arg[0].watchedValue).toEqual('myPropVal');
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
    // should automatically set/reset parentModel (1/x)
    //------------------------------------------------
    it('should automatically set/reset parentModel (1/x)', (done) => {
      model = new Model();

      let childModel = new Model();

      model.addProperty('childModel', childModel);

      expect(childModel.parentModel).toEqual(model);

      done();
    });

    //------------------------------------------------
    // should automatically set/reset parentModel (2/x)
    //------------------------------------------------
    it('should automatically set/reset parentModel (2/x)', (done) => {
      model = new Model();

      let childModel = new Model();

      model.addProperty('childModel', childModel);

      expect(childModel.parentModel).toEqual(model);

      let newChildModel = model.childModel = new Model();

      expect(childModel.parentModel).toEqual(undefined);
      expect(newChildModel.parentModel).toEqual(model);

      done();
    });

    //------------------------------------------------
    // should serialize properly (1/x)
    //------------------------------------------------
    it('should serialize properly (1/x)', () => {
      model = new Model();
      model.addProperty('someProperty', 'defaultValue');

      expect(model.serialize()).toEqual({
        someProperty: 'defaultValue'
      });
    });

    //------------------------------------------------
    // should serialize properly (2/x)
    //------------------------------------------------
    it('should serialize properly (2/x)', () => {
      model = new Model();
      model.addProperty('someProperty', 'defaultValue');
      model.addProperty('someOtherProperty', {value: 1});

      expect(model.serialize()).toEqual({
        someProperty: 'defaultValue',
        someOtherProperty: {
          value: 1
        }
      });
    });

    //------------------------------------------------
    // should serialize properly (3/x)
    //------------------------------------------------
    it('should serialize properly (3/x)', () => {
      model = new Model();

      expect(model.serialize()).toEqual({});
    });

    //------------------------------------------------
    // should serialize properly (4/x)
    //------------------------------------------------
    it('should serialize properly (4/x)', () => {
      model = new Model();

      let childModel = new Model();
      childModel.addProperty('someProp', 8);

      model.addProperty('someModel', childModel);

      expect(model.serialize()).toEqual({
        someModel: {
          someProp: 8
        }
      });
    });

    //------------------------------------------------
    // should serialize properly (5/x)
    //------------------------------------------------
    it('should serialize properly (5/x)', () => {
      model = new Model();

      let childModel = new Model();
      childModel.addProperty('someProp', 8);

      model.addProperty('someModel', [childModel]);

      expect(model.serialize()).toEqual({
        someModel: [{
          someProp: 8
        }]
      });
    });

    //------------------------------------------------
    // should serialize properly (6/x)
    //------------------------------------------------
    it('should serialize properly (6/x)', () => {
      model = new Model();

      let childModel = new Model();
      childModel.addProperty('someProp', 8);

      model.addProperty('someModel', [childModel, childModel, childModel]);

      expect(model.serialize()).toEqual({
        someModel: [{
          someProp: 8
        },{
          someProp: 8
        },{
          someProp: 8
        }]
      });
    });

    //------------------------------------------------
    // should have a working clone method (1/x)
    //------------------------------------------------
    it('should have a working clone method (1/x)', () => {
      model = new Model();
      let clone = model.clone();

      expect(clone).toBeDefined();
      expect(clone).not.toBe(model);
    });

    //------------------------------------------------
    // should have a working clone method (2/x)
    //------------------------------------------------
    it('should have a working clone method (2/x)', () => {
      model = new Model();
      model.addProperty('prop', 'value');

      let clone = model.clone();

      expect(clone.prop).toBe('value');
    });

    //------------------------------------------------
    // should have a working clone method (3/x)
    //------------------------------------------------
    it('should have a working clone method (3/x)', () => {
      model = new Model();
      model.addProperty('prop', {
        value: 'value'
      });

      let clone = model.clone();

      expect(clone.prop).toEqual({
        value: 'value'
      });
    });

    //------------------------------------------------
    // should have a working clone method (4/x)
    //------------------------------------------------
    it('should have a working clone method (4/x)', () => {
      model = new Model();
      model.addProperty('prop', {
        clone: () => 101
      });

      let clone = model.clone();

      expect(clone.prop).toEqual(101);
    });

    //------------------------------------------------
    // should have a working clone method (5/x)
    //------------------------------------------------
    it('should have a working clone method (5/x)', () => {
      model = new Model();
      childModel = new Model();
      childModel.addProperty('prop', 'value');
      model.addProperty('child', childModel);

      let clone = model.clone();

      expect(clone.child).not.toBe(childModel);
      expect(clone.child.prop).toEqual('value');
    });

    //------------------------------------------------
    // should have a working clone method (6/x)
    //------------------------------------------------
    it('should have a working clone method (6/x)', () => {
      model = new Model();
      childModel = new Model();
      childModel.addProperty('prop', 'value');
      childModel.clone = () => 101;

      model.addProperty('child', childModel);

      let clone = model.clone();

      expect(clone.child).not.toBe(childModel);
      expect(clone.child).toEqual(101);
    });

    //------------------------------------------------
    // should have a working clone method (7/x)
    //------------------------------------------------
    it('should have a working clone method (7/x)', () => {
      model = new Model();
      childModel = new Model();
      childModel.addProperty('prop', 'value', {
        clone: () => 200
      });

      model.addProperty('child', childModel);

      let clone = model.clone();

      expect(clone.child).not.toBe(childModel);
      expect(clone.child.prop).toEqual(200);
    });

    //------------------------------------------------
    // should have a working clone method (8/x)
    //------------------------------------------------
    it('should have a working clone method (8/x)', () => {
      model = new Model();
      childModel = new Model();
      childModel.addProperty('prop', 100);

      model.addProperty('children', [childModel, childModel, childModel, 'hello world']);

      let clone = model.clone();

      for (let i = 0; i < clone.children.length - 1; i++) {
        expect(clone.children[i]).not.toBe(childModel);
        expect(clone.children[i].prop).toEqual(100);
      }

      expect(clone.children[3]).toBe('hello world');
    });

    //------------------------------------------------
    // should have a working clone method (9/x)
    //------------------------------------------------
    it('should have a working clone method (9/x)', () => {
      model = new Model();
      childModel = new Model();
      childModel.addProperty('prop', 300);

      model.addProperty('children', {
        childModel
      });

      let clone = model.clone();

      expect(clone.children.childModel).not.toBe(childModel);
      expect(clone.children.childModel.prop).toBe(300);
    });

    //------------------------------------------------
    // should have a working clone method that properly sets parentModel (10/x)
    //------------------------------------------------
    it('should have a working clone method that properly sets parentModel (10/x)', () => {
      model = new Model('model');

      let child1 = new Model('child1');
      let child2 = new Model('child2');

      let grandchild1 = new Model('grandchild1');
      let grandchild2 = new Model('grandchild2');

      model.addProperty('children', [child1, child2]);

      child1.addProperty('grandchild', grandchild1);
      child2.addProperty('grandchild', grandchild2);

      let clone = model.clone();

      expect(clone.children[0].parentModel).toBe(clone);
      expect(clone.children[1].parentModel).toBe(clone);

      expect(clone.children[0].parentModel).not.toBe(model);
      expect(clone.children[1].parentModel).not.toBe(model);

      expect(clone.children[0].grandchild.parentModel.name).not.toBe(child1);
      expect(clone.children[1].grandchild.parentModel.name).not.toBe(child2);

      expect(clone.children[0].grandchild.parentModel.name).toBe(child1.name);
      expect(clone.children[1].grandchild.parentModel.name).toBe(child2.name);
    });

    //------------------------------------------------
    // should have a working index() and addIndexedProperty() method (1/x)
    //------------------------------------------------
    it('should have a working index() and addIndexedProperty() method (1/x)', () => {
      childModel.addIndexedProperty('prop', 'The quick brown fox jumps over the lazy dog');

      let trieSearch = childModel.index();

      expect(trieSearch.get('The')[0]).toBe(childModel);
      expect(trieSearch.get('qu')[0]).toBe(childModel);
      expect(trieSearch.get('quick')[0]).toBe(childModel);
      expect(trieSearch.get('brown')[0]).toBe(childModel);
      expect(trieSearch.get('lazy')[0]).toBe(childModel);
      expect(trieSearch.get('abracadabra').length).toBe(0);
    });

    //------------------------------------------------
    // should have a working index() and addIndexedProperty() method (2/x)
    //------------------------------------------------
    it('should have a working index() and addIndexedProperty() method (2/x)', () => {
      childModel.addProperty('nonIndexProperty', 'Hello World!');
      childModel.addIndexedProperty('prop', 'The quick brown fox jumps over the lazy dog');

      let trieSearch = childModel.index();

      expect(trieSearch.get('The')[0]).toBe(childModel);
      expect(trieSearch.get('qu')[0]).toBe(childModel);
      expect(trieSearch.get('quick')[0]).toBe(childModel);
      expect(trieSearch.get('brown')[0]).toBe(childModel);
      expect(trieSearch.get('lazy')[0]).toBe(childModel);
      expect(trieSearch.get('abracadabra').length).toBe(0);
      expect(trieSearch.get('Hell').length).toBe(0);
      expect(trieSearch.get('Wor').length).toBe(0);
    });

    //------------------------------------------------
    // should have a working index() and addIndexedProperty() method (3/x)
    //------------------------------------------------
    it('should have a working index() and addIndexedProperty() method (3/x)', () => {
      childModel.addProperty('nonIndexProperty', 'Hello World!');
      childModel.addProperty('prop', 'The quick brown fox jumps over the lazy dog', {
        index: true
      });

      let trieSearch = childModel.index();

      expect(trieSearch.get('The')[0]).toBe(childModel);
      expect(trieSearch.get('qu')[0]).toBe(childModel);
      expect(trieSearch.get('quick')[0]).toBe(childModel);
      expect(trieSearch.get('brown')[0]).toBe(childModel);
      expect(trieSearch.get('lazy')[0]).toBe(childModel);
      expect(trieSearch.get('abracadabra').length).toBe(0);
      expect(trieSearch.get('Hell').length).toBe(0);
      expect(trieSearch.get('Wor').length).toBe(0);
    });

    //------------------------------------------------
    // should have a working index() and addIndexedProperty() method (4/x)
    //------------------------------------------------
    it('should have a working index() and addIndexedProperty() method (4/x)', () => {
      childModel.addIndexedProperty('nonIndexProperty', 1234567);

      let trieSearch = childModel.index();

      expect(trieSearch.get('1')[0]).toBe(childModel);
      expect(trieSearch.get('12')[0]).toBe(childModel);
      expect(trieSearch.get('123')[0]).toBe(childModel);
      expect(trieSearch.get('1234')[0]).toBe(childModel);
      expect(trieSearch.get('12345')[0]).toBe(childModel);
      expect(trieSearch.get('123456')[0]).toBe(childModel);
      expect(trieSearch.get('1234567')[0]).toBe(childModel);
      expect(trieSearch.get('12345678').length).toBe(0);
    });

    //------------------------------------------------
    // should have a working index() and addIndexedProperty() method (5/x)
    //------------------------------------------------
    it('should have a working index() and addIndexedProperty() method (5/x)', () => {
      childModel.addIndexedProperty('nonIndexProperty', 1234567);

      let trieSearch = childModel.index(false, {
        min: 3
      });

      expect(trieSearch.get('1').length).toBe(0);
      expect(trieSearch.get('12').length).toBe(0);
      expect(trieSearch.get('123')[0]).toBe(childModel);
      expect(trieSearch.get('1234')[0]).toBe(childModel);
      expect(trieSearch.get('12345')[0]).toBe(childModel);
      expect(trieSearch.get('123456')[0]).toBe(childModel);
      expect(trieSearch.get('1234567')[0]).toBe(childModel);
      expect(trieSearch.get('12345678').length).toBe(0);
    });

    //------------------------------------------------
    // should have a working index() and addIndexedProperty() method (6/x)
    //------------------------------------------------
    it('should have a working index() and addIndexedProperty() method (6/x)', () => {
      model.addIndexedProperty('child', childModel);

      childModel.addIndexedProperty('property', 1234567);

      let trieSearch = childModel.index(true);

      expect(trieSearch.get('1')[0]).toBe(childModel);
      expect(trieSearch.get('12')[0]).toBe(childModel);
      expect(trieSearch.get('123')[0]).toBe(childModel);
      expect(trieSearch.get('1234')[0]).toBe(childModel);
      expect(trieSearch.get('12345')[0]).toBe(childModel);
      expect(trieSearch.get('123456')[0]).toBe(childModel);
      expect(trieSearch.get('1234567')[0]).toBe(childModel);
      expect(trieSearch.get('12345678').length).toBe(0);
    });

    //------------------------------------------------
    // should have a working index() and addIndexedProperty() method (7/x)
    //------------------------------------------------
    it('should have a working index() and addIndexedProperty() method (7/x)', () => {
      model.addIndexedProperty('property', 1234567);
      model.addIndexedProperty('child', childModel);

      childModel.addIndexedProperty('property', 1234567);

      let trieSearch = model.index(true);

      expect(trieSearch.get('1')[0]).toBe(childModel);
      expect(trieSearch.get('1')[1]).toBe(model);
      expect(trieSearch.get('12')[0]).toBe(childModel);
      expect(trieSearch.get('12')[1]).toBe(model);
      expect(trieSearch.get('123')[0]).toBe(childModel);
      expect(trieSearch.get('123')[1]).toBe(model);
      expect(trieSearch.get('1234')[0]).toBe(childModel);
      expect(trieSearch.get('1234')[1]).toBe(model);
      expect(trieSearch.get('12345')[0]).toBe(childModel);
      expect(trieSearch.get('12345')[1]).toBe(model);
      expect(trieSearch.get('123456')[0]).toBe(childModel);
      expect(trieSearch.get('123456')[1]).toBe(model);
      expect(trieSearch.get('1234567')[0]).toBe(childModel);
      expect(trieSearch.get('1234567')[1]).toBe(model);
      expect(trieSearch.get('12345678').length).toBe(0);
    });

    //----------------------------------------
    // should properly watch and notify (1/x)
    //----------------------------------------
    it('should properly watch and notify (1/x)', (done) => {
      model.addProperty('value', 123);

      model.watch((signal, item, value, descriptor) => {
        expect(signal).toBe('value');
        expect(item).toBe(model);
        expect(value).toBe(456);
        expect(descriptor).toBe(undefined);
        done();
      });

      model.value = 456;
    }, 25);

    //----------------------------------------
    // should properly watch and notify (2/x)
    //----------------------------------------
    it('should properly watch and notify (2/x)', (done) => {
      model.addProperty('child', childModel);

      childModel.addProperty('value', 123);

      model.watch((signal, item, value, descriptor) => {
        expect(signal).toBe('child.value');
        expect(item).toBe(childModel);
        expect(value).toBe(456);
        expect(descriptor).toBe(undefined);
        done();
      });

      childModel.value = 456;
    });

    //----------------------------------------
    // should properly watch and notify (3/x)
    //----------------------------------------
    it('should properly watch and notify (3/x)', (done) => {
      model.addProperty('child', childModel);

      childModel.addProperty('value', 123, {
        descriptor: 'Value has changed!'
      });

      model.watch((signal, item, value, descriptor) => {
        expect(descriptor).toBe('Value has changed!');
        done();
      });

      childModel.value = 456;
    });

    //----------------------------------------
    // should properly call addModelChild
    //----------------------------------------
    it('should properly call addModelChild', (done) => {
      model.addModelChild = (propertyName, child) => {
        expect(propertyName).toBe('value');
        expect(child).toBe(childModel);
        done();
      };

      model.addProperty('value', childModel);
    });

    //----------------------------------------
    // should properly call addModelChild and setup watcher
    //----------------------------------------
    it('should properly call addModelChild and setup watcher', () => {
      model.addProperty('value', childModel);

      expect(model.childIdToRef[childModel.id]).not.toBe(undefined);
    });

    //----------------------------------------
    // parent model should be notified on child model change
    //----------------------------------------
    it('parent model should be notified on child model change', (done) => {
      childModel.addProperty('subvalue', '', {
        descriptor: 'Well the subvalue has been changed, by joe.'
      });

      model.addProperty('child', childModel);

      expect(model.childIdToRef[childModel.id]).not.toBe(undefined);

      model.notify = (signal, item, value, descriptor) => {
        expect(signal).toBe('child.subvalue');
        expect(item).toBe(childModel);
        expect(value).toBe(123);
        expect(descriptor).toBe('Well the subvalue has been changed, by joe.');
        done();
      };

      childModel.subvalue = 123;
    });

    //----------------------------------------
    // parent model should be notified on child model change
    //----------------------------------------
    it('parent model should be notified on child model change', (done) => {
      childModel.addProperty('grandchild');

      model.addProperty('child', childModel);

      childModel2.addProperty('subsubvalue', '', {
        descriptor: 'Well the subvalue has been changed, by joe.'
      });

      childModel.grandchild = childModel2;

      model.notify = (signal, item, value, descriptor) => {
        expect(signal).toBe('child.grandchild.subsubvalue');
        expect(item).toBe(childModel2);
        expect(value).toBe(456);
        expect(descriptor).toBe('Well the subvalue has been changed, by joe.');
        done();
      };

      childModel2.subsubvalue = 456;
    });

    //----------------------------------------
    // should provide an onChange option (1/x)
    //----------------------------------------
    it('should provide an onChange option (1/x)', (done) => {
      model.addProperty('prop', 'some old value');

      model.propertyOptions.prop.onChange = (oldValue, newValue) => {
        expect(oldValue).toBe('some old value');
        expect(newValue).toBe('some new value');
        done();
      };

      model.prop = 'some new value';
    }, 25);

    //----------------------------------------
    // should provide an onChange option (2/x)
    //----------------------------------------
    it('should provide an onChange option (2/x)', () => {
      let count = 0;

      // The initial set should trigger an onChange (first ++)
      model.addProperty('prop', 'some old value', {
        onChange: (oldValue, newValue) => {
          count++;
        }
      });

      // This is setting to the same value, so it is NOT a change
      model.prop = 'some old value';

      // This is setting to a new value, so ++
      model.prop = 'some new value';

      expect(count).toBe(2);
    });
  });
});
