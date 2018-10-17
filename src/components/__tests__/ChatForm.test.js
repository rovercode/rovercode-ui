import React from 'react';
import { Button } from 'semantic-ui-react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import { toggleForms } from '../../actions/chatform';
import ChatForm from '../ChatForm'
import { stub} from 'sinon';
import ChatApp from '../ChatApp'


describe('The ChatForm component', () => {
  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    store = mockStore({
      chatform: {
        //TODO Somethign here
      },
      chatapp:{
          formHidden: false,
          chatHidden: true
      },
    });
    store.dispatch = jest.fn();


  });

//   test('renders on the page with no errors', () => {
//     const wrapper = mount(<ChatForm store={store} />);
//     expect(toJson(wrapper)).toMatchSnapshot();
//   });

  test('toggles Chat', () => {
    const toggleForms = stub();
    const wrapper = shallow(<ChatApp store={store} toggleForms={toggleForms} />).dive();
    wrapper.find("Button").prop('onClick')
    expect(onClick.callCount).to.be.equal(1);
    wrapper.find(Button).simulate('click');
    expect(store.dispatch).toHaveBeenCalledWith(toggleForms());

    // const handleClickStub = sinon.spy()
    // const wrapper = mount(<Parent items={items} handleClick={handleClickStub} />)
    // console.log(wrapper.state('clickedChild')) // prints false
    // wrapper.find(ChildComponent).last().simulate('click')
    // expect(handleClickStub.calledOnce).to.be.true // successful
    // console.log(wrapper.state('clickedChild'))  // prints true



  });

});