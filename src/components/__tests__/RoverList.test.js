import React from 'react';
import { MemoryRouter, Redirect } from 'react-router';
import {
  Button,
  Card,
  Form,
  Header,
  Loader,
} from 'semantic-ui-react';
import { mountWithIntl, shallowWithIntl } from 'enzyme-react-intl';
import CustomPagination from '../CustomPagination';
import RoverList from '../RoverList';

let createRover;
let fetchRovers;
let removeRover;

describe('The RoverList component', () => {
  beforeEach(() => {
    createRover = jest.fn(() => Promise.resolve({
      value: {
        id: 1,
      },
    }));
    fetchRovers = jest.fn(() => Promise.resolve({}));
    removeRover = jest.fn(() => Promise.resolve({}));
  });

  test('renders on the page with no errors', () => {
    const rovers = {
      next: null,
      previous: null,
      total_pages: 2,
      results: [{
        id: 1,
        name: 'Sparky',
        client_id: '1234',
      }, {
        id: 2,
        name: 'Marvin',
        client_id: '5678',
      }],
    };
    const wrapper = shallowWithIntl(
      <RoverList
        rovers={rovers}
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    ).dive();
    expect(wrapper).toMatchSnapshot();
  });

  test('fetches rovers on mount', async () => {
    const rovers = {
      next: null,
      previous: null,
      total_pages: 2,
      results: [{
        id: 1,
        name: 'Sparky',
        client_id: '1234',
      }, {
        id: 2,
        name: 'Marvin',
        client_id: '5678',
      }],
    };
    fetchRovers = jest.fn();
    await mountWithIntl(
      <MemoryRouter>
        <RoverList
          rovers={rovers}
          createRover={createRover}
          fetchRovers={fetchRovers}
          removeRover={removeRover}
        />
      </MemoryRouter>,
    );
    expect(fetchRovers.mock.calls.length).toBe(1);
  });

  test('shows the correct number of rovers for the user', async () => {
    const rovers = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 1,
        name: 'Sparky',
        client_id: '1234',
      }, {
        id: 2,
        name: 'Marvin',
        client_id: '5678',
      }],
    };
    const wrapper = shallowWithIntl(
      <RoverList
        rovers={rovers}
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    ).dive();
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);

    expect(wrapper.find(Card).length).toBe(2);
    expect(wrapper.find(Card).first().find(Button).first()
      .prop('to')).toBe('/rovers/1');
    expect(wrapper.find(Card.Header).first().prop('children')).toBe('Sparky');

    expect(wrapper.find(Card).last().find(Button).first()
      .prop('to')).toBe('/rovers/2');
    expect(wrapper.find(Card.Header).last().prop('children')).toBe('Marvin');
  });

  test('shows no rovers on error', async () => {
    const rovers = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [],
    };
    const wrapper = shallowWithIntl(
      <RoverList
        rovers={rovers}
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    ).dive();
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);
  });

  test('shows loader when fetching', () => {
    const wrapper = shallowWithIntl(
      <RoverList
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
        isFetching
      />,
    ).dive();

    expect(wrapper.find(Header).exists()).toBe(false);
    expect(wrapper.find(Loader).exists()).toBe(true);
  });

  test('creates a rover and goes to new rover detail', async () => {
    const rovers = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 1,
        name: 'Sparky',
        client_id: '1234',
      }, {
        id: 2,
        name: 'Marvin',
        client_id: '5678',
      }],
    };
    const wrapper = shallowWithIntl(
      <RoverList
        rovers={rovers}
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    ).dive();

    wrapper.setState({
      newRoverName: 'Rovey',
    });
    await wrapper.instance().createRover();
    wrapper.update();

    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).prop('to')).toEqual({
      pathname: '/rovers/1',
      state: {
        created: true,
      },
    });
    expect(fetchRovers).toHaveBeenCalledTimes(1);
    expect(createRover).toHaveBeenCalledWith({
      name: 'Rovey',
    });
  });

  test('removes a rover and reloads the rover list', async () => {
    const rovers = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 1,
        name: 'Sparky',
        client_id: '1234',
      }, {
        id: 2,
        name: 'Marvin',
        client_id: '5678',
      }],
    };
    const wrapper = shallowWithIntl(
      <RoverList
        rovers={rovers}
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    ).dive();

    wrapper.setState({
      focusRover: {
        id: 1,
        name: 'Sparky',
      },
    });
    await wrapper.instance().removeRover();

    expect(fetchRovers).toHaveBeenCalledTimes(2);
    expect(removeRover).toHaveBeenCalledWith(1);
  });

  test('shows confirm dialog', () => {
    const wrapper = shallowWithIntl(
      <RoverList
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    ).dive();

    wrapper.instance().showConfirm({
      target: {
        parentNode: {
          id: undefined,
          name: undefined,
        },
        id: 1,
        name: 'Sparky',
      },
    });

    expect(wrapper.state('confirmOpen')).toBe(true);
  });

  test('cancel dialog does not remove rover', () => {
    const wrapper = shallowWithIntl(
      <RoverList
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    ).dive();

    wrapper.instance().cancelRemove();

    expect(fetchRovers).toHaveBeenCalledTimes(1);
    expect(removeRover).not.toHaveBeenCalled();
    expect(wrapper.state('confirmOpen')).toBe(false);
  });

  test('shows new rover dialog', () => {
    const wrapper = shallowWithIntl(
      <RoverList
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    ).dive();

    wrapper.instance().handleNewRoverOpen();

    expect(wrapper.state('newRoverOpen')).toBe(true);

    wrapper.find(Form.Input).simulate('change', {
      target: {
        value: 'Sparky',
      },
    });

    expect(wrapper.state('newRoverName')).toBe('Sparky');
  });

  test('cancel dialog does not create rover', () => {
    const wrapper = shallowWithIntl(
      <RoverList
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    ).dive();

    wrapper.instance().handleNewRoverClose();

    expect(fetchRovers).toHaveBeenCalledTimes(1);
    expect(removeRover).not.toHaveBeenCalled();
    expect(wrapper.state('newRoverOpen')).toBe(false);
  });

  test('change page on click', () => {
    const rovers = {
      next: null,
      previous: null,
      total_pages: 2,
      results: [{
        id: 1,
        name: 'Sparky',
        client_id: '1234',
      }, {
        id: 2,
        name: 'Marvin',
        client_id: '5678',
      }],
    };
    const wrapper = shallowWithIntl(
      <RoverList
        rovers={rovers}
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    ).dive();

    wrapper.find(CustomPagination).simulate('pageChange', null, {
      activePage: 2,
    });

    expect(fetchRovers).toHaveBeenCalledWith(2);
  });

  test('no pagination for single page', () => {
    const rovers = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 1,
        name: 'Sparky',
        client_id: '1234',
      }, {
        id: 2,
        name: 'Marvin',
        client_id: '5678',
      }],
    };
    const wrapper = shallowWithIntl(
      <RoverList
        rovers={rovers}
        createRover={createRover}
        fetchRovers={fetchRovers}
        removeRover={removeRover}
      />,
    ).dive();

    expect(wrapper.find(CustomPagination).exists()).toBe(false);
  });
});
