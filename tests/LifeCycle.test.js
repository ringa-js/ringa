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

describe('LifeCycle', () => {
  let command, domNode, reactNode, threadFactory,
      threadFactory2, controller;

  beforeEach(() => {
    domNode = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(
      <div>Controller Attach Point</div>
    ));

    controller = new TestController('testController', domNode, {
      timeout: 500
    });

    threadFactory = controller.addListener(TEST_EVENT);
    threadFactory2 = controller.addListener(TEST_EVENT2);
  });

  afterEach(() => {
    __hardReset();
  });

  //-----------------------------------
  // RingaEvent -> 1 Command
  //-----------------------------------
  it('RingaEvent -> 1 Command', (done) => {
    let testObject = {
      value: 'test'
    };

    threadFactory.add(CommandSimple);

    let ringaEvent = Ringa.dispatch(TEST_EVENT, { testObject }, domNode).addDoneListener(() => {
      expect(testObject.executed).toEqual(true);
      done();
    });
  }, 50);

  //-----------------------------------
  // RingaEvent -> 2 Commands
  //-----------------------------------
  it('RingaEvent -> 2 Commands', (done) => {
    let testObject = {
      value: 'test'
    };

    threadFactory.addAll([CommandSimple,CommandSimple]);

    let ringaEvent = Ringa.dispatch(TEST_EVENT, { testObject }, domNode);

    ringaEvent.addDoneListener(() => {
      expect(testObject.count).toEqual(2);
      done();
    });
  }, 50);

  //-----------------------------------
  // RingaEvent -> 1 Function
  //-----------------------------------
  it('RingaEvent -> 1 Function', (done) => {
    let a = 0;

    threadFactory.add(() => {
      a = 1;
    });

    let ringaEvent = Ringa.dispatch(TEST_EVENT, undefined, domNode);

    ringaEvent.addDoneListener(() => {
      expect(a).toEqual(1);
      done();
    });
  }, 50);

  //-----------------------------------
  // RingaEvent -> 2 Functions
  //-----------------------------------
  it('RingaEvent -> 2 Functions', (done) => {
    let a = 0;

    threadFactory.add(() => {
      a = 1;
    },() => {
      a = 2;
    });

    let ringaEvent = Ringa.dispatch(TEST_EVENT, undefined, domNode);

    ringaEvent.addDoneListener(() => {
      expect(a).toEqual(2);
      done();
    });
  }, 50);

  //-----------------------------------
  // RingaEvent -> 1 Function, modify event
  //-----------------------------------
  it('RingaEvent -> 1 Function, modify event', (done) => {
    let obj = {};

    threadFactory.add((ringaEvent) => {
      ringaEvent.detail.itsWorking = true;
    });

    let ringaEvent = Ringa.dispatch(TEST_EVENT, obj, domNode);

    ringaEvent.addDoneListener(() => {
      expect(obj.itsWorking).toEqual(true);
      done();
    });
  }, 50);

  //-----------------------------------
  // RingaEvent -> 2 Functions, modify event
  //-----------------------------------
  it('RingaEvent -> 2 Functions, modify event', (done) => {
    let obj = {};

    threadFactory.add((ringaEvent) => {
      ringaEvent.detail.test1 = true;
    });

    threadFactory.add((ringaEvent) => {
      ringaEvent.detail.test2 = true;
    });

    let ringaEvent = Ringa.dispatch(TEST_EVENT, obj, domNode);

    ringaEvent.addDoneListener(() => {
      expect(obj.test1).toEqual(true);
      expect(obj.test2).toEqual(true);
      done();
    });
  }, 50);

  //-----------------------------------
  // RingaEvent -> Ringa.dispatch
  //-----------------------------------
  it('RingaEvent -> Ringa.dispatch', (done) => {
    let ringaEvent2, ringaEvent;
    let obj = {}, obj2 = {};

    threadFactory.add((ringaEvent) => {
      ringaEvent.detail.test1 = true;
      ringaEvent2 = Ringa.dispatch(TEST_EVENT2, obj2, domNode);

      ringaEvent2.addDoneListener(() => {
        expect(obj.test1).toEqual(true);
        expect(obj2.test2).toEqual(true);
        expect(ringaEvent.detail.test1).toEqual(true);
        expect(ringaEvent2.detail.test2).toEqual(true);
        done();
      });
    });

    threadFactory2.add((ringaEvent) => {
      ringaEvent.detail.test2 = true;
    });

    ringaEvent = Ringa.dispatch(TEST_EVENT, obj, domNode);
  }, 50);

  //-----------------------------------
  // RingaEvent -> EventExecutor
  //-----------------------------------
  it('RingaEvent -> EventExecutor', (done) => {
    let ringaEvent, ringaEvent2;
    let obj = {};

    threadFactory.add(TEST_EVENT2);

    threadFactory2.add((ringaEvent) => {
      ringaEvent.detail.test2 = true;

      ringaEvent2 = ringaEvent;
    });

    ringaEvent = Ringa.dispatch(TEST_EVENT, obj, domNode);

    // This should not be called until the second RingaEvent is done!
    ringaEvent.addDoneListener(() => {
      expect(ringaEvent2.detail.test2).toEqual(true);
      done();
    });
  }, 50);

  //-----------------------------------
  // RingaEvent -> 2 EventExecutors
  //-----------------------------------
  it('RingaEvent -> 2 EventExecutor', (done) => {
    let ringaEvent, ringaEvent2, ringaEvent3;
    let count = 0;

    threadFactory.add(TEST_EVENT2);
    threadFactory.add(TEST_EVENT2);

    threadFactory2.add((ringaEvent) => {
      ringaEvent.detail.test = true;

      if (ringaEvent2) {
        ringaEvent3 = ringaEvent;
      } else {
        ringaEvent2 = ringaEvent;
      }

      count++;
    });

    ringaEvent = Ringa.dispatch(TEST_EVENT, undefined, domNode);

    // This should not be called until the second ringaevent is done!
    ringaEvent.addDoneListener(() => {
      expect(ringaEvent2.detail.test).toEqual(true);
      expect(ringaEvent2.detail.test).toEqual(true);
      expect(count).toEqual(2);
      done();
    });
  }, 50);

  //-----------------------------------
  // RingaEvent -> EventExecutors
  //-----------------------------------
  it('RingaEvent -> 100 EventExecutor', (done) => {
    let ringaEvent;
    let count = 0;

    for (let i = 0; i < 100; i++) {
      threadFactory.add(TEST_EVENT2);
    }

    threadFactory2.add(() => {
      count++;
    });

    ringaEvent = Ringa.dispatch(TEST_EVENT, undefined, domNode);

    // This should not be called until the second ringaevent is done!
    ringaEvent.addDoneListener(() => {
      expect(count).toEqual(100);
      done();
    });
  }, 1000);

  //-----------------------------------
  // RingaEvent -> 100 EventExecutors
  //-----------------------------------
  it('RingaEvent -> 100 EventExecutor', (done) => {
    let ringaEvent;
    let count = 0;

    for (let i = 0; i < 100; i++) {
      threadFactory.add(TEST_EVENT2);
    }

    threadFactory2.add(() => {
      count++;
    });

    ringaEvent = Ringa.dispatch(TEST_EVENT, undefined, domNode);

    // This should not be called until the second ringaevent is done!
    ringaEvent.addDoneListener(() => {
      expect(count).toEqual(100);
      done();
    });
  }, 1000);

  //-----------------------------------
  // RingaEvent -> 20 EventExecutors Sequence Test
  //-----------------------------------
  it('RingaEvent -> 20 EventExecutor Sequence Test', (done) => {
    let ringaEvent;
    let sequence = '';

    for (let i = 0; i < 21; i++) {
      threadFactory.add(Ringa.event(TEST_EVENT2, {
        val: i
      }));
    }

    threadFactory2.add((val) => {
      sequence+=val.toString();
    });

    controller.options.warnOnDetailOverwrite = false;

    ringaEvent = Ringa.dispatch(TEST_EVENT, undefined, domNode);

    // This should not be called until the second ringaevent is done!
    ringaEvent.addDoneListener(() => {
      expect(sequence).toEqual('01234567891011121314151617181920');
      done();
    });
  }, 1000);

  //------------------------------------------------
  // RingaEvent -> 10 EventExecutors Depth Test
  //------------------------------------------------
  it('RingaEvent -> 10 EventExecutor Depth Test', (done) => {
    let sequence = '';

    for (let i = 0; i < 10; i++) {
      let eventType = 'TestEvent_' + i;
      let nextEventType = 'TestEvent_' + (i + 1);

      let arr = [() => {
        sequence += i;
      }];

      if (i < 9) {
        arr.push(nextEventType);
      }

      arr.push(() => {
        sequence += i;
      });

      controller.addListener(eventType, arr);
    }

    Ringa.dispatch('TestEvent_0', undefined, domNode)
      .addDoneListener(() => {
        expect(sequence).toEqual('01234567899876543210');
        done();
      });
  }, 1000);

  //------------------------------------------------
  // RingaEvent -> Verify details are passed to secondary chain for function
  //------------------------------------------------
  it('RingaEvent -> Verify details are passed to secondary chain for function', (done) => {
    controller.addListener('TestEvent', [
      (property) => {
        expect(property).toEqual('some words');
        done();
      }
      ]);

    controller.addListener('StartEvent', [
      'TestEvent'
      ]);

    Ringa.dispatch('StartEvent', {
      property: 'some words'
    }, domNode);

  }, 1000);

  //------------------------------------------------
  // RingaEvent -> Verify warning on event executor detail property overwrite
  //------------------------------------------------
  it('RingaEvent -> Verify warning on event executor detail property overwrite', (done) => {
    controller.addListener('TestEvent', [
      (property) => {
        expect(property).toEqual('some words');
        done();
      }
      ]);

    controller.addListener('StartEvent', [
      'TestEvent'
      ]);

    Ringa.dispatch('StartEvent', {
      property: 'some words'
    }, domNode);

  }, 1000);
});
