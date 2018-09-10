import React from 'react';
import { mount, shallow } from 'enzyme';

jest.mock('node-blockly/browser');

import Blockly from 'node-blockly/browser'; // eslint-disable-line import/first
import Workspace from '../Workspace'; // eslint-disable-line import/first

describe('The Workspace component', () => {
  let playground = null;

  beforeEach(() => {
    playground = {
      addChangeListener: jest.fn((cb) => { cb(); }),
    };
    Blockly.svgResize.mockReset();
    Blockly.inject.mockReset();
    Blockly.JavaScript.workspaceToCode.mockReset();
    Blockly.Xml.workspaceToDom.mockReset();
    Blockly.Xml.domToText.mockReset();
    Blockly.inject.mockImplementation(() => playground);
    Blockly.JavaScript.workspaceToCode.mockImplementation(() => 'test-code');
    Blockly.Xml.workspaceToDom.mockImplementation(() => 'test-xml');
    Blockly.Xml.domToText.mockImplementation(() => 'test-dom-text');
    Blockly.Xml.textToDom.mockImplementation(() => 'test-dom');
  });

  test('renders on the page with no errors', () => {
    const updateJsCode = jest.fn();
    const wrapper = mount(<Workspace updateJsCode={updateJsCode} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('adds correct code prefix', () => {
    const updateJsCode = jest.fn();
    Blockly.JavaScript.workspaceToCode.mockReturnValue('testText');

    const wrapper = shallow(<Workspace updateJsCode={updateJsCode} />);

    wrapper.instance().updateJsCode();
    expect(Blockly.JavaScript.STATEMENT_PREFIX).toEqual('highlightBlock(%1);\n');
  });
});
