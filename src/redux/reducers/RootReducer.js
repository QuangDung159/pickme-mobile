import { combineReducers } from 'redux';
import { RESET_STORE_SIGN_OUT } from '../ActionTypes';
import appConfigReducer from './AppConfigReducer';
import bankReducer from './BankReducer';
import bookingReducer from './BookingReducer';
import locationReducer from './LocationReducer';
import messageReducer from './MessageReducer';
import notificationReducer from './NotificationReducer';
import userReducer from './UserReducer';

const appReducer = combineReducers({
    appConfigReducer,
    userReducer,
    messageReducer,
    notificationReducer,
    bankReducer,
    locationReducer,
    bookingReducer
});

const rootReducer = (state, action) => {
    // reset store when sign out
    if (action.type === RESET_STORE_SIGN_OUT) {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

export default rootReducer;
