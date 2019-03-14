import React from 'react';
import { MemoryRouter } from 'react-router';
import { Card, Loader } from 'semantic-ui-react';
import { shallow, mount } from 'enzyme';
import RoverConnection from '../RoverConnection';
import RoverConnectionList from '../RoverConnectionList';

let changeActiveRover;
let changeLeftSensorState;
let changeRightSensorState;
let fetchRovers;

describe('The RoverList component', () => {
  beforeEach(() => {
    changeActiveRover = jest.fn();
    changeLeftSensorState = jest.fn();
    changeRightSensorState = jest.fn();
    fetchRovers = jest.fn(() => Promise.resolve({}));
  });

  test('renders on the page with no errors', () => {
    const rovers = [{
      id: 1,
      name: 'Sparky',
      client_id: '1234',
    }, {
      id: 2,
      name: 'Marvin',
      client_id: '5678',
    }];
    const wrapper = shallow(
      <RoverConnectionList
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        fetchRovers={fetchRovers}
        rovers={rovers}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('fetches rovers on mount', async () => {
    await mount(
      <MemoryRouter>
        <RoverConnectionList
          changeActiveRover={changeActiveRover}
          changeLeftSensorState={changeLeftSensorState}
          changeRightSensorState={changeRightSensorState}
          fetchRovers={fetchRovers}
        />
      </MemoryRouter>,
    );
    expect(fetchRovers.mock.calls.length).toBe(1);
  });

  test('shows loading during rover fetch', () => {
    const wrapper = shallow(
      <RoverConnectionList
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        fetchRovers={fetchRovers}
      />,
    );
    expect(wrapper.find(Card).exists()).toBe(false);
    expect(wrapper.find(Loader).exists()).toBe(true);
  });

  test('shows the correct rovers for the user', async () => {
    const rovers = [{
      id: 1,
      name: 'Sparky',
      client_id: '1234',
    }, {
      id: 2,
      name: 'Marvin',
      client_id: '5678',
    }];
    const wrapper = shallow(
      <RoverConnectionList
        activeRover="5678"
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        fetchRovers={fetchRovers}
        rovers={rovers}
      />,
    );
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.find(Loader).exists()).toBe(false);
    expect(wrapper.find(RoverConnection).length).toBe(2);
    expect(wrapper.find(RoverConnection).first().prop('name')).toBe('Marvin');
    expect(wrapper.find(RoverConnection).last().prop('name')).toBe('Sparky');
  });
});
