import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

class TextEncoder {
  encode = (string) => string
}
global.TextEncoder = TextEncoder;

global.PXT_HEX_URL = 'https://some-url';

global.LOGGER_ENDPOINT = 'https://some-sumo-url/rovercode';

global.SUBSCRIPTION_SERVICE = 'https://some-subscription-url';

global.STRIPE_SHARABLE_KEY = 'pk_test_abcd';

const mockDevice = { name: 'Sparky' };
const mockBluetooth = {
  requestDevice: jest.fn(() => mockDevice),
};
global.navigator.bluetooth = mockBluetooth;

configure({ adapter: new Adapter() });
