import React from 'react';
import { MemoryRouter } from 'react-router';
import { Loader } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import ProgramCollection from '../ProgramCollection';
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
      total_pages: 1,
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

    expect(wrapper.find(ProgramCollection).exists()).toBe(true);
    expect(wrapper.find(ProgramCollection).length).toBe(2);
    expect(wrapper.find(Loader).exists()).toBe(false);
  });

  test('shows loading when programs fetching', () => {
    const wrapper = shallow(
      <ProgramList
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
        programs={null}
      />,
    );

    expect(wrapper.find(ProgramCollection).exists()).toBe(true);
    expect(wrapper.find(ProgramCollection).length).toBe(1);
    expect(wrapper.find(Loader).exists()).toBe(true);
  });

  test('shows loading when user programs fetching', () => {
    const wrapper = shallow(
      <ProgramList
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        user={{ user_id: 1 }}
        userPrograms={null}
      />,
    );

    expect(wrapper.find(ProgramCollection).exists()).toBe(true);
    expect(wrapper.find(ProgramCollection).length).toBe(1);
    expect(wrapper.find(Loader).exists()).toBe(true);
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

  test('loads a program', async () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
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

    await wrapper.instance().loadProgram({
      target: {
        id: 33,
      },
    });

    expect(fetchProgram).toHaveBeenCalledWith(33);
    expect(wrapper.state('programLoaded')).toBe(true);
  });

  test('fetches user programs after page change', async () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
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

    await wrapper.instance().pageChange(2, true);

    expect(fetchPrograms).toHaveBeenCalledWith({
      user: 1,
      page: 2,
    });
  });

  test('fetches other programs after page change', async () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
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

    await wrapper.instance().pageChange(2, false);

    expect(fetchPrograms).toHaveBeenCalledWith({
      user__not: 1,
      page: 2,
    });
  });

  test('fetches programs after search change', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
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

    wrapper.instance().searchChange('abc', true);

    expect(fetchPrograms).toHaveBeenCalledWith({
      user: 1,
      search: 'abc',
    });
  });

  test('fetches other programs after search change', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
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

    wrapper.instance().searchChange('abc', false);

    expect(fetchPrograms).toHaveBeenCalledWith({
      user__not: 1,
      search: 'abc',
    });
  });

  test('removes a program and reloads the program list', async () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
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
