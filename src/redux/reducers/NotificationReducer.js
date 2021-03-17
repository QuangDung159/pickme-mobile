import { SET_LIST_NOTIFICATION, SET_NUMBER_NOTIFICATION_UNREAD } from '../ActionTypes';

const initState = {
    listNotification: [],
    numberNotificationUnread: 0
};

const notificationReducer = (state = initState, action) => {
    const { type, payload } = action;
    switch (type) {
        case SET_LIST_NOTIFICATION: {
            return { ...state, listNotification: payload.listNotification };
        }
        case SET_NUMBER_NOTIFICATION_UNREAD: {
            return { ...state, numberNotificationUnread: payload.numberNotificationUnread };
        }
        default: {
            return state;
        }
    }
};

export default notificationReducer;
