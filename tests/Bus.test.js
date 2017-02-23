/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import Ringa, {__hardReset, Bus} from '../src/index';

describe('Bus', () => {
  let bus;

  beforeEach(() => {
    bus = new Bus();
  });

  afterEach(() => {
    __hardReset();
  });

  it('should create without error and have proper id', () => {
    expect(bus.id).toEqual('Bus1');
  });

  it('should create without error and have proper custom id and name', () => {
    bus = new Bus('__name__', '__id__');

    expect(bus.name).toEqual('__name__');
    expect(bus.id).toEqual('__id__');
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

    bus.dispatchEvent({
      type: 'test'
    });
  }, 5);

  it('should have a working removeEventListener method', () => {
    let f = () => {
      throw new Error('Should not have been called!');
    };

    bus.addEventListener('test', f);
    bus.removeEventListener('test', f);

    bus.dispatchEvent({
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

    curB.dispatchEvent({
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

    curB.dispatchEvent({
      type: 'test'
    });

    expect(result).toEqual('0123456789876543210');
  });

  it('should error if we add as a child a Bus that already has a parent', () => {
    let a, b;

    a = new Bus();
    b = new Bus();

    bus.addChild(a);

    expect(() => {
      b.addChild(b);
    });
  });
});
