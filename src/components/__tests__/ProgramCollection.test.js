import React from 'react';
import {
  Button,
  Card,
  Header,
  Input,
} from 'semantic-ui-react';
import { shallow } from 'enzyme';
import CustomPagination from '../CustomPagination';
import ProgramCollection from '../ProgramCollection';

let onProgramClick;
let onRemoveClick;
let onPageChange;
let onSearchChange;

describe('The ProgramCollection component', () => {
  beforeEach(() => {
    onProgramClick = jest.fn();
    onRemoveClick = jest.fn();
    onPageChange = jest.fn();
    onSearchChange = jest.fn();
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
        user: 10,
      }, {
        id: 5,
        name: 'Unnamed_Design_2',
        content: '<xml><variables></variables></xml>',
        user: 1,
      }],
    };
    const wrapper = shallow(
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onPageChange={onPageChange}
        onSearchChange={onSearchChange}
      />,
    );
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
        user: 1,
      }, {
        id: 5,
        name: 'Unnamed_Design_2',
        content: '<xml><variables></variables></xml>',
        user: 1,
      }],
    };
    const wrapper = shallow(
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onPageChange={onPageChange}
        onSearchChange={onSearchChange}
      />,
    );

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Card).length).toBe(2);
    expect(wrapper.find(Card.Meta).first().prop('children')).toBe('Mine');
    expect(wrapper.find(Button).first().prop('children')).toBe('Keep Working');
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
        user: 1,
      }, {
        id: 5,
        name: 'Unnamed_Design_2',
        content: '<xml><variables></variables></xml>',
        user: 1,
      }],
    };
    const wrapper = shallow(
      <ProgramCollection
        programs={programs}
        label="My Programs"
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onPageChange={onPageChange}
        onSearchChange={onSearchChange}
      />,
    );

    expect(wrapper.find(Header).exists()).toBe(true);
    expect(wrapper.find(Card).length).toBe(2);
    expect(wrapper.find(Card.Meta).first().prop('children')).toBe(1);
    expect(wrapper.find(Button).first().prop('children')).toBe('View');
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
        user: 10,
      }],
    };
    const wrapper = shallow(
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onPageChange={onPageChange}
        onSearchChange={onSearchChange}
      />,
    );

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
        user: 10,
      }],
    };
    const wrapper = shallow(
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onPageChange={onPageChange}
        onSearchChange={onSearchChange}
      />,
    );

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
        user: 1,
      }, {
        id: 5,
        name: 'Unnamed_Design_2',
        content: '<xml><variables></variables></xml>',
        user: 1,
      }],
    };
    const wrapper = shallow(
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onPageChange={onPageChange}
        onSearchChange={onSearchChange}
      />,
    );

    wrapper.find(CustomPagination).simulate('pageChange', null, {
      activePage: 2,
    });

    expect(onPageChange).toHaveBeenCalledWith(2, true);
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
        user: 1,
      }, {
        id: 5,
        name: 'Unnamed_Design_2',
        content: '<xml><variables></variables></xml>',
        user: 1,
      }],
    };
    const wrapper = shallow(
      <ProgramCollection
        programs={programs}
        label="My Programs"
        owned
        onProgramClick={onProgramClick}
        onRemoveClick={onRemoveClick}
        onPageChange={onPageChange}
        onSearchChange={onSearchChange}
      />,
    );

    wrapper.find(Input).simulate('change', {
      target: {
        value: 'abc',
      },
    });

    expect(onSearchChange).toHaveBeenCalledWith('abc', true);
  });
});
