import {
    SET_CHATING_WITH,
    SET_DATA_LISTENED,
    SET_LIST_CONVERSATION,
    SET_MESSAGE_LISTENED,
    SET_NUMBER_MESSAGE_UNREAD
} from '../ActionTypes';

const initState = {
    chattingWith: '',
    dataListened: {},
    messageListened: {},
    listConversation: [],
    numberMessageUnread: 0,
    newMessageComeFrom: 'current'
};

const messageReducer = (state = initState, action) => {
    const { type, payload } = action;
    switch (type) {
        case SET_CHATING_WITH: {
            return { ...state, chattingWith: payload.chattingWith };
        }
        case SET_DATA_LISTENED: {
            return { ...state, dataListened: payload.dataListened };
        }
        case SET_MESSAGE_LISTENED: {
            return { ...state, messageListened: payload.messageListened };
        }
        case SET_LIST_CONVERSATION: {
            return { ...state, listConversation: payload.listConversation };
        }
        case SET_NUMBER_MESSAGE_UNREAD: {
            return { ...state, numberMessageUnread: payload.numberMessageUnread };
        }
        default: {
            return state;
        }
    }
};

export default messageReducer;
