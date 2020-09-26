import React from 'react';

import PlanItem from '../PlanItem';

describe('The PlanItem component', () => {
  test('renders active on the page with no errors', () => {
    const wrapper = mountWithIntl(
      <PlanItem title="Test Title" active>
        <div />
      </PlanItem>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  test('renders inactive on the page with no errors', () => {
    const wrapper = mountWithIntl(
      <PlanItem title="Test Title">
        <div />
      </PlanItem>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
