import reducer from '../chatapp'
import { TOGGLE_FORMS, SET_SESSION_ID, SET_CLIENT_ID} from '../../actions/chatapp'

describe('The chatform reducer', () => {

    //TODO: Figure out why chatHidden and formHidden both equal to true?
    // test('should handle TOGGLE_FORM', () => {
    //     expect(
    //     reducer({}, {
    //         type: TOGGLE_FORMS,
    //     }),
    //     ).toEqual({
    //         chatHidden: false,
    //         formHidden: true,
    //     });
    // });

    test('should handle SET_SESSION_ID', () => {
        expect(
        reducer({}, {
            type: SET_SESSION_ID,
            payload: "1234"
        }),
        ).toEqual({
            sessionId: "1234",
        });
    });
    test('should handle SET_CLIENT_ID', () => {
        expect(
        reducer({}, {
            type: SET_CLIENT_ID,
            payload: "1234"
        }),
        ).toEqual({
            clientId: "1234",
        });
    });
});