/* eslint-disable import/no-unresolved */
import Rx from '@constants/Rx';
import CommonHelpers, { getConfigByEnv } from '@helpers/CommonHelpers';
import RxUtil from '@utils/Rx.Util';
import * as SecureStore from 'expo-secure-store';

const { API_URL_BACKUP } = getConfigByEnv();

const loginRefreshTokenAsync = async (body) => {
    const result = await RxUtil(
        Rx.AUTHENTICATION.LOGIN,
        'POST',
        body
    );
    const { data } = result;

    if (data.data) {
        await SecureStore.setItemAsync('api_token', result.data.data.token.toString());
        await SecureStore.setItemAsync('username', body.username.toString());
        await SecureStore.setItemAsync('password', body.password.toString());
    } else {
        await SecureStore.deleteItemAsync('api_token');
        await SecureStore.deleteItemAsync('username');
        await SecureStore.deleteItemAsync('password');
    }

    return CommonHelpers.handleResByStatus(result);
};

const handleResponseStatusMiddleware = async (response) => {
    if (response.status === 401 && response.headers.tokenexpired) {
        const phoneNumber = await SecureStore.getItemAsync('username');
        const password = await SecureStore.getItemAsync('password');
        const deviceId = await SecureStore.getItemAsync('deviceId');

        const res = await loginRefreshTokenAsync({
            username: phoneNumber,
            password,
            deviceId
        });
        return res;
    }

    if (response.status === 503) {
        return { backupDomain: API_URL_BACKUP };
    }
    return null;
};

export default {
    handleResponseStatusMiddleware
};
