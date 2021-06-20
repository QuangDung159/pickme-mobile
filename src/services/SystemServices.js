import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import RxUtil from '@utils/Rx.Util';

const fetchCashHistoryAsync = async (body) => {
    const result = await RxUtil(
        Rx.CASH.GET_CASH_HISTORY,
        'GET',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

export default {
    fetchCashHistoryAsync
};
