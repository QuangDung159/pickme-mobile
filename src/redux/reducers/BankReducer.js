import { SET_LIST_BANK } from '../ActionTypes';

const initState = {
    listBank: []
};

const bankReducer = (state = initState, action) => {
    const { type, payload } = action;
    switch (type) {
        case SET_LIST_BANK: {
            return { ...state, listBank: payload.listBank };
        }
        default: {
            return state;
        }
    }
};

export default bankReducer;
