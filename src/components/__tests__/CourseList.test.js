import React from 'react';
import { MemoryRouter } from 'react-router';
import { Card, CircularProgress } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import Course from '../Course';
import CourseList from '../CourseList';


describe('The CourseList component', () => {
  const fetchCourses = jest.fn().mockResolvedValue();
  const courses = {
    count: 2,
    next: null,
    previous: null,
    total_pages: 2,
    results: [{
      id: 1,
      name: 'Test',
      description: 'This is a test',
      lessons: [{
        id: 1,
        reference: 'Lesson1',
        description: 'The first lesson',
        sequence_number: 1,
        active_bd: 1,
        active_bd_owned: false,
        state: {
          progress: 'IN_PROGRESS',
        },
      }, {
        id: 2,
        reference: 'Lesson2',
        description: 'The second lesson',
        sequence_number: 1,
        active_bd: 2,
        active_bd_owned: true,
        state: {
          progress: 'AVAILABLE',
        },
      }],
    }],
  };
  const user = {
    tier: 1,
  };

  beforeEach(() => {
    fetchCourses.mockReset();
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallowWithIntl(
      <CourseList
        courses={courses}
        user={user}
        fetchCourses={fetchCourses}
      />,
    ).dive().dive().dive();
    expect(wrapper).toMatchSnapshot();
  });

  test('fetches courses on mount', async () => {
    await mountWithIntl(
      <MemoryRouter>
        <CourseList
          fetchCourses={fetchCourses}
          user={user}
        />
      </MemoryRouter>,
    );
    expect(fetchCourses.mock.calls.length).toBe(1);
  });

  test('shows the correct number of courses for the user', () => {
    const wrapper = shallowWithIntl(
      <CourseList
        courses={courses}
        user={user}
        fetchCourses={fetchCourses}
      />,
    ).dive().dive().dive();

    expect(wrapper.find(Course).exists()).toBe(true);
    expect(wrapper.find(CircularProgress).exists()).toBe(false);
  });

  test('shows loading when courses fetching', () => {
    const wrapper = shallowWithIntl(
      <CourseList
        fetchCourses={fetchCourses}
        user={user}
        courses={null}
      />,
    ).dive().dive().dive();

    expect(wrapper.find(Course).exists()).toBe(false);
    expect(wrapper.find(CircularProgress).exists()).toBe(true);
    expect(wrapper.find(CircularProgress).length).toBe(1);
  });

  test('shows message when no results', () => {
    const empty = {
      count: 0,
      next: null,
      previous: null,
      total_pages: 1,
      results: [],
    };
    const wrapper = shallowWithIntl(
      <CourseList
        fetchCourses={fetchCourses}
        user={user}
        courses={empty}
      />,
    ).dive().dive().dive();

    expect(wrapper.find(Card).exists()).toBe(false);
    expect(wrapper.find('WithStyles(ForwardRef(Typography))').children().prop('defaultMessage')).toBe('Sorry, no courses match your filters.');
  });

  test('fetches courses after page change', () => {
    const wrapper = shallowWithIntl(
      <CourseList
        courses={courses}
        user={user}
        fetchCourses={fetchCourses}
      />,
    ).dive().dive().dive();

    wrapper.instance().handlePageChange(null, 2);

    expect(fetchCourses).toHaveBeenCalledWith({
      ordering: 'name',
      page: 2,
    });
  });

  test('fetches courses after search change', () => {
    const wrapper = shallowWithIntl(
      <CourseList
        courses={courses}
        user={user}
        fetchCourses={fetchCourses}
      />,
    ).dive().dive().dive();

    wrapper.instance().handleSearchChange({
      target: {
        value: 'abc',
      },
      page: 1,
    });

    expect(fetchCourses).toHaveBeenCalledWith({
      ordering: 'name',
      page: 1,
      search: 'abc',
    });
  });

  test('fetches courses after ordering change', () => {
    const wrapper = shallowWithIntl(
      <CourseList
        courses={courses}
        user={user}
        fetchCourses={fetchCourses}
      />,
    ).dive().dive().dive();

    wrapper.instance().handleOrderingChange({
      target: {
        id: 'name',
      },
    });

    expect(fetchCourses).toHaveBeenCalledWith({
      ordering: '-name',
      page: 1,
    });

    wrapper.instance().handleOrderingChange({
      target: {
        id: 'name',
      },
    });

    expect(fetchCourses).toHaveBeenCalledWith({
      ordering: 'name',
      page: 1,
    });

    wrapper.instance().handleOrderingChange({
      target: {
        id: 'completion',
      },
    });

    expect(fetchCourses).toHaveBeenCalledWith({
      ordering: 'completion',
      page: 1,
    });
  });

  test('anchors the menu', () => {
    const wrapper = shallowWithIntl(
      <CourseList
        courses={courses}
        user={user}
        fetchCourses={fetchCourses}
      />,
    ).dive().dive().dive();

    wrapper.instance().handleSortClick({ currentTarget: 'element' });

    expect(wrapper.state('sortMenuAnchorElement')).toBe('element');

    wrapper.instance().handleSortClose();

    expect(wrapper.state('sortMenuAnchorElement')).toBeNull();
  });

  test('redirects to mission control when program loads', () => {
    const wrapper = shallowWithIntl(
      <CourseList
        courses={courses}
        user={user}
        fetchCourses={fetchCourses}
      />,
    ).dive().dive().dive();

    wrapper.setState({
      programSelected: 1,
    });

    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).at(0).prop('to')).toEqual({
      pathname: '/mission-control/1',
    });
  });

  test('selects a program', (done) => {
    const wrapper = shallowWithIntl(
      <CourseList
        courses={courses}
        user={user}
        fetchCourses={fetchCourses}
      />,
    ).dive().dive().dive();

    wrapper.instance().selectProgram({
      target: {
        parentNode: {
          parentNode: {
            parentNode: {
              id: undefined,
              parentNode: {
                parentNode: {
                  id: 33,
                  dataset: {
                    owned: 'false',
                  },
                },
              },
            },
          },
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
            parentNode: {
              id: 55,
              dataset: {
                owned: 'true',
              },
            },
          },
        },
      },
    });
    expect(wrapper.state('programSelected')).toBe(55);

    wrapper.setState({
      programLoaded: false,
    });

    wrapper.instance().selectProgram({
      target: {
        parentNode: {
          id: 77,
          dataset: {
            owned: 'false',
          },
          parentNode: {
            parentNode: {
              parentNode: {
                parentNode: {
                },
              },
            },
          },
        },
      },
    });
    expect(wrapper.state('programSelected')).toBe(77);
    done();
  });
});
