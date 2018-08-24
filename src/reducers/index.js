import { combineReducers } from 'redux';
import code from './code';
import rover from './rover';

export default combineReducers({
  code,
  rover,
});
