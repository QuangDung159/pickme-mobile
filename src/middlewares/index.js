import Rx from '@constants/Rx';
import CommonHelpers from '@helpers/CommonHelpers';
import RxUtil from '@utils/Rx.Util';
import * as SecureStore from 'expo-secure-store';

const loginRefreshTokenAsync = async (body) => {
    const result = await RxUtil(
        Rx.AUTHENTICATION.LOGIN,
        'POST',
        body
    );

    await SecureStore.setItemAsync('api_token', result.data.data.token);
    return CommonHelpers.handleResByStatus(result);
};

const handleTokenStatusMiddleware = async (response) => {
    if (response.status === 401 && response.headers.tokenexpired) {
        const phoneNumber = await SecureStore.getItemAsync('phoneNumber');
        const password = await SecureStore.getItemAsync('password');
        const deviceId = await SecureStore.getItemAsync('deviceId');

        const res = await loginRefreshTokenAsync({
            username: phoneNumber,
            password,
            deviceId
        });
        return res;
    }
    return null;
};

export default {
    handleTokenStatusMiddleware
};
