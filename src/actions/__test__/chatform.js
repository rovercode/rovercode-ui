import {categorySelectChange, 
  bodyInputChange, 
  subjectInputChange, 
  experienceSelectChange,
  WHAT_NEXT, FUN_IDEAS, DEBUG, 
  EXPERT, PRETTY_NEW, FIRST_TIME,FOR_A_WHILE, 
  CATEGORY_SELECT_CHANGE, 
  EXPERIENCE_SELECT_CHANGE, 
  BODY_INPUT_CHANGE, 
  SUBJECT_INPUT_CHANGE}
  from '../chatform'
  
  describe('Category Select Action', () => {
    test('categorySelectChange', () => {
      const action = categorySelectChange(DEBUG);
      const { type, payload } = action;
  
      expect(type).toEqual('SELECT_CHANGE');
      expect(payload).toEqual(COVERED);
    });
  });
  