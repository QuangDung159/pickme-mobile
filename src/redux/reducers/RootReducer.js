import { combineReducers } from 'redux';
import appConfigReducer from './AppConfigReducer';
import userReducer from './UserReducer';
import messageReducer from './MessageReducer';
import notificationReducer from './NotificationReducer';
import bankReducer from './BankReducer';
import locationReducer from './LocationReducer';

const appReducer = combineReducers({
    appConfigReducer,
    userReducer,
    messageReducer,
    notificationReducer,
    bankReducer,
    locationReducer
});

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
