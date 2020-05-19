import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import { FormattedMessage } from 'react-intl';
import ProgramCollection from '../ProgramCollection';

let onProgramClick;
let onRemoveClick;
let onUpdate;
let adminUser;
let testUser;

describe('The ProgramCollection component', () => {
  beforeEach(() => {
    onProgramClick = jest.fn();
    onRemoveClick = jest.fn();
    onUpdate = jest.fn();
    adminUser = { username: 'admin' };
    testUser = { username: 'testuser' };
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
    const wrapper = mountWithIntl(
      <Router>
        <ProgramCollection
          programs={programs}
          label="My Programs"
          user={adminUser}
          onProgramClick={onProgramClick}
          onRemoveClick={onRemoveClick}
          onUpdate={onUpdate}
        />
      </Router>,
    );
    wrapper.find('ProgramCollection').instance().setState({ tagFilters: ['tag1', 'tag2'] });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  test('should set and clear sort menu anchor element when menu is opening and closing', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [],
    };
    const wrapper = shallowWithIntl(
      <ProgramCollection
        programs={programs}
        label="My Programs"
        user={testUser}
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive().dive();

    expect(wrapper.instance().state.sortMenuAnchorElement).toBe(null);
    wrapper.instance().handleSortClick({ currentTarget: 'element' });
    expect(wrapper.instance().state.sortMenuAnchorElement).toBe('element');
    wrapper.instance().handleSortClose();
    expect(wrapper.instance().state.sortMenuAnchorElement).toBe(null);
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
        user={testUser}
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive().dive();

    expect(wrapper.find('WithStyles(ForwardRef(Card))').length).toBe(2);
    expect(wrapper.find('WithStyles(ForwardRef(CardHeader))').first().prop('subheader')
      .props.defaultMessage).toBe('Mine');
    expect(wrapper.find('WithStyles(ForwardRef(Card))').first()
      .find('WithStyles(ForwardRef(Button))').first()
      .find(FormattedMessage)
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
        user={adminUser}
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive().dive();

    expect(wrapper.find('WithStyles(ForwardRef(Card))').length).toBe(2);
    expect(wrapper.find('WithStyles(ForwardRef(CardHeader))').first().prop('subheader'))
      .toBe('testuser');
    expect(wrapper.find('WithStyles(ForwardRef(Card))').first()
      .find('WithStyles(ForwardRef(Button))').first()
      .find(FormattedMessage)
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
        user={adminUser}
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive().dive();

    wrapper.find('WithStyles(ForwardRef(Button))').at(2).simulate('click', {
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
        user={adminUser}
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive().dive();
    wrapper.find('WithStyles(ForwardRef(Button))').last().simulate('click', {
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
        user={adminUser}
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive().dive();

    wrapper.find(Pagination).simulate('change', null, 2);

    expect(onUpdate).toHaveBeenCalledWith({
      page: 2,
      ordering: 'name',
      tag: '',
    });
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
        user={adminUser}
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive().dive();

    wrapper.find('WithStyles(ForwardRef(TextField))').simulate('change', {
      target: {
        value: 'abc',
      },
    });

    expect(onUpdate).toHaveBeenCalledWith({
      search: 'abc',
      page: 1,
      ordering: 'name',
      tag: '',
    });
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
        user={adminUser}
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive().dive();

    wrapper.find('WithStyles(ForwardRef(MenuItem))').simulate('click');

    expect(onUpdate).toHaveBeenCalledWith({
      page: 1,
      ordering: '-name',
      tag: '',
    });

    wrapper.find('WithStyles(ForwardRef(MenuItem))').simulate('click');

    expect(onUpdate).toHaveBeenCalledWith({
      page: 1,
      ordering: 'name',
      tag: '',
    });

    const unexpectedSortingField = wrapper.instance().toggleOrdering('field_name');
    expect(unexpectedSortingField).toBe('field_name');
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
        user={adminUser}
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onUpdate={onUpdate}
      />,
    ).dive().dive();

    wrapper.find('WithStyles(WithStyles(ForwardRef(Autocomplete)))').simulate('change', {}, ['tag1', 'tag2']);
    wrapper.update();

    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Autocomplete)))').props().value).toStrictEqual(['tag1', 'tag2']);
    expect(onUpdate).toHaveBeenCalledWith({
      page: 1,
      ordering: 'name',
      tag: 'tag1,tag2',
    });
  });
});
