/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { Rx } from '@constants/index';
import { PICKME_INFO_URL } from '@env';
import { CommonHelpers } from '@helpers/index';
import Middlewares from '@middlewares/index';
import { RxUtil } from '@utils/index';
import * as SecureStore from 'expo-secure-store';

const loginAsync = async (body) => {
    const result = await RxUtil(
        Rx.AUTHENTICATION.LOGIN,
        'POST',
        body
    );

    await SecureStore.setItemAsync('api_token', result.data.data);
    return CommonHelpers.handleResByStatus(result);
};

const rxFetchCurrentUserInfoAsync = async () => {
    const result = await RxUtil(
        Rx.USER.CURRENT_USER_INFO,
        'GET',
    );
    return result;
};

const fetchCurrentUserInfoAsync = async () => {
    // set expired token to test
    // eslint-disable-next-line max-len
    // await SecureStore.setItemAsync('api_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Imh1eXZkIiwidXNlcklkIjoiOTBiNjQxMjktY2UwMS00ZWQ1LTg3YTEtZTQzYWUxZDMwNGJkIiwiZnVsbE5hbWUiOiJodXkgxJHhurlwIHRyYWkiLCJkZXNjcmlwdGlvbiI6Im5ow6Aga28gY8OzIGfDrCBuZ2_DoGkgxJFp4buBdSBraeG7h24iLCJhZGRyZXNzIjoiMDEgaGFvbmcgZGlldSAyIHF1YW4gdGh1IGR1YyIsInVybCI6Imh0dHBzOi8vem5ld3MtcGhvdG8uemFkbi52bi93NjYwL1VwbG9hZGVkL2NxeHJjYWp3cC8yMDEzXzEwXzA3L2NhbmguanBnIiwidXNlclR5cGUiOiJDdXN0b21lciIsImlzVGVzdCI6IkZhbHNlIiwiaXNMb2NrZWQiOiJGYWxzZSIsImV4cCI6MTYyMzkzNjU3N30.w1UW5WoK0a2dU6jUuoUe5Ik_x3t1_EIEp5ij_12kIPI');

    let result = await rxFetchCurrentUserInfoAsync();

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchCurrentUserInfoAsync();
    }

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
