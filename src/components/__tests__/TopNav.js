import React from 'react';
import { shallow } from 'enzyme';
import TopNav from '../TopNav';

describe('The TopNav component', () => {
  test('should render on the page with no errors', () => {
    const topNav = shallow(<TopNav userName="Dale Gribble" />);
    expect(topNav).toMatchSnapshot();
  });
});
