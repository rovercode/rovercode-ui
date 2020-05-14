import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

class TextEncoder {
  encode = (string) => string
}
global.TextEncoder = TextEncoder;

global.PXT_HEX_URL = 'https://some-url';

const mockDevice = { name: 'Sparky' };
const mockBluetooth = {
  requestDevice: jest.fn(() => mockDevice),
};
global.navigator.bluetooth = mockBluetooth;

configure({ adapter: new Adapter() });
