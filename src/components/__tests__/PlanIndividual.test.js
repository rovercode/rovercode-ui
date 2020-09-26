import React from 'react';

import PlanIndividual from '../PlanIndividual';

describe('The PlanIndividual component', () => {
  test('renders on the page with no errors', () => {
    const wrapper = mountWithIntl(<PlanIndividual />);
    expect(wrapper).toMatchSnapshot();
  });
});
