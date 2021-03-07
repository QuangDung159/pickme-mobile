import {
    SET_CURRENT_USER,
    SET_TOKEN,
    SET_CALENDAR,
} from '../ActionTypes';

const initState = {
    currentUser: {},
    token: '',
    calendar: [],
    listBankAccount: []
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
        case SET_CALENDAR: {
            return { ...state, calendar: payload.calendar };
        }
        default: {
            return state;
        }
    }
};

export default userReducer;
