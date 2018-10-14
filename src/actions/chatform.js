export const CATEGORY_SELECT_CHANGE = 'CATEGORY_SELECT_CHANGE';
export const BODY_INPUT_CHANGE = 'BODY_INPUT_CHANGE';
export const EXPERIENCE_SELECT_CHANGE = 'EXPERIENCE_SELECT_CHANGE'
export const SUBJECT_INPUT_CHANGE = 'SUBJECT_INPUT_CHANGE';

// CATEGORY STATES
export const FIRST_TIME = 0;
export const PRETTY_NEW = 1;
export const FOR_A_WHILE = 2;
export const EXPERT = 3;

//EXPERIENCE STATES
export const DEBUG = "DEBUG";
export const WHAT_NEXT = "WHAT_NEXT";
export const FUN_IDEAS = "FUN_IDEAS";


export const categorySelectChange = (value) =>({
    type: CATEGORY_SELECT_CHANGE,
    payload: value
})

export const subjectInputChange = (value) =>({
    type: SUBJECT_INPUT_CHANGE,
    payload: value
})

export const bodyInputChange = (value) =>({
    type: BODY_INPUT_CHANGE,
    payload: value
})

export const experienceSelectChange = (value) =>({
    type: EXPERIENCE_SELECT_CHANGE,
    payload: value
})

