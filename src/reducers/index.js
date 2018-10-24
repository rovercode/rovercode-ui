import { combineReducers } from 'redux';
import code from './code';
import console from './console';
import rover from './rover';
import sensor from './sensor';
import user from './user';

export default combineReducers({
  code,
  console,
  rover,
  sensor,
  user,
});
