import {
    SET_CURRENT_USER,
    SET_LIST_CASH_HISTORY_STORE,
    SET_TOKEN,
    SET_LIST_BOOKING_STORE,
    SET_VERIFICATION_ID_STORE
} from '../ActionTypes';

const initState = {
    currentUser: {},
    token: '',
    loginInfo: {},
    listCashHistoryStore: [],
    listBookingStore: [],
    verificationIdStore: ''
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
        case SET_LIST_BOOKING_STORE: {
            return { ...state, listBookingStore: payload.listBookingStore };
        }
        case SET_VERIFICATION_ID_STORE: {
            return { ...state, verificationIdStore: payload.verificationIdStore };
        }
        default: {
            return state;
        }
    }
};

export default userReducer;
