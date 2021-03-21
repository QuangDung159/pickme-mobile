import {
    SET_CURRENT_USER,
    SET_LOGIN_INFO,
    SET_TOKEN
} from '../ActionTypes';

const initState = {
    currentUser: {},
    token: '',
    loginInfo: {}
};

const userReducer = (state = initState, action) => {
    const {
        type,
        payload
    } = action;
    switch (type) {
        case SET_CURRENT_USER: {
            return { ...state, currentUser: payload.currentUser };
        }
        case SET_TOKEN: {
            return { ...state, token: `Bearer ${payload.token}` };
        }
        case SET_LOGIN_INFO: {
            return { ...state, loginInfo: payload.loginInfo };
        }
        default: {
            return state;
        }
    }
};

export default userReducer;
