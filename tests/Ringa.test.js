/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-dom/test-utils';
import React from 'react';
import Ringa, {__hardReset} from '../src/index';

describe('Core', () => {
  afterEach(() => {
    __hardReset();
  });

  //-----------------------------------
  // Should warn on duplicate id!
  //-----------------------------------
  it('Should warn on duplicate id!', (done) => {
    // Removing this test for now as we have discovered it is essential to be able to have some objects
    // with duplicate id when coming from the database.

    // console.warn = (value) => {
    //   expect(value).toEqual(`Duplicate Ringa id discovered: \"testId\" of type \'RingaObject\'. Call RingaObject::destroy() to clear up the id.`);
    //   done();
    // };
    //
    // new Ringa.RingaObject('name', 'testId');
    // new Ringa.RingaObject('name', 'testId');

    done();
  }, 50);
});
