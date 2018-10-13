import { SELECT_CHANGE } from '../actions/chatform';

export default function chatapp(
    state ={
        selectValue: null
    }, action,
) {
    switch(action.type){
        case SELECT_CHANGE:
            return{
                ...state,
                selectValue: action.selectVal
            };
        default:
            return state;
    }
}