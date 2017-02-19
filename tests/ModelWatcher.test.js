/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import Ringa, {__hardReset} from '../src/index';
import ModelSimple from './shared/ModelSimple';
import ModelSimpleExt from './shared/ModelSimpleExt';

describe('ModelWatcher', () => {
  let model1, model2, modelExt3, watcher;

  beforeEach(() => {
    model1 = new ModelSimple('model1');
    model2 = new ModelSimple('model2');
    modelExt3 = new ModelSimpleExt('modelExt3');

    watcher = new Ringa.ModelWatcher('modelWatcher');

    watcher.addModel(model1);
    watcher.addModel(model2);
    watcher.addModel(modelExt3);
  });

  afterEach(() => {
    __hardReset();
  });

  //-----------------------------------
  // Has a working watch() method (1)
  //-----------------------------------
  it('Has a working watch() method (1)', () => {
    let callback = () => {};
    watcher.watch('model1', callback);

    expect(watcher.idNameToWatchees['model1'].all[0].handler).toEqual(callback);
    expect(watcher.idNameToWatchees['model1'].byPath).toEqual({});
  });

  //-----------------------------------
  // Has a working watch() method (1.5)
  //-----------------------------------
  it('Has a working watch() method (1.5)', () => {
    let callback = () => {};
    watcher.watch('ModelSimple1', callback);

    expect(watcher.idNameToWatchees['ModelSimple1'].all[0].handler).toEqual(callback);
    expect(watcher.idNameToWatchees['ModelSimple1'].byPath).toEqual({});
  });

  //-----------------------------------
  // Has a working watch() method (2)
  //-----------------------------------
  it('Has a working watch() method (2)', () => {
    let callback = () => {};
    watcher.watch(ModelSimple, callback);

    expect(watcher.classToWatchees[ModelSimple].all[0].handler).toEqual(callback);
    expect(watcher.classToWatchees[ModelSimple].byPath).toEqual({});
  });

  //-----------------------------------
  // Has a working watch() method (3)
  //-----------------------------------
  it('Has a working watch() method (3)', () => {
    let callback = () => {};
    watcher.watch(ModelSimple, 'path', callback);

    expect(watcher.classToWatchees[ModelSimple].all.length).toEqual(0);
    expect(watcher.classToWatchees[ModelSimple].byPath['path'][0].handler).toEqual(callback);
  });

  //-----------------------------------
  // Has a working watch() method (4)
  //-----------------------------------
  it('Has a working watch() method (4)', () => {
    let callback = () => {};
    watcher.watch(ModelSimple, 'path.whatever', callback);

    expect(watcher.classToWatchees[ModelSimple].all.length).toEqual(0);
    expect(watcher.classToWatchees[ModelSimple].byPath['path.whatever'][0].handler).toEqual(callback);
  });

  //-----------------------------------
  // Has a working watch() method (5)
  //-----------------------------------
  it('Has a working watch() method (5)', () => {
    let callback = () => {};
    watcher.watch(ModelSimple, 'path.whatever.superdeep', callback);
    watcher.watch(ModelSimple, 'path2', callback);
    watcher.watch(ModelSimple, callback);

    expect(watcher.classToWatchees[ModelSimple].all.length).toEqual(1);
    expect(watcher.classToWatchees[ModelSimple].all[0].handler).toEqual(callback);
    expect(watcher.classToWatchees[ModelSimple].byPath['path.whatever.superdeep'][0].handler).toEqual(callback);
    expect(watcher.classToWatchees[ModelSimple].byPath['path.whatever'][0].handler).toEqual(callback);
    expect(watcher.classToWatchees[ModelSimple].byPath['path'][0].handler).toEqual(callback);
    expect(watcher.classToWatchees[ModelSimple].byPath['path2'][0].handler).toEqual(callback);
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
  // Watch by name (1)
  //-----------------------------------
  it('Watch by name (1)', (done) => {
    watcher.watch('model1', () => {
      done();
    });

    model1.prop1 = 'someNewValue';
  }, 5);

  //-----------------------------------
  // Watch by Class (1.5)
  //-----------------------------------
  it('Watch by Class (1.5)', (done) => {
    watcher.watch(ModelSimple, () => {
      done();
    });

    model1.prop1 = 'someNewValue';
  }, 5);

  //-----------------------------------
  // Watch by name (2)
  //-----------------------------------
  it('Watch by name (2)', (done) => {
    watcher.watch('model1', (arg) => {
      expect(arg.length).toEqual(1);
      expect(arg[0].model === model1).toEqual(true);
      expect(arg[0].value).toEqual('someNewValue');
      expect(arg[0].watchedValue === model1).toEqual(true);
      expect(arg[0].path).toEqual('prop1');
      expect(arg[0].watchedPath).toEqual(undefined);
      done();
    });

    model1.prop1 = 'someNewValue';
  }, 5);

  //-----------------------------------
  // Watch by name and path (1)
  //-----------------------------------
  it('Watch by name and path (1)', (done) => {
    watcher.watch('model1', 'prop1', (arg) => {
      expect(arg.length).toEqual(1);
      expect(arg[0].model === model1).toEqual(true);
      expect(arg[0].value).toEqual('someNewValue');
      done();
    });

    model1.prop1 = 'someNewValue';
  }, 5);

  //-----------------------------------
  // Watch by name and path (2)
  //-----------------------------------
  it('Watch by name and path (2)', (done) => {
    let called = false;
    watcher.watch('model1', 'someInvalidPath', (arg) => {
      called = true;
    });

    model1.prop1 = 'someNewValue';

    setTimeout(() => {
      expect(called).toEqual(false);
      done();
    }, 1);
  }, 5);

  //-----------------------------------
  // Watch by id and path (1)
  //-----------------------------------
  it('Watch by id and path (1)', (done) => {
    watcher.watch('ModelSimple1', 'prop1', (arg) => {
      expect(arg.length).toEqual(1);
      expect(arg[0].model === model1).toEqual(true);
      expect(arg[0].value).toEqual('someNewValue');
      done();
    });

    model1.prop1 = 'someNewValue';
  }, 5);

  //-----------------------------------
  // Watch by id and path (2)
  //-----------------------------------
  it('Watch by id and path (2)', (done) => {
    let called = false;
    watcher.watch('ModelSimple1', 'someInvalidPath', (arg) => {
      called = true;
    });

    model1.prop1 = 'someNewValue';

    setTimeout(() => {
      expect(called).toEqual(false);
      done();
    }, 1);
  }, 5);

  //-----------------------------------
  // Watch by name and deep path (1)
  //-----------------------------------
  it('Watch by name and deep path (1)', (done) => {
    watcher.watch('model1', 'prop1', (arg) => {
      expect(arg[0].value).toEqual(model1.prop1);
      done();
    });

    model1.prop1 = {
      deep: 'someNewValue'
    };
  }, 5);

  //-----------------------------------
  // Watch by name and deep path (2)
  //-----------------------------------
  it('Watch by name and deep path (2)', (done) => {
    watcher.watch('model1', 'prop1.deep', (arg) => {
      expect(arg[0].value).toEqual({
        deep: 'someNewValue'
      });
      expect(arg[0].watchedValue).toEqual('someNewValue');
      done();
    });

    model1.prop1 = {
      deep: 'someNewValue'
    };
  }, 5);

  //-----------------------------------
  // Watch by name and deep path (3)
  //-----------------------------------
  it('Watch by name and deep path (3)', (done) => {
    // prop1.deep.deeper doesn't exist!
    watcher.watch('model1', 'prop1.deep.deeper', (arg) => {
      expect(arg[0].value).toEqual({
        deep: 'someNewValue'
      });
      expect(arg[0].watchedValue).toEqual(undefined);
      done();
    });

    model1.prop1 = {
      deep: 'someNewValue'
    };
  }, 5);

  //-----------------------------------
  // Watch by id and deep path (1)
  //-----------------------------------
  it('Watch by id and deep path (1)', (done) => {
    watcher.watch('ModelSimple1', 'prop1', (arg) => {
      expect(arg[0].value).toEqual(model1.prop1);
      done();
    });

    model1.prop1 = {
      deep: 'someNewValue'
    };
  }, 5);

  //-----------------------------------
  // Watch by id and deep path (2)
  //-----------------------------------
  it('Watch by id and deep path (2)', (done) => {
    watcher.watch('ModelSimple1', 'prop1.deep', (arg) => {
      expect(arg[0].value).toEqual({
        deep: 'someNewValue'
      });
      expect(arg[0].watchedValue).toEqual('someNewValue');
      done();
    });

    model1.prop1 = {
      deep: 'someNewValue'
    };
  }, 5);

  //-----------------------------------
  // Watch by id and deep path (3)
  //-----------------------------------
  it('Watch by id and deep path (3)', (done) => {
    // prop1.deep.deeper doesn't exist!
    watcher.watch('ModelSimple1', 'prop1.deep.deeper', (arg) => {
      expect(arg[0].value).toEqual({
        deep: 'someNewValue'
      });
      expect(arg[0].watchedValue).toEqual(undefined);
      done();
    });

    model1.prop1 = {
      deep: 'someNewValue'
    };
  }, 5);

  //-----------------------------------
  // Watch by id and path by multiple
  //-----------------------------------
  it('Watch by id and path by multiple', (done) => {
    let count = 0;
    // This test is weird. Babel's WeakMap treats function that have the same
    // text output as the same function even if they are technically different instances
    // of the function with different this values... so we test functions that are
    // declared separately but actually have the exact same text. Just want to
    // make sure they are called independently and the ModelWatcher doesn't think
    // function two and three are the same as function one. See ModelWatcher.js and the
    // Watchee __watchees marking mechanism.
    watcher.watch('ModelSimple1', 'prop1', (arg) => {
      count++;
    });
    watcher.watch('ModelSimple1', 'prop1', (arg) => {
      count++;
    });
    watcher.watch('ModelSimple1', 'prop1', (arg) => {
      count++;
    });

    model1.prop1 = 'someNewValue';

    setTimeout(() => {
      expect(count).toEqual(3);
      done();
    }, 0);
  }, 5);

  //-----------------------------------
  // Watch multiple separate handlers (1)
  //-----------------------------------
  it('Watch multiple separate handlers (1)', (done) => {
    let prop1Handler = false;
    watcher.watch('model1', 'prop1', (arg) => {
      expect(arg[0].value).toEqual('prop1val');
      prop1Handler = true;
    });

    watcher.watch('model1', 'prop2', (arg) => {
      expect(arg[0].value).toEqual('prop2val');
      expect(prop1Handler).toEqual(true);
      done();
    });

    model1.prop1 = 'prop1val';
    model1.prop2 = 'prop2val';
  }, 5);

  //-----------------------------------
  // Watch multiple separate handlers (2)
  //-----------------------------------
  it('Watch multiple separate handlers (2)', (done) => {
    let prop1Handler = false;
    watcher.watch('model1', 'prop1', (arg) => {
      expect(arg[0].value).toEqual('prop1val');
      prop1Handler = true;
    });

    watcher.watch('model2', 'prop2', (arg) => {
      expect(arg[0].value).toEqual('prop2val');
      expect(prop1Handler).toEqual(true);
      done();
    });

    model1.prop1 = 'prop1val';
    model2.prop2 = 'prop2val';
  }, 5);

  //-----------------------------------
  // Watch multiple combined handlers (1)
  //-----------------------------------
  it('Watch multiple combined handlers (1)', (done) => {
    let handler = (arg) => {
      expect(arg[0].model).toEqual(model1);
      expect(arg[0].value).toEqual('prop1val');
      expect(arg[1].model).toEqual(model2);
      expect(arg[1].value).toEqual('prop2val');
      expect(arg[2].model).toEqual(modelExt3);
      expect(arg[2].watchedValue).toEqual('whatever');
      expect(arg[2].value).toEqual({
        value: 'whatever'
      });
      done();
    };

    watcher.watch('model1', 'prop1', handler);
    watcher.watch('model2', 'prop2', handler);
    watcher.watch('modelExt3', 'prop3.value', handler);

    model1.prop1 = 'prop1val';
    model2.prop2 = 'prop2val';
    modelExt3.prop3 = {
      value: 'whatever'
    };
  }, 5);

  //-----------------------------------------
  // Watch multiple combined handlers (2)
  //-----------------------------------------
  it('Watch multiple combined handlers (2)', (done) => {
    let handler = (arg) => {
      expect(arg[0].model).toEqual(model1);
      expect(arg[0].value).toEqual('prop1val');
      expect(arg[1].model).toEqual(model2);
      expect(arg[1].value).toEqual('prop2val');
      expect(arg[2].model).toEqual(modelExt3);
      expect(arg[2].watchedValue).toEqual('whatever');
      expect(arg[2].value).toEqual({
        value: 'whatever'
      });
      done();
    };

    watcher.watch('model1', 'prop1', handler);
    watcher.watch('model2', 'prop2', handler);
    watcher.watch(ModelSimpleExt, 'prop3.value', handler);

    model1.prop1 = 'prop1val';
    model2.prop2 = 'prop2val';
    modelExt3.prop3 = {
      value: 'whatever'
    };
  }, 5);

  //--------------------------------------------------------------------------------
  // Watch collision (requesting same type model that exists more than once) (1)
  //--------------------------------------------------------------------------------
  it('Watch collision (requesting same type model that exists more than once) (1)', (done) => {
    let handler = (arg) => {
      expect(arg[0].model).toEqual(model1);
      expect(arg[0].value).toEqual('prop1val');
      expect(arg[1].model).toEqual(model2);
      expect(arg[1].value).toEqual('prop2val');
      expect(arg[2].model).toEqual(modelExt3);
      expect(arg[2].watchedValue).toEqual({
        value:'whatever'
      });
      expect(arg[2].value).toEqual({
        value: 'whatever'
      });
      done();
    };

    watcher.watch(ModelSimple, 'prop1', handler);

    // This should trigger the handler once but with a notification for each of the models!
    model1.prop1 = 'prop1val';
    model2.prop1 = 'prop2val';
    modelExt3.prop1 = {
      value: 'whatever'
    };
  }, 5);

  //-----------------------------------
  // Has a working find() method (1)
  //-----------------------------------
  it('Has a working find() method (1)', () => {
    expect(watcher.find('model1')).toEqual(model1);
    expect(watcher.find('model2')).toEqual(model2);
    expect(watcher.find('modelExt3')).toEqual(modelExt3);
  });

  //-----------------------------------
  // Has a working find() method (2)
  //-----------------------------------
  it('Has a working find() method (2)', () => {
    expect(watcher.find(ModelSimple)).toEqual(model1);
  });

  //-----------------------------------
  // Has a working find() method (3)
  //-----------------------------------
  it('Has a working find() method (3)', () => {
    expect(watcher.find(ModelSimpleExt)).toEqual(modelExt3);
  });

  //-----------------------------------
  // Should throw with an invalid Ringa model
  //-----------------------------------
  it('Should throw with an invalid Ringa model', () => {
    expect(() => {
      watcher.addModel({});
    }).toThrow();
  });
});
