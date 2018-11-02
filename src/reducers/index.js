import { combineReducers } from 'redux';
import auth from './auth';
import code from './code';
import console from './console';
import rover from './rover';
import sensor from './sensor';
import user from './user';

export default combineReducers({
  auth,
  code,
  console,
  rover,
  sensor,
  user,
});
