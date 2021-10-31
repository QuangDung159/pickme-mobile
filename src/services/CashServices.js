import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import Middlewares from '@middlewares/index';
import { RxUtil } from '@utils/index';

const rxFetchCashHistoryAsync = async (domain = null) => {
    const result = await RxUtil(
        Rx.CASH.GET_CASH_HISTORY,
        'GET',
        null, domain
    );
    return result;
};

const fetchCashHistoryAsync = async () => {
    let result = await rxFetchCashHistoryAsync();

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchCashHistoryAsync(handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

export default {
    fetchCashHistoryAsync
};
