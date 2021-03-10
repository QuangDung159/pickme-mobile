import { combineReducers } from 'redux';
import appConfigReducer from './AppConfigReducer';
import userReducer from './UserReducer';
import messageReducer from './MessageReducer';
import notificationReducer from './NotificationReducer';
import bankReducer from './BankReducer';
import locationReducer from './LocationReducer';
import { RESET_STORE_SIGN_OUT } from '../ActionTypes';

const appReducer = combineReducers({
    appConfigReducer,
    userReducer,
    messageReducer,
    notificationReducer,
    bankReducer,
    locationReducer
});

const rootReducer = (state, action) => {
    // reset store when sign out
    if (action.type === RESET_STORE_SIGN_OUT) {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

export default rootReducer;
