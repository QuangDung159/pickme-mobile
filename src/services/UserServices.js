/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { Rx } from '@constants/index';
import { PICKME_INFO_URL } from '@env';
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

const submitForgotPasswordAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_FORGOT_PASSWORD_CONFIRM,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitGetOtpForgotPasswordAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.GENERATE_OTP_WHEN_FORGOT_PASSWORD,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

const fetchLeaderBoardAsync = async () => {
    const result = await RxUtil(
        Rx.SYSTEM.PICK_ME_INFO,
        'GET',
        null,
        PICKME_INFO_URL
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitSignUpAsync = async (body) => {
    const result = await RxUtil(
        Rx.AUTHENTICATION.SIGN_UP,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

const fetchOtpSignUpAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.GET_OTP_REGISTER,
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
    submitUpdateInfoAsync,
    submitForgotPasswordAsync,
    submitGetOtpForgotPasswordAsync,
    fetchLeaderBoardAsync,
    submitSignUpAsync,
    fetchOtpSignUpAsync
};
