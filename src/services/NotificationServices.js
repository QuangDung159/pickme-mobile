import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import Middlewares from '@middlewares/index';
import { RxUtil } from '@utils/index';

const rxFetchListNotificationAsync = async (domain = null) => {
    const result = await RxUtil(
        `${Rx.NOTIFICATION.GET_MY_NOTIFICATION}?pageIndex=1&pageSize=30`,
        'GET',
        null, domain
    );
    return result;
};

const fetchListNotificationAsync = async () => {
    let result = await rxFetchListNotificationAsync();

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchListNotificationAsync(handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxTriggerReadNotificationAsync = async (notificationId, domain = null) => {
    const result = await RxUtil(
        `${Rx.NOTIFICATION.TRIGGER_READ}/${notificationId}`,
        'POST',
        null, domain
    );
    return result;
};

const triggerReadNotificationAsync = async (notificationId) => {
    let result = await rxTriggerReadNotificationAsync(notificationId);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxTriggerReadNotificationAsync(notificationId, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxTriggerReadAllNotificationAsync = async (domain = null) => {
    const result = await RxUtil(
        Rx.NOTIFICATION.TRIGGER_READ_ALL,
        'POST', null, domain
    );
    return result;
};

const triggerReadAllNotificationAsync = async () => {
    let result = await rxTriggerReadAllNotificationAsync();

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxTriggerReadAllNotificationAsync(handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

export default {
    fetchListNotificationAsync,
    triggerReadNotificationAsync,
    triggerReadAllNotificationAsync
};
