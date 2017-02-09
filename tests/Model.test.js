/* eslint-disable no-unused-vars */

window.__DEV__ = true;

import TestUtils from 'react-addons-test-utils';
import React from 'react';
import Ringa, {__hardReset} from '../src/index';
import Model from '../src/Model';

describe('Model', () => {
  let model;

  beforeEach(() => {
    model = new Model();
  });

  afterEach(() => {
    __hardReset();
  });

  it('should create without error and have proper id', () => {
    expect(model.id).toEqual('Model1');
  });
});
