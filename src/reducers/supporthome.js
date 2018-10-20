import { FETCH_SUPPORT_REQUESTS, 
    FETCH_SUPPORT_REQUESTS_FULFILLED,
    FETCH_SUPPORT_REQUESTS_REJECTED
} from '../actions/supporthome'

export default function supporthome (
    state = {
        json: null,
        isFetching: false
      },
      action,
) {
    switch (action.type) {
        case FETCH_SUPPORT_REQUESTS:
            return {
                ...state,
                isFetching: true,
            };
        case FETCH_SUPPORT_REQUESTS_FULFILLED:
            return {
                ...state,
                isFetching: false,
                json: action.payload,
            };
        case FETCH_SUPPORT_REQUESTS_REJECTED:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        default:
            return state;
    }  
}