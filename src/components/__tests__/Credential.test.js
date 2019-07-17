import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { shallowWithIntl } from 'enzyme-react-intl';

import fileDownload from 'js-file-download';

import Credential from '../Credential';

jest.mock('js-file-download');

const rover = {
  id: 1,
  name: 'Sparky',
  config: {
    left_eye_port: 1,
    right_eye_port: 2,
  },
  client_id: '1234',
  client_secret: '5678',
};

describe('The Credential component', () => {
  beforeEach(() => {
    fileDownload.mockClear();
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallowWithIntl(<Credential rover={rover} />).dive();
    expect(wrapper).toMatchSnapshot();
  });

  test('operates dialog properly', () => {
    const wrapper = shallowWithIntl(<Credential rover={rover} />).dive();

    wrapper.instance().handleDownloadOpen();

    expect(wrapper.state('downloadOpen')).toBe(true);

    wrapper.find(Form.Input).first().simulate('change', {
      target: {
        value: 'AP Name',
      },
    });
    wrapper.find(Form.Input).last().simulate('change', {
      target: {
        value: 'AP Password',
      },
    });

    expect(wrapper.state('apName')).toBe('AP Name');
    expect(wrapper.state('apPassword')).toBe('AP Password');

    wrapper.find(Form).simulate('submit');

    expect(wrapper.state('downloadOpen')).toBe(false);
    expect(fileDownload).toHaveBeenCalledWith(
      `CLIENT_ID=${rover.client_id}\nCLIENT_SECRET=${rover.client_secret}\nAP_NAME=AP Name\nAP_PASSWORD=AP Password\n`,
      `rovercode_${rover.name}.env`,
    );
  });

  test('cancel dialog does not download credentials', () => {
    const wrapper = shallowWithIntl(<Credential rover={rover} />).dive();

    wrapper.instance().handleDownloadOpen();

    expect(wrapper.state('downloadOpen')).toBe(true);

    wrapper.find(Button).last().simulate('click');

    expect(wrapper.state('downloadOpen')).toBe(false);
    expect(fileDownload).not.toHaveBeenCalled();
  });
});
