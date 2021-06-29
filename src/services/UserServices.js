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

    const { data } = result;

    if (data.data) {
        await SecureStore.setItemAsync('api_token', result.data.data.token);
        await SecureStore.setItemAsync('phoneNumber', body.username);
        await SecureStore.setItemAsync('password', body.password);
    } else {
        await SecureStore.deleteItemAsync('api_token');
        await SecureStore.deleteItemAsync('phoneNumber');
        await SecureStore.deleteItemAsync('password');
    }

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

const rxFetchVerificationAsync = async () => {
    const result = await RxUtil(
        Rx.USER.GET_VERIFICATION_DETAIL,
        'GET'
    );
    return result;
};

const fetchVerificationAsync = async () => {
    let result = await rxFetchVerificationAsync();

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchVerificationAsync();
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitVerificationAsync = async () => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_VERIFICATION,
        'POST'
    );
    return result;
};

const submitVerificationAsync = async () => {
    let result = await rxSubmitVerificationAsync();

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitVerificationAsync();
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitChangePasswordAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_CHANGE_PASSWORD,
        'POST',
        body
    );
    return result;
};

const submitChangePasswordAsync = async (body) => {
    let result = await rxSubmitChangePasswordAsync(body);
    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitChangePasswordAsync(body);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitUpdateInfoAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.UPDATE_USER_INFO,
        'POST',
        body
    );
    return result;
};

const submitUpdateInfoAsync = async (body) => {
    let result = await rxSubmitUpdateInfoAsync(body);
    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitUpdateInfoAsync(body);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitForgotPasswordAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_FORGOT_PASSWORD_CONFIRM,
        'POST',
        body
    );
    return result;
};

const submitForgotPasswordAsync = async (body) => {
    let result = await rxSubmitForgotPasswordAsync(body);
    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitForgotPasswordAsync(body);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitGetOtpForgotPasswordAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.GENERATE_OTP_WHEN_FORGOT_PASSWORD,
        'POST',
        body
    );
    return result;
};

const submitGetOtpForgotPasswordAsync = async (body) => {
    let result = await rxSubmitGetOtpForgotPasswordAsync(body);
    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitGetOtpForgotPasswordAsync(body);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxFetchLeaderBoardAsync = async () => {
    const result = await RxUtil(
        Rx.SYSTEM.PICK_ME_INFO,
        'GET',
        null,
        PICKME_INFO_URL
    );
    return result;
};

const fetchLeaderBoardAsync = async () => {
    let result = await rxFetchLeaderBoardAsync();
    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchLeaderBoardAsync();
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitSignUpAsync = async (body) => {
    const result = await RxUtil(
        Rx.AUTHENTICATION.SIGN_UP,
        'POST',
        body
    );
    return result;
};

const submitSignUpAsync = async (body) => {
    let result = await rxSubmitSignUpAsync(body);
    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitSignUpAsync(body);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxFetchOtpSignUpAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.GET_OTP_REGISTER,
        'POST',
        body
    );
    return result;
};

const fetchOtpSignUpAsync = async (body) => {
    let result = await rxFetchOtpSignUpAsync(body);
    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchOtpSignUpAsync(body);
    }
    return CommonHelpers.handleResByStatus(result);
};

const mappingCurrentUserInfo = async (data) => {
    let apiToken = data.token;
    if (!apiToken) {
        apiToken = await SecureStore.getItemAsync('api_token');
    }

    const {
        accessFailedCount,
        address,
        bankNum,
        description,
        deviceId,
        dob,
        earningExpected,
        email,
        expoNotificationToken,
        fullName,
        height,
        homeTown,
        id,
        imageUrl,
        interests,
        isCashInAble,
        isCashOutAble,
        isCusomCalendar,
        isDeactive,
        isEmailConfirmed,
        isLocked,
        isTest,
        isVerified,
        latitude,
        longtitude,
        ownerName,
        url,
        userName,
        userType,
        userTypeValue,
        verifyNote,
        verifyStatus,
        verifyStatusValue,
        walletAmount,
        walletAmountDisplay,
        weight,
        posts
    } = data;

    const currentUserInfo = {
        accessFailedCount,
        address,
        bankNum,
        description,
        deviceId,
        dob,
        earningExpected,
        email,
        expoNotificationToken,
        fullName,
        height,
        homeTown,
        id,
        imageUrl,
        interests,
        isCashInAble,
        isCashOutAble,
        isCusomCalendar,
        isDeactive,
        isEmailConfirmed,
        isLocked,
        isTest,
        isVerified,
        latitude,
        longtitude,
        ownerName,
        token: apiToken,
        url,
        userName,
        userType,
        userTypeValue,
        verifyNote,
        verifyStatus,
        verifyStatusValue,
        walletAmount,
        walletAmountDisplay,
        weight,
        posts
    };

    return currentUserInfo;
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
    fetchOtpSignUpAsync,
    mappingCurrentUserInfo
};
