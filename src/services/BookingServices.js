import { Rx } from '../constants';
import RxUtil from '../utils/Rx.Util';

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

const fetchListBookingAsync = async (pageIndex = 1, pageSize = 100) => {
    const pagingStr = `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const result = await RxUtil(
        `${Rx.BOOKING.GET_MY_BOOKING_AS_CUSTOMER}${pagingStr}`,
        'GET',
        null
    );
    return handelResByStatus(result);
};

const cancelBooking = () => {

};

export default {
    fetchListBookingAsync,
    cancelBooking
};
