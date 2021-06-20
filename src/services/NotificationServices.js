import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import RxUtil from '@utils/Rx.Util';

const fetchListNotificationAsync = async () => {
    const result = await RxUtil(
        Rx.NOTIFICATION.GET_MY_NOTIFICATION,
        'GET'
    );
    return CommonHelpers.handleResByStatus(result);
};

export default {
    fetchListNotificationAsync
};
