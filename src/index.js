import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import NotFound from '@/containers/Global/NotFound';

import App from './containers/App';
import Accounts from './containers/Accounts/Base';

render(
  <BrowserRouter>
    <CookiesProvider>
      <Switch>
        <Route path="/accounts" component={Accounts} />
        <Route exact path="/" component={App} />
        <Route component={NotFound} />
      </Switch>
    </CookiesProvider>
  </BrowserRouter>,
  document.getElementById('app'),
);
