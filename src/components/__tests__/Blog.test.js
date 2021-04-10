import React from 'react';
import { shallow, mount } from 'enzyme';
import { Typography } from '@material-ui/core';
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
  let mockSaveBlogAnswers = null;

  beforeEach(() => {
    mockSaveBlogAnswers = jest.fn();
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallow(<Blog saveBlogAnswers={mockSaveBlogAnswers} programID={1} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Typography).at(0).text()).toBe('*Required');
  });

  test('displays questions and answers', () => {
    const wrapper = shallow(
      <Blog questions={questions} saveBlogAnswers={mockSaveBlogAnswers} programID={1} />,
    ).dive().dive();

    expect(wrapper.find('WithStyles(ForwardRef(Typography))').at(0).text()).toBe('*Required');
    expect(wrapper.find('WithStyles(ForwardRef(Typography))').at(1).text()).toBe('Question2*');
    expect(wrapper.find('QuestionRender').at(0).dive().find('WithStyles(ForwardRef(Typography))')
      .text()).toBe('No Response');
    expect(wrapper.find('WithStyles(ForwardRef(Typography))').at(2).text()).toBe('Question1*');
    expect(wrapper.find('QuestionRender').at(1).dive().find('WithStyles(ForwardRef(Typography))')
      .text()).toBe('No Response');
    expect(wrapper.find('WithStyles(ForwardRef(Typography))').at(3).text()).toBe('Question3');
    expect(wrapper.find('QuestionRender').at(2).dive().find('ReactMarkdown').length).toBe(1);
    expect(wrapper.find('QuestionRender').at(2).dive().find('ReactMarkdown')
      .at(0)
      .children()
      .text()).toBe('Answer1');
  });

  test('toggles edit mode when clicking the edit button', () => {
    const wrapper = shallow(
      <Blog questions={questions} saveBlogAnswers={mockSaveBlogAnswers} programID={1} />,
    );
    expect(wrapper.find('Styled(MuiBox)').at(7).dive().find('WithStyles(ForwardRef(Button))')
      .text()).toBe('Edit');
    wrapper.find('Styled(MuiBox)').at(7).dive().find('WithStyles(ForwardRef(Button))')
      .props()
      .onClick();
    wrapper.update();
    expect(wrapper.find('Styled(MuiBox)').at(7).dive().find('WithStyles(ForwardRef(Button))')
      .text()).toBe('Save');
    wrapper.find('Styled(MuiBox)').at(7).dive().find('WithStyles(ForwardRef(Button))')
      .props()
      .onClick();
    wrapper.update();
    expect(mockSaveBlogAnswers).toHaveBeenCalled();
  });

  test('displays questions and answers in read-only mode', () => {
    const wrapper = shallow(
      <Blog questions={questions} saveBlogAnswers={mockSaveBlogAnswers} programID={1} isReadOnly />,
    ).dive().dive();

    expect(wrapper.find('WithStyles(ForwardRef(Typography))').at(0).text()).toBe('Question2*');
    expect(wrapper.find('QuestionRender').at(0).dive().find('WithStyles(ForwardRef(Typography))')
      .text()).toBe('No Response');
    expect(wrapper.find('WithStyles(ForwardRef(Typography))').at(1).text()).toBe('Question1*');
    expect(wrapper.find('QuestionRender').at(1).dive().find('WithStyles(ForwardRef(Typography))')
      .text()).toBe('No Response');
    expect(wrapper.find('WithStyles(ForwardRef(Typography))').at(2).text()).toBe('Question3');
    expect(wrapper.find('QuestionRender').at(2).dive().find('ReactMarkdown').length).toBe(1);
    expect(wrapper.find('QuestionRender').at(2).dive().find('ReactMarkdown')
      .at(0)
      .children()
      .text()).toBe('Answer1');
  });

  test('displays textfields in edit mode', () => {
    const wrapper = shallow(
      <Blog questions={questions} saveBlogAnswers={mockSaveBlogAnswers} programID={1} />,
    );
    wrapper.find('Styled(MuiBox)').at(7).dive().find('WithStyles(ForwardRef(Button))')
      .props()
      .onClick();
    wrapper.update();
    expect(wrapper.find('Styled(MuiBox)').at(7).dive().find('WithStyles(ForwardRef(Button))')
      .text()).toBe('Save');
    expect(wrapper.find('QuestionRender').at(0).dive().find('WithStyles(ForwardRef(TextField))').length).toBe(1);
    expect(wrapper.find('QuestionRender').at(1).dive().find('WithStyles(ForwardRef(TextField))').length).toBe(1);
    expect(wrapper.find('QuestionRender').at(2).dive().find('WithStyles(ForwardRef(TextField))').length).toBe(1);
  });

  test('onChange and save to update question value', () => {
    const wrapper = mount(
      <Blog questions={questions} saveBlogAnswers={mockSaveBlogAnswers} programID={1} />,
    );

    wrapper
      .find('Styled(MuiBox)')
      .at(7)
      .find('WithStyles(ForwardRef(Button))')
      .props()
      .onClick();
    wrapper.update();
    wrapper
      .find('QuestionRender')
      .at(2)
      .find('WithStyles(ForwardRef(TextField))').find('WithStyles(ForwardRef(InputBase))')
      .props()
      .onChange({ target: { id: '3', value: 'Hello' } });
    wrapper.find('Styled(MuiBox)').at(7).find('WithStyles(ForwardRef(Button))')
      .props()
      .onClick();
    wrapper.update();
    expect(wrapper.find('QuestionRender').at(2).find('ReactMarkdown')
      .at(0)
      .children()
      .text()).toBe('Hello');
  });

  test('triggers edit mode when clicking on a displayed answer', () => {
    const wrapper = shallow(
      <Blog questions={questions} saveBlogAnswers={mockSaveBlogAnswers} programID={1} />,
    );
    wrapper.find('QuestionRender').at(0).dive().find('WithStyles(ForwardRef(CardContent))')
      .props()
      .onClick();
    wrapper.update();
    expect(wrapper.find('QuestionRender').at(0).dive().find('WithStyles(ForwardRef(TextField))').length).toBe(1);
  });
});
