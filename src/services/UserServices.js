/* eslint import/no-unresolved: [2, { ignore: ['@env'] }] */
import { Rx } from '@constants/index';
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
        await SecureStore.setItemAsync('username', body.username);
        await SecureStore.setItemAsync('password', body.password);
    } else {
        await SecureStore.deleteItemAsync('api_token');
        await SecureStore.deleteItemAsync('username');
        await SecureStore.deleteItemAsync('password');
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchCurrentUserInfoAsync = async (domain = null) => {
    const result = await RxUtil(
        Rx.USER.CURRENT_USER_INFO,
        'GET', null, domain
    );
    return result;
};

const fetchCurrentUserInfoAsync = async () => {
    // set expired token to test
    // eslint-disable-next-line max-len
    // await SecureStore.setItemAsync('api_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Imh1eXZkIiwidXNlcklkIjoiOTBiNjQxMjktY2UwMS00ZWQ1LTg3YTEtZTQzYWUxZDMwNGJkIiwiZnVsbE5hbWUiOiJodXkgxJHhurlwIHRyYWkiLCJkZXNjcmlwdGlvbiI6Im5ow6Aga28gY8OzIGfDrCBuZ2_DoGkgxJFp4buBdSBraeG7h24iLCJhZGRyZXNzIjoiMDEgaGFvbmcgZGlldSAyIHF1YW4gdGh1IGR1YyIsInVybCI6Imh0dHBzOi8vem5ld3MtcGhvdG8uemFkbi52bi93NjYwL1VwbG9hZGVkL2NxeHJjYWp3cC8yMDEzXzEwXzA3L2NhbmguanBnIiwidXNlclR5cGUiOiJDdXN0b21lciIsImlzVGVzdCI6IkZhbHNlIiwiaXNMb2NrZWQiOiJGYWxzZSIsImV4cCI6MTYyMzkzNjU3N30.w1UW5WoK0a2dU6jUuoUe5Ik_x3t1_EIEp5ij_12kIPI');

    let result = await rxFetchCurrentUserInfoAsync();

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchCurrentUserInfoAsync(handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchVerificationAsync = async (domain = null) => {
    const result = await RxUtil(
        Rx.USER.GET_VERIFICATION_DETAIL,
        'GET', null, domain
    );
    return result;
};

const fetchVerificationAsync = async () => {
    let result = await rxFetchVerificationAsync();

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchVerificationAsync(handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitVerificationAsync = async (domain = null) => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_VERIFICATION,
        'POST',
        null, domain
    );
    return result;
};

const submitVerificationAsync = async () => {
    let result = await rxSubmitVerificationAsync();

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitVerificationAsync(handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitChangePasswordAsync = async (body, domain = null) => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_CHANGE_PASSWORD,
        'POST',
        body, domain
    );
    return result;
};

const submitChangePasswordAsync = async (body) => {
    let result = await rxSubmitChangePasswordAsync(body);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitChangePasswordAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitUpdateInfoAsync = async (body, domain = null) => {
    const result = await RxUtil(
        Rx.USER.UPDATE_USER_INFO,
        'POST',
        body, domain
    );
    return result;
};

const submitUpdateInfoAsync = async (body) => {
    let dobToSend = body.dob;
    if (body.dob.length > 4) {
        dobToSend = body.dob.substr(0, 4);
    }

    let result = await rxSubmitUpdateInfoAsync({
        ...body, dob: `${dobToSend}-01-01T14:00:00`, weight: +body.weight, height: +body.height
    });
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitUpdateInfoAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitForgotPasswordAsync = async (body, domain = null) => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_FORGOT_PASSWORD_CONFIRM,
        'POST',
        body, domain
    );
    return result;
};

const submitForgotPasswordAsync = async (body) => {
    let result = await rxSubmitForgotPasswordAsync(body);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitForgotPasswordAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitSignUpAsync = async (body, domain = null) => {
    const result = await RxUtil(
        Rx.AUTHENTICATION.SIGN_UP_V2,
        'POST',
        body, domain
    );
    console.log('rxSubmitSignUpAsync :>> ', result);
    return result;
};

const submitSignUpAsync = async (body) => {
    console.log('body :>> ', body);
    let result = await rxSubmitSignUpAsync(body);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitSignUpAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxFetchOtpSignUpAsync = async (body, domain = null) => {
    const result = await RxUtil(
        Rx.USER.GET_OTP_REGISTER,
        'POST',
        body,
        domain
    );
    return result;
};

const fetchOtpSignUpAsync = async (body) => {
    let result = await rxFetchOtpSignUpAsync(body);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchOtpSignUpAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxFetchOtpForgotPasswordAsync = async (body, domain = null) => {
    const result = await RxUtil(
        Rx.USER.GET_OTP_FORGOT_PASSWORD,
        'POST',
        body,
        domain
    );
    return result;
};

const fetchOtpForgotPasswordAsync = async (body) => {
    let result = await rxFetchOtpForgotPasswordAsync(body);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchOtpForgotPasswordAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxFetchUserBusyCalendarAsync = async (domain = null) => {
    const result = await RxUtil(
        Rx.CALENDAR.MY_CALENDAR,
        'GET', null, domain
    );
    return result;
};

const fetchUserBusyCalendar = async () => {
    let result = await rxFetchUserBusyCalendarAsync();
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchUserBusyCalendarAsync(handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitBusyCalendarAsync = async (body, domain = null) => {
    const result = await RxUtil(
        Rx.CALENDAR.ADD_CALENDAR,
        'POST',
        body,
        domain
    );
    return result;
};

const submitBusyCalendarAsync = async (body) => {
    let result = await rxSubmitBusyCalendarAsync(body);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitBusyCalendarAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitUpdatePackageAsync = async (packageId, body, domain = null) => {
    const result = await RxUtil(
        `${Rx.USER.UPDATE_PACKAGE}/${packageId}`,
        'POST',
        body,
        domain
    );
    return result;
};

const submitUpdatePackageSync = async (packageId, body) => {
    let result = await rxSubmitUpdatePackageAsync(packageId, body);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitUpdatePackageAsync(packageId, body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitAddPackageAsync = async (body, domain = null) => {
    const result = await RxUtil(
        Rx.USER.ADD_PACKAGE,
        'POST',
        body, domain
    );
    return result;
};

const submitAddPackageAsync = async (body) => {
    let result = await rxSubmitAddPackageAsync(body);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitAddPackageAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitReportUserAsync = async (body, userId, domain = null) => {
    const result = await RxUtil(
        `${Rx.USER.REPORT_USER}/${userId}`,
        'POST',
        body,
        domain
    );
    return result;
};

const submitReportUserAsync = async (body, userId) => {
    let result = await rxSubmitReportUserAsync(body, userId);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitReportUserAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxAddVerifyDocAsync = async (body, domain = null) => {
    const result = await RxUtil(
        Rx.USER.ADD_VERIFY_DOCUMENT,
        'POST',
        body,
        domain
    );
    return result;
};

const addVerifyDocAsync = async (body, userId) => {
    let result = await rxAddVerifyDocAsync(body, userId);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxAddVerifyDocAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxUpdatePartnerInfoAsync = async (body, domain = null) => {
    const result = await RxUtil(Rx.USER.UPDATE_PARTNER_INFO, 'POST', body, domain);
    return result;
};

const submitUpdatePartnerInfoAsync = async (body) => {
    let result = await rxUpdatePartnerInfoAsync(body);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxUpdatePartnerInfoAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const rxAddUserPostImageAsync = async (body, domain = null) => {
    const result = await RxUtil(
        Rx.USER.UPLOAD_USER_IMAGE,
        'POST',
        body,
        domain
    );
    return result;
};

const addUserPostImageAsync = async (body) => {
    let result = await rxAddUserPostImageAsync(body);
    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxAddUserPostImageAsync(body, handledResult.backupDomain);
    }
    return CommonHelpers.handleResByStatus(result);
};

const mappingCurrentUserInfo = async (data) => {
    let apiToken = data.token;
    if (!apiToken) {
        apiToken = await SecureStore.getItemAsync('api_token');
    }

    const currentUserInfo = {
        ...data,
        token: data?.token || apiToken
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
    submitSignUpAsync,
    fetchOtpSignUpAsync,
    fetchUserBusyCalendar,
    submitBusyCalendarAsync,
    submitUpdatePackageSync,
    submitAddPackageAsync,
    mappingCurrentUserInfo,
    submitReportUserAsync,
    addUserPostImageAsync,
    addVerifyDocAsync,
    submitUpdatePartnerInfoAsync,
    fetchOtpForgotPasswordAsync
};
