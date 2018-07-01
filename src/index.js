import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import App from './containers/App';
import Login from './containers/Login';
import LoginCallback from './containers/LoginCallback';

render(
  <BrowserRouter>
    <CookiesProvider>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/login/:service/callback" component={LoginCallback} />
        <Route path="/" component={App} />
      </Switch>
    </CookiesProvider>
  </BrowserRouter>,
  document.getElementById('app'),
);
