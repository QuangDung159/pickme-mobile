import * as Localization from 'expo-localization';
import {
    SET_DEVICE_ID_STORE,
    SET_DEVICE_LOCALE, SET_DEVICE_TIMEZONE,
    SET_EXPO_TOKEN,
    SET_NAVIGATION,
    SET_PERSON_TAB_ACTIVE_INDEX,
    SET_PICK_ME_INFO_STORE,
    SET_SHOW_LOADER_STORE
} from '../ActionTypes';

const initState = {
    timezone: Localization.timezone,
    localeName: Localization.locale,
    expoToken: '',
    navigationObj: null,
    personTabActiveIndex: 0,
    deviceIdStore: '',
    pickMeInfoStore: null,
    showLoaderStore: false,
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
        case SET_EXPO_TOKEN: {
            return { ...state, expoToken: payload.expoToken };
        }
        case SET_NAVIGATION: {
            return { ...state, navigationObj: payload.navigationObj };
        }
        case SET_PERSON_TAB_ACTIVE_INDEX: {
            return { ...state, personTabActiveIndex: payload.personTabActiveIndex };
        }
        case SET_DEVICE_ID_STORE: {
            return { ...state, deviceIdStore: payload.deviceIdStore };
        }
        case SET_PICK_ME_INFO_STORE: {
            return { ...state, pickMeInfoStore: payload.pickMeInfoStore };
        }
        case SET_SHOW_LOADER_STORE: {
            return { ...state, showLoaderStore: payload.showLoaderStore };
        }
        default: {
            return state;
        }
    }
};

export default appConfigReducer;
