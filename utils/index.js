
import assign from './assign.js';
import Emitter from './Emitter.js';
import Promise from './Promise.js';
import Transform from './Transform.js';
import debounce from './debounce.js';
import uuid from './uuid.js';

import immutableMerge from './immutableMerge.js';

import stringify from './stringify.js';
import parse from './parse.js';
import parseSchema from './parseSchema.js';
import validateSchema from './validateSchema.js';
import getPropTypes from './getPropTypes.js';
import find from './find.js';
import set from './set.js';
import merge from './merge.js';
import unset from './unset.js';
import except from './except.js';
import equals from './equals.js';
import ArrayFind from './ArrayFind.js';
import inherit from './inherit.js';

export default {
  Emitter: Emitter,
  Promise: Promise,
  Transform: Transform,
  ArrayFind: ArrayFind,
  debounce: debounce,
  uuid: uuid,
  // animation: animation,
  immutableMerge: immutableMerge,
  stringify: stringify,
  parse: parse,
  parseSchema: parseSchema,
  validateSchema: validateSchema,
  getPropTypes: getPropTypes,
  find: find,
  set: set,
  unset: unset,
  merge: merge,
  except: except,
  equals: equals,
  inherit: inherit
};
