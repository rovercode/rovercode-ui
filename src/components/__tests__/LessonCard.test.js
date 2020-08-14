import React from 'react';
import { shallow } from 'enzyme';
import { CardActionArea, CardHeader } from '@material-ui/core';

import LessonCard from '../LessonCard';

describe('The LessonCard component', () => {
  const lesson = {
    id: 1,
    reference: 'Test',
    description: 'This is a test',
    active_bd: 1,
    active_bd_owned: false,
    tier: 1,
  };
  const onClick = jest.fn();
  beforeEach(() => {
    onClick.mockReset();
  });

  test('renders on the page with no errors', () => {
    lesson.state = { progress: 'AVAILABLE' };
    const wrapper = shallow(<LessonCard lesson={lesson} onClick={onClick} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CardActionArea).prop('disabled')).toBe(false);
    expect(wrapper.find(CardHeader).prop('action').props.children).toBeNull();
  });

  test('shows progress icon', () => {
    lesson.state = { progress: 'IN_PROGRESS' };
    const wrapper = shallow(<LessonCard lesson={lesson} onClick={onClick} />);

    expect(wrapper.find(CardActionArea).prop('disabled')).toBe(false);
    expect(wrapper.find(CardHeader).prop('action').props.children.props.className).toBe('makeStyles-inProgress-1');
    expect(wrapper.find(CardHeader).prop('action').props.children.type.displayName).toBe('LensIcon');
  });

  test('shows complete icon', () => {
    lesson.state = { progress: 'COMPLETE' };
    const wrapper = shallow(<LessonCard lesson={lesson} onClick={onClick} />);

    expect(wrapper.find(CardActionArea).prop('disabled')).toBe(false);
    expect(wrapper.find(CardHeader).prop('action').props.children.props.className).toBe('makeStyles-complete-2');
    expect(wrapper.find(CardHeader).prop('action').props.children.type.displayName).toBe('CheckCircleIcon');
  });

  test('is disabled when unavailable', () => {
    lesson.state = { progress: 'UNAVAILABLE' };
    const wrapper = shallow(<LessonCard lesson={lesson} onClick={onClick} />);

    expect(wrapper.find(CardActionArea).prop('disabled')).toBe(true);
    expect(wrapper.find(CardHeader).prop('action').props.children).toBeNull();
  });

  test('handles missing progress', () => {
    lesson.state = null;
    const wrapper = shallow(<LessonCard lesson={lesson} onClick={onClick} />);

    expect(wrapper.find(CardActionArea).prop('disabled')).toBe(false);
    expect(wrapper.find(CardHeader).prop('action').props.children).toBeNull();
  });

  test('allows click when unlocked', () => {
    lesson.state = { progress: 'IN_PROGRESS' };
    const wrapper = shallow(<LessonCard lesson={lesson} onClick={onClick} />);

    wrapper.find(CardActionArea).simulate('click');
    expect(onClick).toHaveBeenCalled();
  });

  test('blocks click when locked', () => {
    lesson.state = { progress: 'IN_PROGRESS' };
    const wrapper = shallow(<LessonCard lesson={lesson} onClick={onClick} userTier={0} />);

    wrapper.find(CardActionArea).simulate('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});
