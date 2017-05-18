/* eslint-disable no-unused-vars */

import TestUtils from 'react-dom/test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {__hardReset, Bus} from '../src/index';
import TestController from './shared/TestController';

const TEST_EVENT = 'testEvent';
const TEST_EVENT2 = 'testEvent2';

describe('Controller', () => {
  let command, domNode, bus, reactNode, threadFactory, threadFactory2, controller;

  beforeEach(() => {
    let ran = Math.random();

    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div key={ran.toString()}>Controller Attach Point</div>
    ));

    bus = new Bus();

    controller = new TestController('testController', domNode);

    threadFactory = controller.addListener(TEST_EVENT);
    threadFactory2 = controller.addListener(TEST_EVENT2);
  });

  afterEach(() => {
    __hardReset();
  });

  it('should have a properly defined id', () => {
    expect(controller.id).toEqual('TestController1');
  });

  it('should have a properly defined name', () => {
    expect(controller.name).toEqual('testController');
  });

  it('should default options properly', () => {
    expect(controller.options).toBeDefined();
    expect(controller.options.injections).toBeDefined();
    expect(controller.options.timeout).toEqual(5000);
    expect(controller.options.throwKillsThread).toEqual(true);
  });

  it('should have an injections property', () => {
    expect(controller.options.injections).toEqual(controller.injections);
  });

  it('should allow you to override the default options', () => {
    let c = new Ringa.Controller('c', domNode, {
      timeout: 1,
      throwKillsThread: false
    });

    expect(c.options).toBeDefined();
    expect(c.options.timeout).toEqual(1);
    expect(c.options.throwKillsThread).toEqual(false);
  });

  it('should have an attached domNode (or domNode)', () => {
    expect(controller.bus).toEqual(domNode);
  });

  it('should not error if no bus is provided', () => {
    controller = new TestController('nobus');

    expect(controller.bus).toEqual(undefined);
  });

  it('should allow attaching of domNode after constructor (DOM Node)', () => {
    controller = new TestController('busLater');

    controller.bus = domNode;

    expect(controller.bus).toEqual(domNode);
  });

  it('should allow attaching of domNode after constructor (Bus)', () => {
    controller = new TestController('busLater');

    controller.bus = bus;

    expect(controller.bus).toEqual(bus);
  });

  it('should call domNodeMounted when the domNode is set (DOM Node)', (done) => {
    controller = new TestController('busLater');

    expect(controller.mounted).toEqual(false);

    controller.bus = domNode;

    setTimeout(() => {
      expect(controller.mounted).toEqual(true);
      done();
    }, 0);
  });

  it('should call domNodeMounted when the domNode is set (Bus)', (done) => {
    controller = new TestController('busLater');

    expect(controller.mounted).toEqual(false);

    controller.bus = bus;

    setTimeout(() => {
      expect(controller.mounted).toEqual(true);
      done();
    }, 0);
  });

  it('should automatically attach listeners when the DOM Node is set', (done) => {
    controller = new TestController('busLater');

    expect(controller.hasListener('someEvent')).toEqual(false);
    expect(controller.isListening('someEvent')).toEqual(false);

    controller.addListener('someEvent', () => {});

    expect(controller.hasListener('someEvent')).toEqual(true);
    expect(controller.isListening('someEvent')).toEqual(false);

    expect(controller.mounted).toEqual(false);

    controller.bus = domNode;

    setTimeout(() => {
      expect(controller.hasListener('someEvent')).toEqual(true);
      expect(controller.isListening('someEvent')).toEqual(true);

      expect(controller.mounted).toEqual(true);

      done();
    }, 0);
  });

  it('should automatically attach listeners when the Bus is set', (done) => {
    controller = new TestController('busLater');

    expect(controller.hasListener('someEvent')).toEqual(false);
    expect(controller.isListening('someEvent')).toEqual(false);

    controller.addListener('someEvent', () => {});

    expect(controller.hasListener('someEvent')).toEqual(true);
    expect(controller.isListening('someEvent')).toEqual(false);

    expect(controller.mounted).toEqual(false);

    controller.bus = bus;

    setTimeout(() => {
      expect(controller.hasListener('someEvent')).toEqual(true);
      expect(controller.isListening('someEvent')).toEqual(true);

      expect(controller.mounted).toEqual(true);

      done();
    }, 0);
  });

  it('should automatically remove listeners when the domNode is unset', (done) => {
    controller = new TestController('busLater');

    controller.addListener('someEvent', () => {});

    controller.bus = domNode;
    controller.bus = undefined;

    setTimeout(() => {
      expect(controller.hasListener('someEvent')).toEqual(true);
      expect(controller.isListening('someEvent')).toEqual(false);

      expect(controller.mounted).toEqual(true);

      done();
    }, 0);
  });

  it('should automatically remove listeners when the bus is unset', () => {
    controller = new TestController('busLater');

    controller.addListener('someEvent', () => {});

    controller.bus = bus;
    controller.bus = undefined;

    setTimeout(() => {
      expect(controller.hasListener('someEvent')).toEqual(true);
      expect(controller.isListening('someEvent')).toEqual(false);

      expect(controller.mounted).toEqual(true);

      done();
    }, 0);
  });

  it('should automatically convert an array to a ThreadFactory and return it during addListener', () => {
    let ctf = controller.addListener('test', [() => {}]);
    expect(ctf).toBeDefined();
  });

  it('should block adding the same event listener twice (DOM Node)', () => {
    controller.addListener('test');

    expect(() => {
      controller.addListener('test');
    }).toThrow();
  });

  it('should block adding the same event listener twice (Bus)', () => {
    controller.bus = bus;

    controller.addListener('test');

    expect(() => {
      controller.addListener('test');
    }).toThrow();
  });

  it('should let you retrieve an already saved command thread factory by eventType (DOM Node)', () => {
    let ctf = controller.addListener('test', [() => {}]);
    expect(ctf).toEqual(controller.getThreadFactoryFor('test'));
  });

  it('should let you retrieve an already saved command thread factory by eventType (Bus)', () => {
    controller.bus = bus;

    let ctf = controller.addListener('test', [() => {}]);
    expect(ctf).toEqual(controller.getThreadFactoryFor('test'));
  });

  it('should let you see if an eventType has already been added (DOM Node)', () => {
    let ctf = controller.addListener('test', [() => {}]);
    expect(controller.hasListener('test')).toEqual(true);
    expect(controller.hasListener('test2')).toEqual(false);
  });

  it('should let you see if an eventType has already been added (Bus)', () => {
    controller.bus = bus;

    let ctf = controller.addListener('test', [() => {}]);
    expect(controller.hasListener('test')).toEqual(true);
    expect(controller.hasListener('test2')).toEqual(false);
  });

  it('should allow you to remove a listener (DOM Node)', () => {
    let ctf1 = controller.addListener('test', []);
    expect(controller.hasListener('test')).toEqual(true);
    let ctf2 = controller.removeListener('test');
    expect(controller.hasListener('test')).toEqual(false);

    expect(ctf1).toEqual(ctf2);
  });

  it('should allow you to remove a listener (Bus)', () => {
    controller.bus = bus;

    let ctf1 = controller.addListener('test', []);
    expect(controller.hasListener('test')).toEqual(true);
    let ctf2 = controller.removeListener('test');
    expect(controller.hasListener('test')).toEqual(false);

    expect(ctf1).toEqual(ctf2);
  });

  it('should allow you to override the preInvokeHandler', (done) => {
    class TC extends Ringa.Controller {
      preInvokeHandler(ringaEvent) {
        expect(ringaEvent.type).toEqual('test');
        this.preinvokeRan = true;
      }
    };

    let tc = new TC('TC', domNode);
    let ran = false;

    tc.addListener('test', [() => {
      ran = true;
    }]);

    Ringa.dispatch('test', undefined, domNode).addDoneListener(() => {
      expect(ran).toEqual(true);
      expect(tc.preinvokeRan).toEqual(true);
      done();
    });
  });

  it('should properly handle errors in preInvokeHandler', (done) => {
    class TC extends Ringa.Controller {
      preInvokeHandler(ringaEvent) {
        throw Error('whatever');
      }
    };

    let tc = new TC('TC', domNode);
    tc.options.consoleLogFails = false;
    let ran = false;

    tc.addListener('test', [() => {
      ran = true;
    }]);

    Ringa.dispatch('test', undefined, domNode).addFailListener((event) => {
      expect(event.error.message).toEqual('whatever');
      expect(ran).toEqual(false);
      done();
    });
  });

  it('should allow you to override the postInvokeHandler', (done) => {
    let ran = false;
    class TC extends Ringa.Controller {
      postInvokeHandler(ringaEvent, commandThread) {
        expect(ringaEvent.type).toEqual('test');
        expect(commandThread).toBeDefined();
        expect(ran).toEqual(true);
        done();
      }
    };

    let tc = new TC('TC', domNode);

    tc.addListener('test', [() => {
      ran = true;
    }]);

    Ringa.dispatch('test', undefined, domNode);
  });

  it('should have a dispatch method that dispatches directly on the domNode for the controller', (done) => {
    controller.addListener('test1', [() => {
      done();
    }]);

    controller.dispatch('test1', undefined);
  });

  it('should have a dispatch method that dispatches directly on the Bus for the controller', (done) => {
    controller.bus = bus;

    controller.addListener('test1', [() => {
      done();
    }]);

    controller.dispatch('test1', undefined);
  });

  it('should have a working addEventTypeStatics', () => {
    controller.addEventTypeStatics(['whatever', 'hello world', 'to-snake-case', 'anotherTest']);

    expect(TestController.WHATEVER).toEqual('whatever');
    expect(TestController.HELLO_WORLD).toEqual('hello world');
    expect(TestController.TO_SNAKE_CASE).toEqual('to-snake-case');
    expect(TestController.ANOTHER_TEST).toEqual('anotherTest');

    expect(controller.WHATEVER).toEqual('whatever');
    expect(controller.HELLO_WORLD).toEqual('hello world');
    expect(controller.TO_SNAKE_CASE).toEqual('to-snake-case');
    expect(controller.ANOTHER_TEST).toEqual('anotherTest');
  });

  it('events created with addEventTypeStatics should work', (done) => {
    controller.addEventTypeStatics(['test event types']);

    controller.addListener(TestController.TEST_EVENT_TYPES, [() => {}]);

    Ringa.dispatch(TestController.TEST_EVENT_TYPES, undefined, domNode).then(() => done());
  });

  it('should auto-add event types as snake case properties', () => {
    controller.addListener('testingThis out', [() => {}]);

    expect(TestController.TESTING_THIS_OUT).toEqual('testingThis out');
    expect(controller.TESTING_THIS_OUT).toEqual('testingThis out');
  });

  it('should take a passed in ExecutorFactory and wrap in an array (function)', (done) => {
    controller.addListener('fin', () => {done();});

    Ringa.dispatch('fin', undefined, domNode);
  });

  it('should take a passed in ExecutorFactory and wrap in an array (event)', (done) => {

    controller.addListener('fin', () => {done();});
    controller.addListener('start', 'fin');

    Ringa.dispatch('start', undefined, domNode);
  });

  it('should have a watch() that works properly (1/2)', (done) => {
    let a = 0;

    controller.addListener('fin', () => {a = 3;});
    controller.addListener('start', 'fin');

    controller.watch(['start'], () => {
      expect(a).toEqual(3);
      done();
    });

    Ringa.dispatch('start', undefined, domNode);
  }, 50);

  it('should have a watch() that works properly (2/2)', (done) => {
    let a = 0;
    let count = 0;

    controller.addListener('fin', () => {a = 3;});
    controller.addListener('start', 'fin');

    controller.watch(['start', 'fin'], ($ringaEvent) => {
      if (count === 0) {
        expect($ringaEvent.type).toEqual('fin');
        count = 1;
      } else if (count === 1) {
        expect($ringaEvent.type).toEqual('start');
        done();
      }
    });

    Ringa.dispatch('start', undefined, domNode);
  }, 50);

  it('should have a watch() that works properly with injections', (done) => {
    let model = controller.injections.model = {
      someValue: 'someValue'
    };

    controller.addListener('start', () => {});

    controller.watch(['start'], (model) => {
      expect(model.someValue).toEqual('someValue');
      done();
    });

    Ringa.dispatch('start', undefined, domNode);
  }, 50);
});
