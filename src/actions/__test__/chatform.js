import {categorySelectChange, 
  bodyInputChange, 
  subjectInputChange, 
  experienceSelectChange,
  categorySelectChange,
  WHAT_NEXT, FUN_IDEAS, DEBUG, 
  EXPERT, PRETTY_NEW, FIRST_TIME,FOR_A_WHILE, 
  CATEGORY_SELECT_CHANGE, 
  EXPERIENCE_SELECT_CHANGE, 
  BODY_INPUT_CHANGE, 
  SUBJECT_INPUT_CHANGE}
  from '../chatform'
  
describe('Category Select Action - Debug', () => {
  test('categorySelectChange', () => {
    const action = categorySelectChange(DEBUG);
    const { type, payload } = action;

    expect(type).toEqual('DEBUG');
    expect(payload).toEqual(DEBUG);
  });
});
  
describe('Category Select Action - Fun Ideas', () => {
  test('categorySelectChange', () => {
    const action = categorySelectChange(FUN_IDEAS);
    const { type, payload } = action;

    expect(type).toEqual('FUN_IDEAS');
    expect(payload).toEqual(FUN_IDEAS);
  });
});
  