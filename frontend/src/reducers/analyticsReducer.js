import {
    ANALYTICS_LOADING,
    ANALYTICS_SUCCESS,
    ANALYTICS_NOT_FOUND,
    ANALYTICS_ERROR
} from '../actions/types';

const initialState = {
    labels: undefined, 
    statesTagged: undefined, 
    statesUntagged: undefined, 
    issues: undefined, 
    loading: false 
};

export default function(state = initialState, action) {
    const { type, payload } = action;
    
    switch(type) {
        case ANALYTICS_LOADING:
            return {
                ...state,
                loading: true,
                error: undefined
            }
        case ANALYTICS_SUCCESS:
            return {
                ...state,
                labels: payload.labels,
                statesTagged: payload.statesTagged,
                statesUntagged: payload.statesUntagged,
                issues: payload.issues,
                loading: false
            };
        case ANALYTICS_NOT_FOUND:
            return {
                ...state,
                error: payload.error,
                loading: false
            };
        case ANALYTICS_ERROR:
            return {
                ...state,
                error: payload.error,
                loading: false
            };
        default:
            return state;
    };
}