/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ring from '../src/index';
import TestController from './shared/TestController';
import CommandSimple from './shared/CommandSimple';

const TEST_EVENT = 'testEvent';
const TEST_EVENT2 = 'testEvent2';

describe('Controller', () => {
  let command, domNode, reactNode, commandThreadFactory,
    commandThreadFactory2, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new TestController('testController', domNode, {
      timeout: 500
    });

    commandThreadFactory = controller.addListener(TEST_EVENT);
    commandThreadFactory2 = controller.addListener(TEST_EVENT2);
  });

  it('should have a properly defined id', () => {
    expect(controller.id).toEqual('testController');
  });

  it('should default options properly', () => {
    expect(controller.options).toBeDefined();
    expect(controller.options.injections).toBeDefined();
  });

  it('should have an attached domNode', () => {
    expect(controller.domNode).toEqual(domNode);
  });

  it('should error if no domNode is provided', () => {
    expect(() => {
      new TestController('noDomNode');
    }).toThrow();
  });

  it('should automatically convert an array to a CommandThreadFactory and return it during addListener', () => {
    let ctf = controller.addListener('test', [() => {}]);
    expect(ctf).toBeDefined();
  });

  it('should block adding the same event listener twice', () => {
    controller.addListener('test');

    expect(() => {
      controller.addListener('test');
    }).toThrow();
  });

  it('should let you retrieve an already saved command thread factory by eventType', () => {
    let ctf = controller.addListener('test', [() => {}]);
    expect(ctf).toEqual(controller.getListener('test'));
  });

  it('should let you see if an eventType has already been added', () => {
    let ctf = controller.addListener('test', [() => {}]);
    expect(controller.hasListener('test')).toEqual(true);
    expect(controller.hasListener('test2')).toEqual(false);
  });

  it('should error if the provided array or CommandThreadFactory to addListener is not a valid type (function)', () => {
    expect(() => {
      controller.addListener('test', () => {});
    }).toThrow();
  });

  it('should error if the provided array or CommandThreadFactory to addListener is not a valid type (object)', () => {
    expect(() => {
      controller.addListener('test', {});
    }).toThrow();
  });

  it('should error if the provided array or CommandThreadFactory to addListener is not a valid type (string)', () => {
    expect(() => {
      controller.addListener('test', 'blah');
    }).toThrow();
  });

  it('should allow you to remove a listener', () => {
    let ctf1 = controller.addListener('test', []);
    expect(controller.hasListener('test')).toEqual(true);
    let ctf2 = controller.removeListener('test');
    expect(controller.hasListener('test')).toEqual(false);

    expect(ctf1).toEqual(ctf2);
  });

  it('should allow you to override the preInvokeHandler', (done) => {
    let _ringEvent;

    class TC extends Ring.Controller {
      preInvokeHandler(ringEvent) {
        expect(ringEvent).toEqual(_ringEvent);
        this.preinvokeRan = true;
      }
    };

    let tc = new TC('TC', domNode);
    let ran = false;
    tc.addListener('test', [() => {
      ran = true;
    }]);

    _ringEvent = Ring.dispatch('test', undefined, domNode).addDoneListener(() => {
      expect(ran).toEqual(true);
      expect(tc.preinvokeRan).toEqual(true);
      done();
    });
  });

  it('should allow you to override the postInvokeHandler', (done) => {
    let _ringEvent;
    let ran = false;
    class TC extends Ring.Controller {
      postInvokeHandler(ringEvent, commandThread) {
        expect(ringEvent).toEqual(_ringEvent);
        expect(commandThread).toBeDefined();
        expect(ran).toEqual(true);
        done();
      }
    };

    let tc = new TC('TC', domNode);

    tc.addListener('test', [() => {
      ran = true;
    }]);

    _ringEvent = Ring.dispatch('test', undefined, domNode);
  });
});
