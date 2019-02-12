import React from 'react';
import { MemoryRouter } from 'react-router';
import {
  Button, Card, Header, Icon, Loader,
} from 'semantic-ui-react';
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
      connected: true,
    }, {
      id: 2,
      name: 'Marvin',
      owner: 1,
      connected: false,
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

    expect(wrapper.find(Card).length).toBe(2);
    expect(wrapper.find(Card).first().find(Button).prop('to')).toBe('/rovers/1');
    expect(wrapper.find(Card).first().find(Icon).prop('color')).toBe('green');
    expect(wrapper.find(Card.Header).first().prop('children')).toBe('Sparky');
    expect(wrapper.find(Card.Meta).first().prop('children')).toBe('Connected');

    expect(wrapper.find(Card).last().find(Button).prop('to')).toBe('/rovers/2');
    expect(wrapper.find(Card).last().find(Icon).prop('color')).toBe('red');
    expect(wrapper.find(Card.Header).last().prop('children')).toBe('Marvin');
    expect(wrapper.find(Card.Meta).last().prop('children')).toBe('Not connected');
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
