import {
    SET_CURRENT_USER,
    SET_LIST_CASH_HISTORY_STORE,
    SET_TOKEN
} from '../ActionTypes';

const initState = {
    currentUser: {},
    token: '',
    loginInfo: {},
    listCashHistoryStore: []
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
        case SET_LIST_CASH_HISTORY_STORE: {
            return { ...state, listCashHistoryStore: payload.listCashHistoryStore };
        }
        default: {
            return state;
        }
    }
};

export default userReducer;
