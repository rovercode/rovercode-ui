import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promise from 'redux-promise-middleware';
import rootReducer from './reducers/index';
import AuthApi from './utils/auth-api';


import NotFound from './containers/Global/NotFound';
import ProgramList from './containers/ProgramList';
import RoverDetail from './containers/RoverDetail';
import RoverList from './containers/RoverList';
import Accounts from './containers/Accounts/Base';
import MissionControl from './containers/MissionControl';
import ProtectedRoute from './components/ProtectedRoute';

/* eslint-disable-next-line no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxMiddleware = composeEnhancers(
  applyMiddleware(
    thunk,
    createLogger(),
    promise,
  ),
);

const authApi = new AuthApi();
const preloadedState = {
  user: authApi.userData(),
};
const store = createStore(rootReducer, preloadedState, reduxMiddleware);

// sets a reference to store @ window.store
Object.assign(window, { store });

render(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <CookiesProvider>
        <Switch>
          <Route path="/accounts" component={Accounts} />
          <ProtectedRoute exact path="/" component={ProgramList} />
          <ProtectedRoute exact path="/programs" component={ProgramList} />
          <ProtectedRoute exact path="/rovers" component={RoverList} />
          <ProtectedRoute exact path="/rovers/:id(\d+)" component={RoverDetail} />
          <ProtectedRoute exact path="/mission-control" component={MissionControl} />
          <Route component={NotFound} />
        </Switch>
      </CookiesProvider>
    </BrowserRouter>
  </ReduxProvider>,
  document.getElementById('app'),
);
