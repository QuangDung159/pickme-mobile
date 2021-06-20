/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { Rx } from '@constants/index';
import RxUtil from '@utils/Rx.Util';

const handelResByStatus = (response) => {
    const {
        status,
        data
    } = response;

    if (status === 200 || status === 201) {
        return {
            isSuccess: true,
            data,
            status
        };
    }

    return {
        isSuccess: false,
        data,
        status
    };
};

const loginAsync = async (body) => {
    const result = await RxUtil(
        Rx.AUTHENTICATION.LOGIN,
        'POST',
        body
    );
    return handelResByStatus(result);
};

const fetchCurrentUserInfoAsync = async () => {
    const result = await RxUtil(
        Rx.USER.CURRENT_USER_INFO,
        'GET',
    );
    return handelResByStatus(result);
};

const fetchVerificationAsync = async () => {
    const result = await RxUtil(
        Rx.USER.GET_VERIFICATION_DETAIL,
        'GET'
    );
    return handelResByStatus(result);
};

const submitVerificationAsync = async () => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_VERIFICATION,
        'POST'
    );
    return handelResByStatus(result);
};

const submitChangePasswordAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_CHANGE_PASSWORD,
        'POST',
        body
    );
    return handelResByStatus(result);
};

const submitUpdateInfoAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.UPDATE_USER_INFO,
        'POST',
        body
    );
    return handelResByStatus(result);
};

export default {
    loginAsync,
    fetchCurrentUserInfoAsync,
    fetchVerificationAsync,
    submitVerificationAsync,
    submitChangePasswordAsync,
    submitUpdateInfoAsync
};
