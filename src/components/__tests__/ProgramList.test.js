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

describe('The ProgramList component', () => {
  beforeEach(() => {
    fetchProgram = jest.fn(() => Promise.resolve({}));
    fetchPrograms = jest.fn(() => Promise.resolve({}));
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallow(
      <ProgramList
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
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
          user={{ user_id: 1 }}
        />
      </MemoryRouter>,
    );
    expect(fetchPrograms.mock.calls.length).toBe(2);
  });

  test('shows the correct number of programs for the user', async () => {
    const programs = [{
      id: 33,
      name: 'Unnamed_Design_3',
      content: '<xml><variables></variables></xml>',
      user: 10,
    }, {
      id: 5,
      name: 'Unnamed_Design_2',
      content: '<xml><variables></variables></xml>',
      user: 1,
    }];
    const wrapper = shallow(
      <ProgramList
        programs={programs}
        userPrograms={programs}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        user={{ user_id: 1 }}
      />,
    );

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);
    expect(wrapper.find(Card).length).toBe(4);
  });

  test('shows no programs on error', () => {
    const programs = [];
    const wrapper = shallow(
      <ProgramList
        programs={programs}
        userPrograms={programs}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        user={{ user_id: 1 }}
      />,
    );

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);
  });

  test('loads program on click', () => {
    const programs = [{
      id: 33,
      name: 'Unnamed_Design_3',
      content: '<xml><variables></variables></xml>',
      user: 10,
    }];
    const wrapper = shallow(
      <ProgramList
        programs={programs}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        user={{ user_id: 1 }}
      />,
    );

    wrapper.find(Button).simulate('click', {
      target: {
        id: 33,
      },
    });

    expect(fetchProgram).toHaveBeenCalledWith(33);
  });

  test('redirects to mission control when program loads', () => {
    const programs = [];
    const wrapper = shallow(
      <ProgramList
        programs={programs}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        user={{ user_id: 1 }}
      />,
    );

    wrapper.setState({
      programLoaded: true,
    });

    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).at(0).prop('to')).toBe('/mission-control');
  });
});
