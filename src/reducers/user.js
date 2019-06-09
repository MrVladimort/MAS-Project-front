import {USER_LOGGED_IN, USER_LOGGED_OUT} from "../types/auth";

export default (state = {}, action = {}) => {
    switch (action.type) {
        case USER_LOGGED_IN:
            return action.userData;
        case USER_LOGGED_OUT:
            return {};
        default: return state;
    }
}