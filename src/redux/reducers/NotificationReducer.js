import { SET_LIST_NOTIFICATION } from '../ActionTypes';

const initState = {
    listNotification: []
};

const notificationReducer = (state = initState, action) => {
    const { type, payload } = action;
    switch (type) {
        case SET_LIST_NOTIFICATION: {
            return { ...state, listNotification: payload.listNotification };
        }
        default: {
            return state;
        }
    }
};

export default notificationReducer;
