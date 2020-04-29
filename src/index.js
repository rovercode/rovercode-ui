import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-less/semantic.less';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promise from 'redux-promise-middleware';
import createDebounce from 'redux-debounced';
import * as Sentry from '@sentry/browser';
import appReducers from './reducers/index';
import { USER_LOGOUT } from './actions/auth';
import AuthApi from './utils/auth-api';


import NotFound from './containers/Global/NotFound';
import ProgramList from './containers/ProgramList';
import Accounts from './containers/Accounts/Base';
import MissionControl from './containers/MissionControl';
import UserSetting from './containers/UserSetting';
import ProtectedRoute from './components/ProtectedRoute';

import enMessages from './translations/locales/en.json';
import esMessages from './translations/locales/es.json';

const translations = {
  en: enMessages,
  es: esMessages,
};

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0])
  || navigator.language
  || navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

// Try full locale, try locale without region code, fallback to 'en'
const messages = translations[languageWithoutRegionCode]
  || translations[language]
  || translations.en;

Sentry.init({
  dsn: SENTRY_DSN, // eslint-disable-line no-undef
});

/* eslint-disable-next-line no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const reduxMiddleware = composeEnhancers(
  applyMiddleware(
    thunk,
    createLogger(),
    promise,
    createDebounce(),
  ),
);

const authApi = new AuthApi();
const preloadedState = {
  user: authApi.userData(),
};

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined;
  }

  return appReducers(state, action);
};

const store = createStore(rootReducer, preloadedState, reduxMiddleware);

// sets a reference to store @ window.store
Object.assign(window, { store });

render(
  <IntlProvider locale={language} messages={messages}>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <CookiesProvider>
          <Switch>
            <Route path="/accounts" component={Accounts} />
            <ProtectedRoute exact path="/" component={ProgramList} />
            <ProtectedRoute exact path="/programs" component={ProgramList} />
            <ProtectedRoute exact path="/mission-control" component={MissionControl} />
            <ProtectedRoute exact path="/user/settings" component={UserSetting} />
            <Route component={NotFound} />
          </Switch>
        </CookiesProvider>
      </BrowserRouter>
    </ReduxProvider>
  </IntlProvider>,
  document.getElementById('app'),
);
