import { combineReducers } from 'redux';
import auth from './auth';
import code from './code';
import console from './console';
import program from './program';
import rover from './rover';
import sensor from './sensor';
import user from './user';

export default combineReducers({
  auth,
  code,
  console,
  program,
  rover,
  sensor,
  user,
});
