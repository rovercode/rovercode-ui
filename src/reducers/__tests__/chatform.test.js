import reducer from '../chatform'

import { 
  DEBUG, 
  WHAT_NEXT,
  FUN_IDEAS,
  SUBJECT_INPUT_CHANGE,
  BODY_INPUT_CHANGE,
  CATEGORY_SELECT_CHANGE,
  EXPERIENCE_SELECT_CHANGE,
  FIRST_TIME,
  PRETTY_NEW,
  FOR_A_WHILE,
  EXPERT,
  } from '../../actions/chatform'

describe('The chatform reducer', () => {
    test('should handle CATEGORY_SELCT_CHANGE - DEBUG', () => {
        expect(
        reducer({}, {
            type: CATEGORY_SELECT_CHANGE,
            payload: DEBUG,
        }),
        ).toEqual({
        categoryValue: 'DEBUG',
        });
    });

    test('should handle CATEGORY_SELCT_CHANGE - WHAT_NEXT', () => {
        expect(
        reducer({}, {
            type: CATEGORY_SELECT_CHANGE,
            payload: WHAT_NEXT,
        }),
        ).toEqual({
        categoryValue: 'WHAT_NEXT',
        });
    });

    test('should handle CATEGORY_SELCT_CHANGE - FUN_IDEAS', () => {
        expect(
        reducer({}, {
            type: CATEGORY_SELECT_CHANGE,
            payload: FUN_IDEAS,
        }),
        ).toEqual({
        categoryValue: 'FUN_IDEAS',
        });
    });

    test('should handle EXPERIENCE_SELECT_CHANGE - FIRST_TIME', () => {
        expect(
        reducer({}, {
            type: EXPERIENCE_SELECT_CHANGE,
            payload: FIRST_TIME,
        }),
        ).toEqual({
        experienceValue: 0,
        });
    });

    test('should handle EXPERIENCE_SELECT_CHANGE - PRETTY_NEW', () => {
        expect(
        reducer({}, {
            type: EXPERIENCE_SELECT_CHANGE,
            payload: PRETTY_NEW,
        }),
        ).toEqual({
        experienceValue: 1,
        });
    });

    test('should handle EXPERIENCE_SELECT_CHANGE - FOR_A_WHILE', () => {
        expect(
        reducer({}, {
            type: EXPERIENCE_SELECT_CHANGE,
            payload: FOR_A_WHILE,
        }),
        ).toEqual({
        experienceValue: 2,
        });
    });

    test('should handle EXPERIENCE_SELECT_CHANGE - EXPERT', () => {
        expect(
        reducer({}, {
            type: EXPERIENCE_SELECT_CHANGE,
            payload: EXPERT,
        }),
        ).toEqual({
        experienceValue: 3,
        });
    });

    test('should handle BODY_INPUT_CHANGE', () => {
        expect(
        reducer({}, {
            type: BODY_INPUT_CHANGE,
            payload: "Here is the body",
        }),
        ).toEqual({
        bodyValue: "Here is the body",
        });
    });
    test('should handle SUBJECT_INPUT_CHANGE', () => {
        expect(
        reducer({}, {
            type: SUBJECT_INPUT_CHANGE,
            payload: "Here is the subject",
        }),
        ).toEqual({
        subjectValue: "Here is the subject",
        });
    });
});
