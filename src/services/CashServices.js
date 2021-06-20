import { Rx } from '../constants';
import RxUtil from '../utils/Rx.Util';

const fetchCashHistoryAsync = async (body) => {
    const result = await RxUtil(
        Rx.CASH.GET_CASH_HISTORY,
        'GET',
        body
    );

    const {
        status,
        data
    } = result;

    console.log('result :>> ', result);

    if (status === 200 || status === 201) {
        return {
            data,
            status
        };
    }

    return {
        data: null,
        status
    };
};

export default {
    fetchCashHistoryAsync
};
