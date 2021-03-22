import React from 'react';
import { shallow } from 'enzyme';

import Course from '../Course';

describe('The Course component', () => {
  const course = {
    id: 1,
    name: 'Test',
    description: 'This is a test',
    lessons: [{
      id: 1,
      reference: 'Lesson1',
      description: 'The second lesson',
      sequence_number: 2,
      active_bd: 1,
      active_bd_owned: false,
      state: {
        progress: 'IN_PROGRESS',
      },
    }, {
      id: 2,
      reference: 'Lesson2',
      description: 'The first lesson',
      sequence_number: 1,
      active_bd: 2,
      active_bd_owned: true,
      state: {
        progress: 'AVAILABLE',
      },
    }],
  };
  const onLessonClick = jest.fn();

  test('renders on the page with no errors', () => {
    const wrapper = shallow(<Course course={course} onLessonClick={onLessonClick} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('sorts the lessons', () => {
    const wrapper = shallow(<Course course={course} onLessonClick={onLessonClick} />);

    expect(wrapper.find('LessonCard').first().prop('lesson').id).toBe(2);
    expect(wrapper.find('LessonCard').last().prop('lesson').id).toBe(1);
  });

  test('handles accordion expansion', () => {
    const wrapper = shallow(<Course course={course} onLessonClick={onLessonClick} />);

    expect(wrapper.find('WithStyles(ForwardRef(Typography))').at(1).text()).toBe('Hide Course');
    wrapper.find('WithStyles(ForwardRef(Accordion))').props().onChange();
    expect(wrapper.find('WithStyles(ForwardRef(Typography))').at(1).text()).toBe('Show Course');
  });
});
