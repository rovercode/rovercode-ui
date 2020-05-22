import React from 'react';
import { MemoryRouter } from 'react-router';
import { CircularProgress } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import ProgramCollection from '../ProgramCollection';
import ProgramList from '../ProgramList';

let changeReadOnly;
let fetchProgram;
let fetchPrograms;
let removeProgram;
let fetchTags;
let clearProgram;
let clearProgramList;

describe('The ProgramList component', () => {
  beforeEach(() => {
    changeReadOnly = jest.fn();
    fetchProgram = jest.fn().mockResolvedValue();
    fetchPrograms = jest.fn().mockResolvedValue();
    removeProgram = jest.fn().mockResolvedValue();
    fetchTags = jest.fn().mockResolvedValue();
    clearProgram = jest.fn();
    clearProgramList = jest.fn();
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
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
          changeReadOnly={changeReadOnly}
          fetchProgram={fetchProgram}
          fetchPrograms={fetchPrograms}
          removeProgram={removeProgram}
          fetchTags={fetchTags}
          clearProgram={clearProgram}
          clearProgramList={clearProgramList}
          user={{ user_id: 1, username: 'testuser' }}
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
        changeReadOnly={changeReadOnly}
        userPrograms={programs}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
        owned
      />,
    ).dive().dive();

    expect(wrapper.find(ProgramCollection).exists()).toBe(true);
    expect(wrapper.find(CircularProgress).exists()).toBe(false);
  });

  test('shows loading when programs fetching', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
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
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
        owned
      />,
    ).dive().dive();

    wrapper.setState({
      programLoaded: true,
    });

    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).at(0).prop('to')).toEqual({
      pathname: '/mission-control',
    });
  });

  test('loads a program', (done) => {
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
        changeReadOnly={changeReadOnly}
        programs={programs}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
        owned
      />,
    ).dive().dive();

    wrapper.instance().loadProgram({
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
    }).then(() => {
      expect(changeReadOnly).toHaveBeenCalledWith(true);
      expect(fetchProgram).toHaveBeenCalledWith(33);
      expect(wrapper.state('programLoaded')).toBe(true);

      wrapper.setState({
        programLoaded: false,
      });

      wrapper.instance().loadProgram({
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
      }).then(() => {
        expect(changeReadOnly).toHaveBeenCalledWith(false);
        expect(fetchProgram).toHaveBeenCalledWith(33);
        expect(wrapper.state('programLoaded')).toBe(true);
        done();
      });
    });
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
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
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
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
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
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
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
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
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
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
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
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
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
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        clearProgramList={clearProgramList}
        user={{ user_id: 1, username: 'testuser' }}
        owned
      />,
    ).dive().dive();

    wrapper.instance().cancelRemove();

    expect(fetchPrograms).toHaveBeenCalledTimes(1);
    expect(removeProgram).not.toHaveBeenCalled();
    expect(wrapper.state('confirmOpen')).toBe(false);
  });
});
