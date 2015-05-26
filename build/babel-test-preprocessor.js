/**
 * Created by Filipe on 26/05/2015.
 */
'use strict';

var registerBabel = require('babel/register');

registerBabel({
  stage: 0,
  optional: ['runtime', 'asyncToGenerator']
});