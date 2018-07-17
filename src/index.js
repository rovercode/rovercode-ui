import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import App from './containers/App';
import LoginCallback from './containers/LoginCallback';
import Accounts from './containers/Accounts/Base';

render(
  <BrowserRouter>
    <CookiesProvider>
      <Switch>
        <Route path="/accounts" component={Accounts} />
        <Route exact path="/login/:service/callback" component={LoginCallback} />
        <Route exact path="/" component={App} />
      </Switch>
    </CookiesProvider>
  </BrowserRouter>,
  document.getElementById('app'),
);
