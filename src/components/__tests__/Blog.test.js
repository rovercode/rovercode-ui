import React from 'react';
import { shallow } from 'enzyme';
import { Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';

import Blog from '../Blog';

const questions = [{
  id: 1,
  question: 'Question1',
  answer: null,
  sequence_number: 2,
  required: true,
}, {
  id: 2,
  question: 'Question2',
  answer: null,
  sequence_number: 1,
  required: true,
}, {
  id: 3,
  question: 'Question3',
  answer: 'Answer1',
  sequence_number: 3,
  required: false,
}];

describe('The Blog component', () => {
  test('renders on the page with no errors', () => {
    const wrapper = shallow(<Blog />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Typography).at(0).text()).toBe('No Blog Post Available');
  });

  test('displays questions and answers', () => {
    const wrapper = shallow(<Blog questions={questions} />).dive().dive();

    expect(wrapper.find(Typography).length).toBe(7);
    expect(wrapper.find(Typography).at(0).text()).toBe('*Required');
    expect(wrapper.find(Typography).at(1).text()).toBe('Question2*');
    expect(wrapper.find(Typography).at(2).text()).toBe('No Response');
    expect(wrapper.find(Typography).at(3).text()).toBe('Question1*');
    expect(wrapper.find(Typography).at(4).text()).toBe('No Response');
    expect(wrapper.find(Typography).at(5).text()).toBe('Question3');
    expect(wrapper.find(ReactMarkdown).length).toBe(1);
    expect(wrapper.find(ReactMarkdown).at(0).children().text()).toBe('Answer1');
  });

  test('displays questions and answers in read-only mode', () => {
    const wrapper = shallow(<Blog questions={questions} isReadOnly />).dive().dive();

    expect(wrapper.find(Typography).length).toBe(5);
    expect(wrapper.find(Typography).at(0).text()).toBe('Question2*');
    expect(wrapper.find(Typography).at(1).text()).toBe('No Response');
    expect(wrapper.find(Typography).at(2).text()).toBe('Question1*');
    expect(wrapper.find(Typography).at(3).text()).toBe('No Response');
    expect(wrapper.find(Typography).at(4).text()).toBe('Question3');
    expect(wrapper.find(ReactMarkdown).length).toBe(1);
    expect(wrapper.find(ReactMarkdown).at(0).children().text()).toBe('Answer1');
  });
});
