import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import RxUtil from '@utils/Rx.Util';

const fetchListBookingAsync = async (pageIndex = 1, pageSize = 100) => {
    const pagingStr = `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const result = await RxUtil(
        `${Rx.BOOKING.GET_MY_BOOKING_AS_CUSTOMER}${pagingStr}`,
        'GET',
        null
    );
    return CommonHelpers.handleResByStatus(result);
};

const fetchPartnerInfoAsync = async (partnerId) => {
    const result = await RxUtil(
        `${Rx.PARTNER.PARTNER_DETAIL}/${partnerId}`,
        'GET'
    );
    return CommonHelpers.handleResByStatus(result);
};

const cancelBooking = () => {

};

export default {
    fetchListBookingAsync,
    cancelBooking,
    fetchPartnerInfoAsync
};
