import React from 'react';
import { mount, shallow } from 'enzyme';

import ConnectionHelp from '../ConnectionHelp';

describe('The ConnectionHelp component', () => {

  test('renders on the page with no errors', () => {
    const wrapper = mount(
      <ConnectionHelp />,
    );
    wrapper.find('ConnectionHelp').instance().setState({ open: true });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  test('creates the correct pxt hex links', () => {
    const wrapper = shallow(
      <ConnectionHelp />,
    );

    wrapper.setState({ host: 'alpha.rovercode.com' });
    wrapper.update();
    let downloadButtonHref = wrapper.find('WithStyles(ForwardRef(Button))').at(1).prop('href');
    expect(downloadButtonHref)
      .toBe('https://rovercode-pxt.s3.us-east-2.amazonaws.com/alpha/rovercode.hex');

    wrapper.setState({ host: 'beta.rovercode.com' });
    wrapper.update();
    downloadButtonHref = wrapper.find('WithStyles(ForwardRef(Button))').at(1).prop('href');
    expect(downloadButtonHref)
      .toBe('https://rovercode-pxt.s3.us-east-2.amazonaws.com/beta/rovercode.hex');

    wrapper.setState({ host: 'go.rovercode.com' });
    wrapper.update();
    downloadButtonHref = wrapper.find('WithStyles(ForwardRef(Button))').at(1).prop('href');
    expect(downloadButtonHref)
      .toBe('https://rovercode-pxt.s3.us-east-2.amazonaws.com/prod/rovercode.hex');

    wrapper.setState({ host: 'localhost-or-something-else' });
    wrapper.update();
    downloadButtonHref = wrapper.find('WithStyles(ForwardRef(Button))').at(1).prop('href');
    expect(downloadButtonHref)
      .toBe('https://rovercode-pxt.s3.us-east-2.amazonaws.com/alpha/rovercode.hex');
  });


  test('handles opening and closing dialog', () => {
    const wrapper = shallow(
      <ConnectionHelp />,
    );

    expect(wrapper.state('open')).toBe(false);

    wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('click');

    expect(wrapper.state('open')).toBe(true);

    wrapper.find('WithStyles(ForwardRef(Dialog))').simulate('close');

    expect(wrapper.state('open')).toBe(false);
  });
});
