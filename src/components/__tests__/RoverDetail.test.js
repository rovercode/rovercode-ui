import React from 'react';
import { MemoryRouter } from 'react-router';
import {
  Accordion,
  Form,
  Header,
  Loader,
  Message,
  TextArea,
} from 'semantic-ui-react';
import { shallow, mount } from 'enzyme';
import RoverDetail from '../RoverDetail';

let fetchRover;
let editRover;

describe('The RoverDetail component', () => {
  beforeEach(() => {
    fetchRover = jest.fn(() => Promise.resolve({
      value: {
        name: 'Rover',
        config: {},
      },
    }));
    editRover = jest.fn(() => Promise.resolve({
      value: {
        name: 'Rover',
        config: {},
      },
    }));
  });

  test('renders on the page with no errors', () => {
    const rover = {
      id: 1,
      name: 'Sparky',
      config: {
        left_eye_port: 1,
        right_eye_port: 2,
      },
      client_id: '1234',
      client_secret: '5678',
    };
    const wrapper = shallow(
      <RoverDetail
        rover={rover}
        fetchRover={fetchRover}
        editRover={editRover}
        id={1}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('fetches rover on mount', async () => {
    const wrapper = await mount(
      <MemoryRouter>
        <RoverDetail fetchRover={fetchRover} editRover={editRover} id={1} />
      </MemoryRouter>,
    );
    expect(fetchRover).toBeCalledWith(1);
    expect(wrapper.find(Loader).exists()).toBe(true);
  });

  test('displays created message', () => {
    const rover = {
      id: 1,
      name: 'Sparky',
      config: {
        left_eye_port: 1,
        right_eye_port: 2,
      },
      client_id: '1234',
      client_secret: '5678',
    };
    const location = {
      state: {
        created: true,
      },
    };
    const wrapper = shallow(
      <RoverDetail
        location={location}
        rover={rover}
        fetchRover={fetchRover}
        editRover={editRover}
        id={1}
      />,
    );

    expect(wrapper.find(Message).exists()).toBe(true);
    expect(wrapper.find(Message).prop('children')[1])
      .toBe('Rover \'Sparky\' has been created. Click the button below to download the credentials.');
  });

  test('shows the correct information the rover', async () => {
    const rover = {
      id: 1,
      name: 'Sparky',
      config: {
        left_eye_port: 1,
        right_eye_port: 2,
      },
      client_id: '1234',
      client_secret: '5678',
    };
    const wrapper = shallow(
      <RoverDetail
        rover={rover}
        fetchRover={fetchRover}
        editRover={editRover}
        id={1}
      />,
    );
    await wrapper.instance().componentDidMount();
    wrapper.update();

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Loader).exists()).toBe(false);

    expect(wrapper.find(Form.Input).prop('defaultValue')).toBe('Sparky');
    expect(wrapper.find(TextArea).prop('defaultValue')).toEqual(JSON.stringify({
      left_eye_port: 1,
      right_eye_port: 2,
    }));
  });

  test('saves rover settings', async () => {
    const rover = {
      id: 1,
      name: 'Sparky',
      config: {
        left_eye_port: 1,
        right_eye_port: 2,
      },
      client_id: '1234',
      client_secret: '5678',
    };
    const wrapper = shallow(
      <RoverDetail
        rover={rover}
        fetchRover={fetchRover}
        editRover={editRover}
        id={1}
      />,
    );

    wrapper.find(Form.Input).simulate('change', {
      target: {
        value: 'Marvin',
      },
    });
    wrapper.find(Accordion.Title).simulate('click');
    wrapper.find(TextArea).simulate('change', {
      target: {
        value: JSON.stringify({
          left_eye_port: 3,
          right_eye_port: 4,
        }),
      },
    });
    wrapper.update();
    await wrapper.instance().saveRover();

    expect(wrapper.state('accordionActive')).toBe(true);
    expect(wrapper.state('saveSuccess')).toBe(true);
    expect(wrapper.state('saveError')).toBe(false);
    expect(wrapper.find(Message).exists()).toBe(true);
    expect(wrapper.find(Message).prop('positive')).toBe(true);
    expect(fetchRover).toHaveBeenCalledWith(1);
    expect(editRover).toHaveBeenCalledWith(1, {
      name: 'Marvin',
      config: {
        left_eye_port: 3,
        right_eye_port: 4,
      },
    });
  });

  test('handles invalid configuration', async () => {
    const rover = {
      id: 1,
      name: 'Sparky',
      config: {
        left_eye_port: 1,
        right_eye_port: 2,
      },
      client_id: '1234',
      client_secret: '5678',
    };
    const wrapper = shallow(
      <RoverDetail
        rover={rover}
        fetchRover={fetchRover}
        editRover={editRover}
        id={1}
      />,
    );

    expect(wrapper.find(Form.Field).prop('error')).toBe(false);

    wrapper.find(TextArea).simulate('change', {
      target: {
        value: 'abcd',
      },
    });

    wrapper.update();

    expect(wrapper.find(Form.Field).prop('error')).toBe(true);

    await wrapper.instance().saveRover();
    wrapper.update();

    expect(wrapper.state('saveSuccess')).toBe(false);
    expect(wrapper.state('saveError')).toBe(true);
    expect(wrapper.find(Message).exists()).toBe(true);
    expect(wrapper.find(Message).prop('negative')).toBe(true);
  });
});
