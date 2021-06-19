import { useSelector } from 'react-redux';
import { Rx } from '../constants';
import RxUtil from '../utils/Rx.Util';

const fetchCashHistoryAsync = async (body) => {
    const token = useSelector((state) => state.userReducer.token);

    const result = await RxUtil(
        Rx.CASH.GET_CASH_HISTORY,
        'GET',
        body,
        {
            Authorization: token
        }
    );

    const {
        status,
        data
    } = result;

    console.log('result :>> ', result);

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

export default {
    fetchCashHistoryAsync
};
