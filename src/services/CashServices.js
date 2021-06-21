import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import Middlewares from '@middlewares/index';
import { RxUtil } from '@utils/index';

const rxFetchCashHistoryAsync = async (body) => {
    const result = await RxUtil(
        Rx.CASH.GET_CASH_HISTORY,
        'GET',
        body
    );
    return result;
};

const fetchCashHistoryAsync = async (body) => {
    let result = await rxFetchCashHistoryAsync(body);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchCashHistoryAsync(body);
    }

    return CommonHelpers.handleResByStatus(result);
};

export default {
    fetchCashHistoryAsync
};
