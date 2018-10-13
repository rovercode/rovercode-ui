export const TOGGLE_FORMS = 'TOGGLE_FORMS';
export const SET_SESSION_ID = 'SET_SESSION_ID'
export const SET_CLIENT_ID = 'SET_CLIENT_ID'


export const toggleForms = () =>({
    type: TOGGLE_FORMS,
});

export const setClientID = (clientid) =>({
    type: SET_CLIENT_ID,
    clientID: clientId,
})

export const setSessionID = (sessionid) =>({
    type: SET_SESSION_ID,
    sessionID: sessionId,
})

