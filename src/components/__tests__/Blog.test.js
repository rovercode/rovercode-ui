import React from 'react';
import { shallow } from 'enzyme';
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
  test('renders on the page with no errors', () => {
    const wrapper = shallow(<Blog />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Typography).at(0).text()).toBe('*Required');
  });

  test('displays questions and answers', () => {
    const wrapper = shallow(<Blog questions={questions} />).dive().dive();

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
    const wrapper = shallow(<Blog questions={questions} />);
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
  });

  test('displays questions and answers in read-only mode', () => {
    const wrapper = shallow(<Blog questions={questions} isReadOnly />).dive().dive();

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
    const wrapper = shallow(<Blog questions={questions} />);
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

  test('triggers onChange event when input changes', () => { // should cover lines 65-68 once working
    const wrapper = shallow(<Blog questions={questions} />);
    const onChangeHandler = jest.fn();
    onChangeHandler.mockReturnValue(true);
    wrapper
      .find('Styled(MuiBox)')
      .at(7)
      .dive()
      .find('WithStyles(ForwardRef(Button))')
      .props()
      .onClick();
    wrapper.update();
    wrapper
      .find('QuestionRender')
      .at(0)
      .dive()
      .find('WithStyles(ForwardRef(TextField))')
      .simulate('change', { target: { value: 'Hello' } });
    expect(onChangeHandler).toHaveBeenCalled();
  });

  test('triggers edit mode when clicking on a displayed answer', () => {
    const wrapper = shallow(<Blog questions={questions} />);
    wrapper.find('QuestionRender').at(0).dive().find('WithStyles(ForwardRef(CardContent))')
      .props()
      .onClick();
    wrapper.update();
    expect(wrapper.find('QuestionRender').at(0).dive().find('WithStyles(ForwardRef(TextField))').length).toBe(1);
  });
});
