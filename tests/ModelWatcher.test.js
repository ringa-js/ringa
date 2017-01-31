/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import Ringa from '../src/index';
import ModelSimple from './shared/ModelSimple';

describe('ModelWatcher', () => {
  let model1, model2, model3, watcher;

  beforeEach(() => {
    model1 = new ModelSimple('model1');
    model2 = new ModelSimple('model2');
    model3 = new ModelSimple('model3');

    watcher = new Ringa.ModelWatcher('modelWatcher');

    watcher.addModel(model1);
    watcher.addModel(model2);
    watcher.addModel(model3);
  });

  afterEach(() => {
    model1.destroy();
    model2.destroy();
    model3.destroy();

    watcher.destroy();
  });

  //-----------------------------------
  // Has a working watch() method (1)
  //-----------------------------------
  it('Has a working watch() method (1)', () => {
    let callback = () => {};
    watcher.watch('model1', callback);

    expect(watcher.idToWatchees[model1.id].all[0]).toEqual(callback);
    expect(watcher.idToWatchees[model1.id].byPath).toEqual({});
  });

  //-----------------------------------
  // Has a working watch() method (2)
  //-----------------------------------
  it('Has a working watch() method (2)', () => {
    let callback = () => {};
    watcher.watch(ModelSimple, callback);

    expect(watcher.classToWatchees[ModelSimple].all[0]).toEqual(callback);
    expect(watcher.classToWatchees[ModelSimple].byPath).toEqual({});
  });

  //-----------------------------------
  // Has a working watch() method (3)
  //-----------------------------------
  it('Has a working watch() method (3)', () => {
    let callback = () => {};
    watcher.watch(ModelSimple, 'path', callback);

    expect(watcher.classToWatchees[ModelSimple].all.length).toEqual(0);
    expect(watcher.classToWatchees[ModelSimple].byPath['path'][0]).toEqual(callback);
  });

  //-----------------------------------
  // Has a working watch() method (4)
  //-----------------------------------
  it('Has a working watch() method (4)', () => {
    let callback = () => {};
    watcher.watch(ModelSimple, 'path.whatever', callback);

    expect(watcher.classToWatchees[ModelSimple].all.length).toEqual(0);
    expect(watcher.classToWatchees[ModelSimple].byPath['path.whatever'][0]).toEqual(callback);
  });

  //-----------------------------------
  // Has a working watch() method (5)
  //-----------------------------------
  it('Has a working watch() method (5)', () => {
    let callback = () => {};
    watcher.watch(ModelSimple, 'path.whatever', callback);
    watcher.watch(ModelSimple, 'path2', callback);
    watcher.watch(ModelSimple, callback);

    expect(watcher.classToWatchees[ModelSimple].all.length).toEqual(1);
    expect(watcher.classToWatchees[ModelSimple].all[0]).toEqual(callback);
    expect(watcher.classToWatchees[ModelSimple].byPath['path.whatever'][0]).toEqual(callback);
    expect(watcher.classToWatchees[ModelSimple].byPath['path2'][0]).toEqual(callback);
  });

  //-----------------------------------
  // Has a working watch() method (6)
  //-----------------------------------
  it('Has a working watch() method (throw)', () => {

    expect(() => {
      watcher.watch({}, 'path.whatever', callback);
    }).toThrow();
  });

  //-----------------------------------
  // Injection by id (1)
  //-----------------------------------
  it('Injection by id (1)', (done) => {
    watcher.watch('model1', () => {
      done();
    });

    model1.prop1 = 'someNewValue';
  }, 5);

  //-----------------------------------
  // Injection by id (2)
  //-----------------------------------
  it('Injection by id (2)', (done) => {
    watcher.watch('model1', (arg) => {
      expect(arg.length).toEqual(1);
      expect(arg[0].model === model1).toEqual(true);
      expect(arg[0].value).toEqual('someNewValue');
      done();
    });

    model1.prop1 = 'someNewValue';
  }, 5);

  //-----------------------------------
  // Injection by id and path (1)
  //-----------------------------------
  it('Injection by id and path (1)', (done) => {
    watcher.watch('model1', 'prop1', (arg) => {
      expect(arg.length).toEqual(1);
      expect(arg[0].model === model1).toEqual(true);
      expect(arg[0].value).toEqual('someNewValue');
      done();
    });

    model1.prop1 = 'someNewValue';
  }, 5);

  //-----------------------------------
  // Injection by id and path (2)
  //-----------------------------------
  it('Injection by id and path (2)', (done) => {
    let called = false;
    watcher.watch('model1', 'someInvalidPath', (arg) => {
      called = true;
    });

    model1.prop1 = 'someNewValue';

    setTimeout(() => {
      expect(called).toEqual(false);
      done();
    }, 1);
  }, 50);

  //-----------------------------------
  // Injection by id and deep path (1)
  //-----------------------------------
  it('Injection by id and deep path (1)', (done) => {
    watcher.watch('model1', 'prop1', (arg) => {
      expect(arg[0].value).toEqual(model1.prop1);
      done();
    });

    model1.prop1 = {
      deep: 'someNewValue'
    };
  }, 50);

  //-----------------------------------
  // Injection by id and deep path (2)
  //-----------------------------------
  it('Injection by id and deep path (2)', (done) => {
    watcher.watch('model1', 'prop1.deep', (arg) => {
      console.log(arg);
      expect(arg[0].value).toEqual('someNewValue');
      done();
    });

    model1.prop1 = {
      deep: 'someNewValue'
    };
  }, 50);
});
