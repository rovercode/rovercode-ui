import React from 'react';

import PlanFree from '../PlanFree';

describe('The PlanFree component', () => {
  test('renders on the page with no errors', () => {
    const wrapper = shallowWithIntl(<PlanFree freeSlots={2} />);
    expect(wrapper).toMatchSnapshot();
  });
});
