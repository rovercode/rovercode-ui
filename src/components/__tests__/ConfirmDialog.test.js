import React from 'react';
import { shallow } from 'enzyme';
import { Button, Dialog } from '@material-ui/core';

import ConfirmDialog from '../ConfirmDialog';

describe('The ConfirmDialog component', () => {
  let onCancel;
  let onConfirm;
  let wrapper;

  beforeEach(() => {
    onCancel = jest.fn();
    onConfirm = jest.fn();

    wrapper = shallow(
      <ConfirmDialog
        title="Testing"
        open
        onConfirm={onConfirm}
        onCancel={onCancel}
        cancelButton="No"
        confirmButton="Yes"
      >
        Testing
      </ConfirmDialog>,
    );
  });

  test('renders on the page with no errors', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('calls cancel when cancelled', () => {
    wrapper.find(Button).at(0).simulate('click');

    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test('calls cancel when exited', () => {
    wrapper.find(Dialog).simulate('close');

    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test('calls confirm when confirmed', () => {
    wrapper.find(Button).at(1).simulate('click');

    expect(onCancel).not.toHaveBeenCalled();
    expect(onConfirm).toHaveBeenCalled();
  });
});
