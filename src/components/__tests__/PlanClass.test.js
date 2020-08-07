import React from 'react';
import { shallow } from 'enzyme';

import PlanClass from '../PlanClass';

let upgradeSubscription;

describe('The PlanClass component', () => {
  const setState = jest.fn();

  beforeEach(() => {
    upgradeSubscription = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders on the page with no errors', () => {
    const wrapper = mountWithIntl(
      <PlanClass upgradeSubscription={upgradeSubscription} userId={1} />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('renders typing status on the page with no errors', () => {
    const wrapper = mountWithIntl(
      <PlanClass upgradeSubscription={upgradeSubscription} userId={1} />,
    );
    wrapper.find('input').simulate('change', {
      target: {
        value: 'abc',
      },
    });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  test('renders success status on the page with no errors', () => {
    const wrapper = mountWithIntl(
      <PlanClass upgradeSubscription={upgradeSubscription} userId={1} active />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('sets length on text change', () => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation((init) => [init, setState]);
    const wrapper = shallow(<PlanClass upgradeSubscription={upgradeSubscription} userId={1} />);

    wrapper.find('WithStyles(WithStyles(ForwardRef(TextField)))').simulate('change', {
      target: {
        value: 'abc',
      },
    });
    wrapper.update();

    expect(setState).toHaveBeenCalledWith(3);

    useStateSpy.mockRestore();
  });

  test('attempts upgrade at max length', () => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation((init) => [init, setState]);
    const wrapper = shallow(
      <PlanClass upgradeSubscription={upgradeSubscription} userId={1} maxLength={5} />,
    );

    wrapper.find('WithStyles(WithStyles(ForwardRef(TextField)))').simulate('change', {
      target: {
        value: 'abcde',
      },
    });
    wrapper.update();

    expect(setState).toHaveBeenCalledWith(5);
    expect(upgradeSubscription).toHaveBeenCalledWith(1, 'abcde');

    useStateSpy.mockRestore();
  });
});
