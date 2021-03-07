import * as Localization from 'expo-localization';

import {
    SET_DEVICE_TIMEZONE,
    SET_DEVICE_LOCALE,
    SET_DEVICE_ID,
} from '../ActionTypes';

const initState = {
    timezone: Localization.timezone,
    localeName: Localization.locale,
    deviceId: '',
};

const appConfigReducer = (state = initState, action) => {
    const { payload, type } = action;
    switch (type) {
        case SET_DEVICE_TIMEZONE: {
            return { ...state, timezone: Localization.timezone };
        }
        case SET_DEVICE_LOCALE: {
            return { ...state, localeName: Localization.locale };
        }
        case SET_DEVICE_ID: {
            return { ...state, deviceId: payload.deviceId };
        }
        default: {
            return state;
        }
    }
};

export default appConfigReducer;
