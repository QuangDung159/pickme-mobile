import { Rx } from '@constants';
import RxUtil from '@utils/Rx.Util';

const handelResByStatus = (response) => {
    const {
        status,
        data
    } = response;

    if (status === 200 || status === 201) {
        return {
            isSuccess: true,
            data,
            status
        };
    }

    return {
        isSuccess: false,
        data,
        status
    };
};

const fetchCashHistoryAsync = async (body) => {
    const result = await RxUtil(
        Rx.CASH.GET_CASH_HISTORY,
        'GET',
        body
    );
    return handelResByStatus(result);
};

export default {
    fetchCashHistoryAsync
};
