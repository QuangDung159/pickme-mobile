import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import RxUtil from '@utils/Rx.Util';

const submitBugReportAsync = async (body) => {
    const result = await RxUtil(
        Rx.SYSTEM.CREATE_BUG,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitUpdateExpoTokenAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.UPDATE_EXPO_TOKEN,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitChangeDeviceConfirmAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.SUBMIT_CHANGE_DEVICE_CONFIRM,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

const fetchOtpChangeDeviceAsync = async (body) => {
    const result = await RxUtil(
        Rx.USER.GENERATE_OTP_WHEN_CHANGE_DEVICE,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

export default {
    submitBugReportAsync,
    submitUpdateExpoTokenAsync,
    submitChangeDeviceConfirmAsync,
    fetchOtpChangeDeviceAsync
};
