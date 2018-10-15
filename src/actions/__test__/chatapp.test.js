import { TOGGLE_FORMS, 
    SET_SESSION_ID, 
    SET_CLIENT_ID, 
    toggleForms,
    setSessionID, 
    setClientID } from '../chatapp'

describe('Toggle Forms', () => {
    test('toggleForms', () => {
      const action = toggleForms();
      const {type} = action;
      expect(type).toEqual('TOGGLE_FORMS');
    });
});

describe('Set Client ID', () => {
    test('setClientID', () => {
      const action = setClientID("1234");
      const {type, payload} = action;
      expect(type).toEqual(SET_CLIENT_ID);
      expect(payload).toEqual('1234');
    });
});

describe('Set Session ID', () => {
    test('setSessionID', () => {
      const action = setSessionID("1234");
      const {type, payload} = action;
      expect(type).toEqual(SET_SESSION_ID);
      expect(payload).toEqual('1234');
    });
});