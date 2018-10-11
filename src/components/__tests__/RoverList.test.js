import React from 'react';
import { MemoryRouter } from 'react-router';
import { Header, Loader } from 'semantic-ui-react';
import { shallow, mount } from 'enzyme';
import RoverList from '../RoverList';

let fetchRovers;

describe('The RoverList component', () => {
  beforeEach(() => {
    fetchRovers = () => {};
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallow(<RoverList fetchRovers={fetchRovers} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('fetches rovers on mount', async () => {
    fetchRovers = jest.fn();
    await mount(
      <MemoryRouter>
        <RoverList fetchRovers={fetchRovers} />
      </MemoryRouter>,
    );
    expect(fetchRovers.mock.calls.length).toBe(1);
  });

  test('shows the correct number of rovers for the user', async () => {
    const rovers = [{
      id: 1,
      name: 'Sparky',
      owner: 1,
    }, {
      id: 2,
      name: 'Marvin',
      owner: 1,
    }];
    const wrapper = shallow(
      <RoverList
        rovers={rovers}
        fetchRovers={fetchRovers}
      />,
    );
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);
  });

  test('shows no rovers on error', async () => {
    const rovers = [];
    const wrapper = shallow(
      <RoverList
        rovers={rovers}
        fetchRovers={fetchRovers}
      />,
    );
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);
  });
});
