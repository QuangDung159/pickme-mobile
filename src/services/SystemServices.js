import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import Middlewares from '@middlewares/index';
import { RxUtil } from '@utils/index';

const rxSubmitBugReportAsync = async (body) => {
    const result = await RxUtil(
        Rx.SYSTEM.CREATE_BUG,
        'POST',
        body
    );
    return result;
};

const submitBugReportAsync = async (body) => {
    let result = await rxSubmitBugReportAsync(body);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitBugReportAsync(body);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitUpdateExpoTokenAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.UPDATE_EXPO_TOKEN,
        'POST',
        body
    );
    return result;
};

const submitUpdateExpoTokenAsync = async (body) => {
    let result = await rxSubmitUpdateExpoTokenAsync(body);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitUpdateExpoTokenAsync(body);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitChangeDeviceConfirmAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_CHANGE_DEVICE_CONFIRM,
        'POST',
        body
    );
    return result;
};

const submitChangeDeviceConfirmAsync = async (body) => {
    let result = await rxSubmitChangeDeviceConfirmAsync(body);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitChangeDeviceConfirmAsync(body);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchOtpChangeDeviceAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.GENERATE_OTP_WHEN_CHANGE_DEVICE,
        'POST',
        body
    );
    return result;
};

const fetchOtpChangeDeviceAsync = async (body) => {
    let result = await rxFetchOtpChangeDeviceAsync(body);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchOtpChangeDeviceAsync(body);
    }

    return CommonHelpers.handleResByStatus(result);
};

export default {
    submitBugReportAsync,
    submitUpdateExpoTokenAsync,
    submitChangeDeviceConfirmAsync,
    fetchOtpChangeDeviceAsync
};
