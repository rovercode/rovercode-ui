import Axios from "axios";

export const TOGGLE_FORMS = 'TOGGLE_FORMS';
export const SET_SESSION_ID = 'SET_SESSION_ID';
export const SET_CLIENT_ID = 'SET_CLIENT_ID';
export const SET_IS_SUPPORT_PROVIDER = 'SET_IS_SUPPORT_PROVIDER';


export const toggleForms = () => ({
  type: TOGGLE_FORMS,
});

export const setClientID = id => ({
  type: SET_CLIENT_ID,
  payload: id,
});

export const setSessionID = id => ({
  type: SET_SESSION_ID,
  payload: id,
});

export const setIsSupportProvider = () => ({
  type: SET_IS_SUPPORT_PROVIDER,
});

