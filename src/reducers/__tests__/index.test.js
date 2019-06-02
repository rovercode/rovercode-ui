import { createStore } from 'redux';
import rootReducer from '../index';
import roverReducer from '../rover';

describe('The root application reducer', () => {
  let store;
  beforeEach(() => {
    store = createStore(rootReducer);
  });
  test('initial state matches child reducers initial state', () => {
    expect(store.getState().rover).toEqual(roverReducer(undefined, {}));
  });
});
