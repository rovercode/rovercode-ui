import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Card } from '@material-ui/core';
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
    adminUser = {
      username: 'admin',
      tier: 2,
      stats: {
        block_diagram: {
          count: 15,
          limit: 5,
        },
      },
    };
    testUser = {
      username: 'testuser',
      tier: 1,
      stats: {
        block_diagram: {
          count: 5,
          limit: 5,
        },
      },
    };
  });

  test('renders on the page with no errors as free tier over', () => {
    const programs = {
      count: 2,
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
          user={testUser}
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

  test('renders on the page with no errors as free tier under', () => {
    testUser.stats.block_diagram.count = 2;
    const programs = {
      count: 2,
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
          user={testUser}
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

  test('renders on the page with no errors as paid tier', () => {
    testUser.stats.block_diagram.count = 2;
    const programs = {
      count: 2,
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
      count: 0,
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
    ).dive().dive().dive();

    expect(wrapper.instance().state.sortMenuAnchorElement).toBe(null);
    wrapper.instance().handleSortClick({ currentTarget: 'element' });
    expect(wrapper.instance().state.sortMenuAnchorElement).toBe('element');
    wrapper.instance().handleSortClose();
    expect(wrapper.instance().state.sortMenuAnchorElement).toBe(null);
  });

  test('shows message when no results', () => {
    const programs = {
      count: 0,
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
    ).dive().dive().dive();

    wrapper.setState({
      searchQuery: 'test',
    });

    expect(wrapper.find(Card).exists()).toBe(false);
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.find('WithStyles(ForwardRef(Typography))').children().last().prop('defaultMessage')).toBe('Sorry, no programs match your filters.');
  });

  test('shows message when no programs', () => {
    const programs = {
      count: 0,
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
    ).dive().dive().dive();

    expect(wrapper.find(Card).exists()).toBe(false);
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('WithStyles(ForwardRef(Typography))').children().last().prop('defaultMessage')).toBe('You don\'t have any programs yet!');
  });

  test('shows the correct number of programs for the user', () => {
    const programs = {
      count: 2,
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
    ).dive().dive().dive();

    expect(wrapper.find('WithStyles(ForwardRef(Card))').length).toBe(2);
    expect(wrapper.find('WithStyles(ForwardRef(Card))').first()
      .find('WithStyles(WithStyles(ForwardRef(Button)))').find(FormattedMessage)
      .prop('defaultMessage')).toBe('Delete');
  });

  test('shows popover on hover', () => {
    const programs = {
      count: 5,
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
    ).dive().dive().dive();

    expect(wrapper.find('Styled(MuiBox)').at(2).prop('aria-owns')).toBe(undefined);
    wrapper.find('Styled(MuiBox)').at(2).simulate('mouseenter', { target: { class: 'classes.flexitem3' } });
    expect(wrapper.find('Styled(MuiBox)').at(2).prop('aria-owns')).toBe('mouse-over-popover');
    wrapper.find('Styled(MuiBox)').at(2).simulate('mouseleave', { target: { class: 'classes.flexitem3' } });
    expect(wrapper.find('Styled(MuiBox)').at(2).prop('aria-owns')).toBe(undefined);
  });

  test('shows the correct number of programs for other users', () => {
    const programs = {
      count: 2,
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
    ).dive().dive().dive();

    expect(wrapper.find('WithStyles(ForwardRef(Card))').length).toBe(2);
    expect(wrapper.find('WithStyles(ForwardRef(Card))').first()
      .find('WithStyles(ForwardRef(Typography))').at(1)
      .text()).toBe('By testuser');
  });

  test('callback when program click', () => {
    const programs = {
      count: 2,
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
    ).dive().dive().dive();

    wrapper.find('WithStyles(ForwardRef(CardActionArea))').first().simulate('click', {
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
      count: 2,
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
    ).dive().dive().dive();
    wrapper.find('WithStyles(WithStyles(ForwardRef(Button)))').first().simulate('click', {
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
      count: 2,
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
    ).dive().dive().dive();

    wrapper.find(Pagination).simulate('change', null, 2);

    expect(onUpdate).toHaveBeenCalledWith({
      page: 2,
      ordering: 'name',
      tag: '',
    });
  });

  test('callback when search changes', () => {
    jest.useFakeTimers();

    const programs = {
      count: 2,
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
    ).dive().dive().dive();

    wrapper.find('WithStyles(ForwardRef(TextField))').simulate('change', {
      target: {
        value: 'abc',
      },
    });

    expect(onUpdate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(250);

    expect(onUpdate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    expect(onUpdate).toHaveBeenCalledWith({
      search: 'abc',
      page: 1,
      ordering: 'name',
      tag: '',
    });
  });

  test('callback when search changes unset debounce time', () => {
    jest.useFakeTimers();

    const builtInParseInt = global.parseInt;
    global.parseInt = () => NaN;

    const programs = {
      count: 2,
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
    ).dive().dive().dive();

    wrapper.find('WithStyles(ForwardRef(TextField))').simulate('change', {
      target: {
        value: 'abc',
      },
    });

    expect(onUpdate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    expect(onUpdate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    expect(onUpdate).toHaveBeenCalledWith({
      search: 'abc',
      page: 1,
      ordering: 'name',
      tag: '',
    });

    global.parseInt = builtInParseInt;
  });

  test('callback when order changes', () => {
    const programs = {
      count: 2,
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
    ).dive().dive().dive();

    wrapper.find('WithStyles(ForwardRef(MenuItem))').simulate('click', { target: { id: 'name' } });

    expect(onUpdate).toHaveBeenCalledWith({
      page: 1,
      ordering: '-name',
      tag: '',
    });

    wrapper.find('WithStyles(ForwardRef(MenuItem))').simulate('click', { target: { id: 'name' } });

    expect(onUpdate).toHaveBeenCalledWith({
      page: 1,
      ordering: 'name',
      tag: '',
    });

    wrapper.find('WithStyles(ForwardRef(MenuItem))').simulate('click', { target: { id: 'other' } });

    expect(onUpdate).toHaveBeenCalledWith({
      page: 1,
      ordering: 'other',
      tag: '',
    });
  });

  test('callback when tag changes', () => {
    const programs = {
      count: 2,
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
    ).dive().dive().dive();

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
