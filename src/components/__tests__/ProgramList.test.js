import React from 'react';
import { MemoryRouter } from 'react-router';
import {
  Button, Card, Header, Loader,
} from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import ProgramList from '../ProgramList';

let fetchProgram;
let fetchPrograms;
let removeProgram;

describe('The ProgramList component', () => {
  beforeEach(() => {
    fetchProgram = jest.fn(() => Promise.resolve({}));
    fetchPrograms = jest.fn(() => Promise.resolve({}));
    removeProgram = jest.fn(() => Promise.resolve({}));
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallow(
      <ProgramList
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('fetches programs on mount', async () => {
    await mount(
      <MemoryRouter>
        <ProgramList
          fetchProgram={fetchProgram}
          fetchPrograms={fetchPrograms}
          removeProgram={removeProgram}
          user={{ user_id: 1 }}
        />
      </MemoryRouter>,
    );
    expect(fetchPrograms.mock.calls.length).toBe(2);
  });

  test('shows the correct number of programs for the user', async () => {
    const programs = {
      next: null,
      previous: null,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: 10,
      }, {
        id: 5,
        name: 'Unnamed_Design_2',
        content: '<xml><variables></variables></xml>',
        user: 1,
      }],
    };
    const wrapper = shallow(
      <ProgramList
        programs={programs}
        userPrograms={programs}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
      />,
    );

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);
    expect(wrapper.find(Card).length).toBe(4);
  });

  test('shows no programs on error', () => {
    const wrapper = shallow(
      <ProgramList
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
      />,
    );

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);
  });

  test('shows loading when programs fetching', () => {
    const wrapper = shallow(
      <ProgramList
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
        programsIsFetching
      />,
    );

    expect(wrapper.find(Header).length).toBe(1);
    expect(wrapper.find(Header).prop('children')).toBe('My Programs');
    expect(wrapper.find(Loader).exists()).toBe(true);
  });

  test('shows loading when user programs fetching', () => {
    const wrapper = shallow(
      <ProgramList
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
        userProgramsIsFetching
      />,
    );

    expect(wrapper.find(Header).length).toBe(1);
    expect(wrapper.find(Header).prop('children')).toBe('Find More');
    expect(wrapper.find(Loader).exists()).toBe(true);
  });

  test('loads program on click', () => {
    const programs = {
      next: null,
      previous: null,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: 10,
      }],
    };
    const wrapper = shallow(
      <ProgramList
        programs={programs}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
      />,
    );

    wrapper.find(Button).last().simulate('click', {
      target: {
        id: 33,
      },
    });

    expect(fetchProgram).toHaveBeenCalledWith(33);
  });

  test('redirects to mission control when program loads', () => {
    const wrapper = shallow(
      <ProgramList
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
      />,
    );

    wrapper.setState({
      programLoaded: true,
    });

    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).at(0).prop('to')).toBe('/mission-control');
  });

  test('removes a program and reloads the program list', async () => {
    const programs = {
      next: null,
      previous: null,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: 10,
      }],
    };
    const wrapper = shallow(
      <ProgramList
        programs={programs}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
      />,
    );

    wrapper.setState({
      focusProgram: {
        id: 33,
        name: 'Unnamed_Design_3',
      },
    });
    await wrapper.instance().removeProgram();

    expect(fetchPrograms).toHaveBeenCalledTimes(4);
    expect(removeProgram).toHaveBeenCalledWith(33);
  });

  test('shows confirm dialog', () => {
    const wrapper = shallow(
      <ProgramList
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
      />,
    );

    wrapper.instance().showConfirm({
      target: {
        id: 33,
        name: 'Unnamed_Design_3',
      },
    });

    expect(wrapper.state('confirmOpen')).toBe(true);
  });

  test('cancel dialog does not remove program', () => {
    const wrapper = shallow(
      <ProgramList
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
      />,
    );

    wrapper.instance().cancelRemove();

    expect(fetchPrograms).toHaveBeenCalledTimes(1);
    expect(removeProgram).not.toHaveBeenCalled();
    expect(wrapper.state('confirmOpen')).toBe(false);
  });
});
