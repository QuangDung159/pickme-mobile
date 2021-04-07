import {
    SET_CURRENT_USER,
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
        default: {
            return state;
        }
    }
};

export default userReducer;
