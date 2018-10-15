import { 
  bodyInputChange, 
  subjectInputChange, 
  experienceSelectChange,
  categorySelectChange,
  DEBUG, 
  EXPERT}
  from '../chatform'
  
describe('Category Select Change Action - DEBUG', () => {
  test('categorySelectChange', () => {
    const action = categorySelectChange(DEBUG);
    const { type, payload } = action;
    expect(type).toEqual('CATEGORY_SELECT_CHANGE');
    expect(payload).toEqual('DEBUG');
  });
});

describe('Experience Select Change Action - EXPERT', () => {
  test('experienceSelectChange', () => {
    const action = experienceSelectChange(EXPERT);
    const { type, payload } = action;
    expect(type).toEqual('EXPERIENCE_SELECT_CHANGE');
    expect(payload).toEqual(EXPERT);
  });
});

describe('Body Input Change Action', () => {
  test('bodyInputChange', () => {
    const action = bodyInputChange("Here is body");
    const { type, payload } = action;
    expect(type).toEqual('BODY_INPUT_CHANGE');
    expect(payload).toEqual("Here is body");
  });
});

describe('Subject Input Change Action', () => {
  test('subjectInputChange', () => {
    const action = subjectInputChange("Here is subject");;
    const { type, payload } = action;
    expect(type).toEqual('SUBJECT_INPUT_CHANGE');
    expect(payload).toEqual("Here is subject");
  });
});