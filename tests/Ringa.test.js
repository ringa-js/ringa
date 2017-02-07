/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import Ringa, {__hardReset} from '../src/index';

describe('Core', () => {
  afterEach(() => {
    __hardReset();
  });

  //-----------------------------------
  // Memory -> 1 Command Cleanup Thread
  //-----------------------------------
  it('Should warn on duplicate id!', (done) => {
    console.warn = (value) => {
      expect(value).toEqual('Duplicate Ringa id discovered: \'testId\' for \'RingaObject\'. Call RingaObject::destroy() to clear up the id.');
      done();
    };

    new Ringa.RingaObject('testId');
    new Ringa.RingaObject('testId');
  }, 50);
});
