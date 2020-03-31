import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

class TextEncoder {
  encode = (string) => string
}
global.TextEncoder = TextEncoder;

configure({ adapter: new Adapter() });
