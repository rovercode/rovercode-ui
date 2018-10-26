import { combineReducers } from 'redux';
import code from './code';
import console from './console';
import rover from './rover';
import program from './program';
import sensor from './sensor';
import chatapp from './chatapp';
import chatform from './chatform';
import supporthome from './supporthome';
import chatwidget from './chatwidget';
import user from './user';

export default combineReducers({
  code,
  console,
  rover,
  program,
  sensor,
  chatapp,
  chatform,
  supporthome,
  chatwidget,
  user,
});
