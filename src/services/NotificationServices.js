import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import Middlewares from '@middlewares/index';
import { RxUtil } from '@utils/index';

const rxFetchListNotificationAsync = async () => {
    const result = await RxUtil(
        Rx.NOTIFICATION.GET_MY_NOTIFICATION,
        'GET'
    );
    return result;
};

const fetchListNotificationAsync = async () => {
    let result = await rxFetchListNotificationAsync();

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchListNotificationAsync();
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxTriggerReadNotificationAsync = async (notificationId) => {
    const result = await RxUtil(
        `${Rx.NOTIFICATION.TRIGGER_READ}/${notificationId}`,
        'POST'
    );
    return result;
};

const triggerReadNotificationAsync = async (notificationId) => {
    let result = await rxTriggerReadNotificationAsync(notificationId);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxTriggerReadNotificationAsync(notificationId);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxTriggerReadAllNotificationAsync = async () => {
    const result = await RxUtil(
        Rx.NOTIFICATION.TRIGGER_READ_ALL,
        'POST'
    );
    return result;
};

const triggerReadAllNotificationAsync = async () => {
    let result = await rxTriggerReadAllNotificationAsync();

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxTriggerReadAllNotificationAsync();
    }

    return CommonHelpers.handleResByStatus(result);
};

export default {
    fetchListNotificationAsync,
    triggerReadNotificationAsync,
    triggerReadAllNotificationAsync
};
