import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import Middlewares from '@middlewares/index';
import { RxUtil } from '@utils/index';

const rxFetchCashHistoryAsync = async () => {
    const result = await RxUtil(
        Rx.CASH.GET_CASH_HISTORY,
        'GET'
    );
    return result;
};

const fetchCashHistoryAsync = async () => {
    let result = await rxFetchCashHistoryAsync();

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchCashHistoryAsync();
    }

    return CommonHelpers.handleResByStatus(result);
};

export default {
    fetchCashHistoryAsync
};
