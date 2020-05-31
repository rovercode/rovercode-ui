import { combineReducers } from 'redux';
import auth from './auth';
import code from './code';
import console from './console';
import curriculum from './curriculum';
import program from './program';
import rover from './rover';
import sensor from './sensor';
import tag from './tag';
import user from './user';

export default combineReducers({
  auth,
  code,
  console,
  curriculum,
  program,
  rover,
  sensor,
  tag,
  user,
});
