import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import RxUtil from '@utils/Rx.Util';

const loginAsync = async (body) => {
    const result = await RxUtil(
        Rx.AUTHENTICATION.LOGIN,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

const fetchCurrentUserInfoAsync = async () => {
    const result = await RxUtil(
        Rx.USER.CURRENT_USER_INFO,
        'GET',
    );
    return CommonHelpers.handleResByStatus(result);
};

const fetchVerificationAsync = async () => {
    const result = await RxUtil(
        Rx.USER.GET_VERIFICATION_DETAIL,
        'GET'
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitVerificationAsync = async () => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_VERIFICATION,
        'POST'
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitChangePasswordAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_CHANGE_PASSWORD,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitUpdateInfoAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.UPDATE_USER_INFO,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

export default {
    loginAsync,
    fetchCurrentUserInfoAsync,
    fetchVerificationAsync,
    submitVerificationAsync,
    submitChangePasswordAsync,
    submitUpdateInfoAsync
};
