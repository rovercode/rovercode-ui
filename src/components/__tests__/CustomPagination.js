import React from 'react';
import { shallow } from 'enzyme';
import CustomPagination from '../CustomPagination';

describe('The CustomPagination component', () => {
  test('should render on the page with no errors', () => {
    const wrapper = shallow(
      <CustomPagination
        defaultActivePage={1}
        totalPages={5}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
