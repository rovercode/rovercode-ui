import React from 'react';
import { MemoryRouter } from 'react-router';
import { CircularProgress } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import ProgramCollection from '../ProgramCollection';
import ProgramList from '../ProgramList';

let fetchPrograms;
let removeProgram;
let fetchTags;
let clearProgram;
let clearProgramList;
let fetchUserStats;

describe('The ProgramList component', () => {
  beforeEach(() => {
    fetchPrograms = jest.fn().mockResolvedValue();
    removeProgram = jest.fn().mockResolvedValue();
    fetchTags = jest.fn().mockResolvedValue();
    clearProgram = jest.fn();
    clearProgramList = jest.fn();
    fetchUserStats = jest.fn().mockResolvedValue();
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        owned
      />,
    ).dive().dive();
    wrapper.setState({
      focusProgram: {
        id: 1,
        name: 'Test Program',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('fetches programs and tags on mount', async () => {
    await mountWithIntl(
      <MemoryRouter>
        <ProgramList
          fetchPrograms={fetchPrograms}
          removeProgram={removeProgram}
          fetchTags={fetchTags}
          clearProgram={clearProgram}
          clearProgramList={clearProgramList}
          fetchUserStats={fetchUserStats}
          user={{ user_id: 1, username: 'testuser', tier: 1 }}
          owned
        />
      </MemoryRouter>,
    );
    expect(fetchTags.mock.calls.length).toBe(1);
    expect(fetchPrograms.mock.calls.length).toBe(1);
    expect(clearProgram.mock.calls.length).toBe(1);
  });

  test('shows the correct number of programs for the user', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }, {
        id: 5,
        name: 'Unnamed_Design_2',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'testuser',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        userPrograms={programs}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        owned
      />,
    ).dive().dive();

    expect(wrapper.find(ProgramCollection).exists()).toBe(true);
    expect(wrapper.find(CircularProgress).exists()).toBe(false);
  });

  test('shows loading when programs fetching', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        programs={null}
        owned
      />,
    ).dive().dive();

    expect(wrapper.find(ProgramCollection).exists()).toBe(false);
    expect(wrapper.find(CircularProgress).exists()).toBe(true);
    expect(wrapper.find(CircularProgress).length).toBe(1);
  });

  test('redirects to mission control when program loads', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        owned
      />,
    ).dive().dive();

    wrapper.setState({
      programSelected: 1,
    });

    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).at(0).prop('to')).toEqual({
      pathname: '/mission-control/1',
    });
  });

  test('loads a program', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        owned
      />,
    ).dive().dive();

    wrapper.instance().selectProgram({
      target: {
        parentNode: {
          parentNode: {
            id: undefined,
          },
        },
        id: 33,
        dataset: {
          owned: 'false',
        },
      },
    });
    expect(wrapper.state('programSelected')).toBe(33);

    wrapper.setState({
      programLoaded: false,
    });

    wrapper.instance().selectProgram({
      target: {
        parentNode: {
          parentNode: {
            id: 55,
            dataset: {
              owned: 'true',
            },
          },
        },
      },
    });
    expect(wrapper.state('programSelected')).toBe(55);
  });

  test('fetches user programs after page change', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        owned
      />,
    ).dive().dive();

    wrapper.instance().fetchUserPrograms({
      page: 2,
    }, true);

    expect(fetchPrograms).toHaveBeenCalledWith({
      user: 1,
      page: 2,
    });
  });

  test('fetches community programs after page change', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        owned={false}
      />,
    ).dive().dive();

    wrapper.instance().fetchCommunityPrograms({
      page: 2,
    }, false);

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
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        owned
      />,
    ).dive().dive();

    wrapper.instance().fetchUserPrograms({
      search: 'abc',
      page: 1,
    }, true);

    expect(fetchPrograms).toHaveBeenCalledWith({
      user: 1,
      page: 1,
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
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        owned={false}
      />,
    ).dive().dive();

    wrapper.instance().fetchCommunityPrograms({
      search: 'abc',
      page: 1,
    }, false);

    expect(fetchPrograms).toHaveBeenCalledWith({
      user__not: 1,
      page: 1,
      search: 'abc',
    });
  });

  test('removes a program and reloads the program list', (done) => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        owned
      />,
    ).dive().dive();

    wrapper.setState({
      focusProgram: {
        id: 33,
        name: 'Unnamed_Design_3',
      },
    });
    wrapper.instance().removeProgram().then(() => {
      expect(fetchPrograms).toHaveBeenCalledTimes(2);
      expect(removeProgram).toHaveBeenCalledWith(33);
      done();
    });
  });

  test('shows confirm dialog', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        owned
      />,
    ).dive().dive();

    wrapper.instance().showConfirm({
      target: {
        parentNode: {
          parentNode: {
            id: undefined,
          },
        },
        id: 33,
        name: 'Unnamed_Design_3',
      },
    });

    expect(wrapper.state('confirmOpen')).toBe(true);
  });

  test('cancel dialog does not remove program', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        fetchUserStats={fetchUserStats}
        user={{ user_id: 1, username: 'testuser', tier: 1 }}
        owned
      />,
    ).dive().dive();

    wrapper.instance().cancelRemove();

    expect(fetchPrograms).toHaveBeenCalledTimes(1);
    expect(removeProgram).not.toHaveBeenCalled();
    expect(wrapper.state('confirmOpen')).toBe(false);
  });
});
