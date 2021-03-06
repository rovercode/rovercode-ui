import React from 'react';
import {IntlProvider} from 'react-intl';
import {mount, shallow} from 'enzyme';

const defaultLocale = 'en';
const locale = defaultLocale;

global.mountWithIntl = (node) => {
  return mount(node, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
    },
  });
}

global.shallowWithIntl = (node) => {
  return shallow(node, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
    },
  });
}
