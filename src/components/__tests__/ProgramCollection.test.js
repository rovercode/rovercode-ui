import React from 'react';
import {
  Button,
  Card,
  Dropdown,
  Header,
  Input,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { shallowWithIntl } from 'enzyme-react-intl';
import CustomPagination from '../CustomPagination';
import ProgramCollection from '../ProgramCollection';

let onProgramClick;
let onRemoveClick;
let onUpdate;

describe('The ProgramCollection component', () => {
  beforeEach(() => {
    onProgramClick = jest.fn();
    onRemoveClick = jest.fn();
    onUpdate = jest.fn();
  });

  test('renders on the page with no errors', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 2,
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
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive();
    expect(wrapper).toMatchSnapshot();
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
          username: 'testuser',
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
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive();

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Card).length).toBe(2);
    expect(wrapper.find(Card.Meta).first().children().find(FormattedMessage)
      .prop('defaultMessage')).toBe('Mine');
    expect(wrapper.find(Button).first().children().find(FormattedMessage)
      .prop('defaultMessage')).toBe('Keep Working');
  });

  test('shows the correct number of programs for other users', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'testuser',
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
      <ProgramCollection
        programs={programs}
        label="My Programs"
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive();

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Card).length).toBe(2);
    expect(wrapper.find(Card.Meta).first().prop('children')).toBe('testuser');
    expect(wrapper.find(Button).first().children().find(FormattedMessage)
      .prop('defaultMessage')).toBe('View');
  });

  test('callback when program click', () => {
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
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive();

    wrapper.find(Button).first().simulate('click', {
      target: {
        id: 33,
      },
    });

    expect(onProgramClick).toHaveBeenCalledWith({
      target: {
        id: 33,
      },
    });
  });

  test('callback when remove click', () => {
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
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive();

    wrapper.find(Button).last().simulate('click', {
      target: {
        id: 33,
      },
    });

    expect(onRemoveClick).toHaveBeenCalledWith({
      target: {
        id: 33,
      },
    });
  });

  test('callback when page changes', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 2,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'testuser',
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
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive();

    wrapper.find(CustomPagination).simulate('pageChange', null, {
      activePage: 2,
    });

    expect(onUpdate).toHaveBeenCalledWith({
      page: 2,
      ordering: 'name',
      tag: '',
    }, true);
  });

  test('callback when search changes', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 2,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'testuser',
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
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive();

    wrapper.find(Input).simulate('change', {
      target: {
        value: 'abc',
      },
    });

    expect(onUpdate).toHaveBeenCalledWith({
      search: 'abc',
      page: 1,
      ordering: 'name',
      tag: '',
    }, true);
  });

  test('callback when order changes', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 2,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'testuser',
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
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive();

    wrapper.find({ name: 'name' }).simulate('click', null, {
      name: 'name',
    });

    expect(onUpdate).toHaveBeenCalledWith({
      page: 1,
      ordering: '-name',
      tag: '',
    }, true);

    wrapper.find({ name: 'name' }).simulate('click', null, {
      name: 'name',
    });

    expect(onUpdate).toHaveBeenCalledWith({
      page: 1,
      ordering: 'name',
      tag: '',
    }, true);

    wrapper.instance().handleOrderingChange(null, {
      name: 'field_name',
    });

    expect(onUpdate).toHaveBeenCalledWith({
      page: 1,
      ordering: 'field_name',
      tag: '',
    }, true);
  });

  test('callback when tag changes', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 2,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'testuser',
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

    const tag = {
      tags: [{
        name: 'tag1',
      }],
    };

    const wrapper = shallowWithIntl(
      <ProgramCollection
        programs={programs}
        tag={tag}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive();

    wrapper.find(Dropdown).last().simulate('change', {}, {
      value: [
        'tag1',
        'tag2',
      ],
    });

    expect(onUpdate).toHaveBeenCalledWith({
      page: 1,
      ordering: 'name',
      tag: 'tag1,tag2',
    }, true);
  });
});
