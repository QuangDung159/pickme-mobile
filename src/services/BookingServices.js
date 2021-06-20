import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import { RxUtil } from '@utils/index';

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

const fetchBookingDetailAsync = async (bookingId) => {
    const result = await RxUtil(
        `${Rx.BOOKING.DETAIL_BOOKING}/${bookingId}`,
        'GET'
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitCompleteBookingAsync = async (bookingId) => {
    const result = await RxUtil(
        `${Rx.BOOKING.COMPLETE_BOOKING}/${bookingId}`,
        'POST'
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitRatingAsync = async (body) => {
    const result = await RxUtil(
        Rx.BOOKING.BOOKING_RATE,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitConfirmPaymentAsync = async (bookingId) => {
    const result = await RxUtil(
        `${Rx.PAYMENT.CREATE_PAYMENT}/${bookingId}`,
        'POST'
    );
    return CommonHelpers.handleResByStatus(result);
};

const fetchListPartnerPackageAsync = async (partnerId) => {
    const result = await RxUtil(
        `${Rx.BOOKING.GET_PARTNER_PACKAGE}/${partnerId}`,
        'GET'
    );
    return CommonHelpers.handleResByStatus(result);
};

const fetchPartnerBusyCalendarAsync = async (partnerId) => {
    const result = await RxUtil(
        `${Rx.CALENDAR.PARTNER_CALENDAR}/${partnerId}`,
        'GET'
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitScheduleBookingAsync = async (partnerId, body) => {
    const result = await RxUtil(
        `${Rx.BOOKING.SCHEDULE_BOOKING}/${partnerId}`,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

const submitCancelBookingAsync = async (bookingId, body) => {
    const result = await RxUtil(
        `${Rx.BOOKING.CANCEL_BOOKING}/${bookingId}`,
        'POST',
        body
    );
    return CommonHelpers.handleResByStatus(result);
};

const fetchListPartnerAsync = async () => {
    const result = await RxUtil(
        Rx.PARTNER.GET_LIST_PARTNER,
        'GET'
    );
    return CommonHelpers.handleResByStatus(result);
};

export default {
    fetchListBookingAsync,
    submitCancelBookingAsync,
    fetchPartnerInfoAsync,
    fetchBookingDetailAsync,
    submitCompleteBookingAsync,
    submitRatingAsync,
    submitConfirmPaymentAsync,
    fetchListPartnerPackageAsync,
    fetchPartnerBusyCalendarAsync,
    submitScheduleBookingAsync,
    fetchListPartnerAsync
};
