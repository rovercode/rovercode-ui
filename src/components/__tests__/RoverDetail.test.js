import React from 'react';
import { MemoryRouter } from 'react-router';
import {
  Accordion,
  Dropdown,
  Form,
  Header,
  Loader,
  Message,
  TextArea,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { mountWithIntl, shallowWithIntl } from 'enzyme-react-intl';
import RoverDetail from '../RoverDetail';

let fetchRover;
let editRover;
let fetchUserList;

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
    fetchUserList = jest.fn(() => Promise.resolve({
      value: [
        {
          username: 'user1',
        },
        {
          username: 'user2',
        },
      ],
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
    const wrapper = shallowWithIntl(
      <RoverDetail
        rover={rover}
        fetchRover={fetchRover}
        editRover={editRover}
        fetchUserList={fetchUserList}
        id={1}
      />,
    ).dive();
    expect(wrapper).toMatchSnapshot();
  });

  test('fetches rover on mount', async () => {
    const wrapper = await mountWithIntl(
      <MemoryRouter>
        <RoverDetail
          fetchRover={fetchRover}
          editRover={editRover}
          fetchUserList={fetchUserList}
          id={1}
        />
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
    const wrapper = shallowWithIntl(
      <RoverDetail
        location={location}
        rover={rover}
        fetchRover={fetchRover}
        editRover={editRover}
        fetchUserList={fetchUserList}
        id={1}
      />,
    ).dive();

    expect(wrapper.find(Message).exists()).toBe(true);
    expect(wrapper.find(Message).children().find(FormattedMessage).prop('defaultMessage'))
      .toBe('Rover \'{name}\' has been created. Click the button below to download the credentials.');
    expect(wrapper.find(Message).children().find(FormattedMessage).prop('values')).toEqual({
      name: 'Sparky',
    });
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
    const wrapper = shallowWithIntl(
      <RoverDetail
        rover={rover}
        fetchRover={fetchRover}
        editRover={editRover}
        fetchUserList={fetchUserList}
        id={1}
      />,
    ).dive();
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
    const wrapper = shallowWithIntl(
      <RoverDetail
        rover={rover}
        fetchRover={fetchRover}
        editRover={editRover}
        fetchUserList={fetchUserList}
        id={1}
      />,
    ).dive();

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
    wrapper.find(Dropdown).simulate('change', {}, {
      value: [
        'user1',
        'user2',
      ],
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
      shared_users: [
        'user1',
        'user2',
      ],
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
    const wrapper = shallowWithIntl(
      <RoverDetail
        rover={rover}
        fetchRover={fetchRover}
        editRover={editRover}
        fetchUserList={fetchUserList}
        id={1}
      />,
    ).dive();

    expect(wrapper.find(Form.Field).first().prop('error')).toBe(false);

    wrapper.find(TextArea).simulate('change', {
      target: {
        value: 'abcd',
      },
    });

    wrapper.update();

    expect(wrapper.find(Form.Field).first().prop('error')).toBe(true);

    await wrapper.instance().saveRover();
    wrapper.update();

    expect(wrapper.state('saveSuccess')).toBe(false);
    expect(wrapper.state('saveError')).toBe(true);
    expect(wrapper.find(Message).exists()).toBe(true);
    expect(wrapper.find(Message).prop('negative')).toBe(true);
  });
});
