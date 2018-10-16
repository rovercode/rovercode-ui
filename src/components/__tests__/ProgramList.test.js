import React from 'react';
import { MemoryRouter } from 'react-router';
import { Header, Loader } from 'semantic-ui-react';
import { shallow, mount } from 'enzyme';
import ProgramList from '../ProgramList';

let fetchPrograms;
let fetchProgram;

describe('The ProgramList component', () => {
  beforeEach(() => {
    fetchPrograms = () => {};
    fetchProgram = () => {};
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallow(
      <ProgramList fetchPrograms={fetchPrograms} fetchProgram={fetchProgram} />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('fetches programs on mount', async () => {
    fetchPrograms = jest.fn();
    await mount(
      <MemoryRouter>
        <ProgramList fetchPrograms={fetchPrograms} fetchProgram={fetchProgram} />
      </MemoryRouter>,
    );
    expect(fetchPrograms.mock.calls.length).toBe(1);
  });

  test('shows the correct number of programs for the user', async () => {
    const programs = [{
      id: 1,
      name: 'Lesson1',
      owner: 1,
    }, {
      id: 2,
      name: 'Lesson2',
      owner: 1,
    }];
    const wrapper = shallow(
      <ProgramList
        programs={programs}
        fetchPrograms={fetchPrograms}
        fetchProgram={fetchProgram}
      />,
    );
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);
  });

  test('shows no programs on error', async () => {
    const programs = [];
    const wrapper = shallow(
      <ProgramList
        programs={programs}
        fetchPrograms={fetchPrograms}
        fetchProgram={fetchProgram}
      />,
    );
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);
  });
});
