/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import Ringa, {__hardReset, Bus} from '../src/index';

const TEST_EVENT = 'testEvent';

describe('Bus', () => {
  let bus;

  beforeEach(() => {
    bus = new Bus();
  });

  afterEach(() => {
    __hardReset();
  });

  it('should create without error and have proper id', () => {
    bus = new Bus();
    expect(bus.id).toEqual('bus1');
  });

  it('should create without error and have proper id', () => {
    bus = new Bus('test');
    expect(bus.id).toEqual('test');
  });

  it('should have proper starting properties', () => {
    expect(bus.children).toEqual([]);
    expect(bus.parent).toEqual(undefined);
    expect(bus._map).toEqual({});
    expect(bus._captureMap).toEqual({});
  });

  it('should have a working addChild method', () => {
    let b2 = new Bus();
    bus.addChild(b2);

    expect(bus.getChildAt(0)).toEqual(b2);
  });

  it('should have a working removeChild method', () => {
    let b2 = new Bus();
    bus.addChild(b2);
    bus.removeChild(b2);

    expect(bus.getChildAt(0)).toEqual(undefined);
  });

  it('should have a working addEventListener method (bubble on self)', (done) => {
    bus.addEventListener('test', () => {
      done();
    });

    bus.dispatch({
      type: 'test'
    });
  }, 5);

  it('should have a working removeEventListener method', () => {
    let f = () => {
      throw new Error('Should not have been called!');
    };

    bus.addEventListener('test', f);
    bus.removeEventListener('test', f);

    bus.dispatch({
      type: 'test'
    });
  });

  it('should have a working hasListener method', () => {
    bus.addEventListener('test', () => {
      done();
    });

    expect(bus.hasListener('test')).toEqual(true);
    expect(bus.hasListener('whatever')).toEqual(false);
  });

  it('should have a working addEventListener method (bubble to parents)', () => {
    let curB, prevB;
    let result = '';

    for (let i = 0; i < 10; i++) {
      curB = new Bus();
      curB.addEventListener('test', ((j) => {
        result += j;
      }).bind(undefined, i));
      if (prevB) {
        prevB.addChild(curB);
      }
      prevB = curB;
    }

    curB.dispatch({
      type: 'test'
    });

    expect(result).toEqual('9876543210');
  });

  it('should have a working addEventListener method (capture and bubble)', () => {
    let curB, prevB;
    let result = '';

    for (let i = 0; i < 10; i++) {
      curB = new Bus();

      curB.addEventListener('test', ((j) => {
        result += j;
      }).bind(undefined, i), true);

      curB.addEventListener('test', ((j) => {
        result += j;
      }).bind(undefined, i));

      if (prevB) {
        prevB.addChild(curB);
      }
      prevB = curB;
    }

    curB.dispatch({
      type: 'test'
    });

    expect(result).toEqual('0123456789876543210');
  });
});
