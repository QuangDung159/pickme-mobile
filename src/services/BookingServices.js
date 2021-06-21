import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import Middlewares from '@middlewares/index';
import { RxUtil } from '@utils/index';

const rxFetchListBookingAsync = async (pageIndex, pageSize) => {
    const pagingStr = `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const result = await RxUtil(
        `${Rx.BOOKING.GET_MY_BOOKING_AS_CUSTOMER}${pagingStr}`,
        'GET'
    );
    return result;
};

const fetchListBookingAsync = async (pageIndex = 1, pageSize = 100) => {
    let result = await rxFetchListBookingAsync(pageIndex, pageSize);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchListBookingAsync(pageIndex, pageSize);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchPartnerInfoAsync = async (partnerId) => {
    const result = await RxUtil(
        `${Rx.PARTNER.PARTNER_DETAIL}/${partnerId}`,
        'GET'
    );
    return result;
};

const fetchPartnerInfoAsync = async (partnerId) => {
    let result = await rxFetchPartnerInfoAsync(partnerId);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchPartnerInfoAsync(partnerId);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchBookingDetailAsync = async (bookingId) => {
    const result = await RxUtil(
        `${Rx.BOOKING.DETAIL_BOOKING}/${bookingId}`,
        'GET'
    );
    return result;
};

const fetchBookingDetailAsync = async (bookingId) => {
    let result = await rxFetchBookingDetailAsync(bookingId);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchBookingDetailAsync(bookingId);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitCompleteBookingAsync = async (bookingId) => {
    const result = await RxUtil(
        `${Rx.BOOKING.COMPLETE_BOOKING}/${bookingId}`,
        'POST'
    );
    return result;
};

const submitCompleteBookingAsync = async (bookingId) => {
    let result = await rxSubmitCompleteBookingAsync(bookingId);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitCompleteBookingAsync(bookingId);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitRatingAsync = async (body) => {
    const result = await RxUtil(
        Rx.BOOKING.BOOKING_RATE,
        'POST',
        body
    );
    return result;
};

const submitRatingAsync = async (body) => {
    let result = await rxSubmitRatingAsync(body);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitRatingAsync(body);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitConfirmPaymentAsync = async (bookingId) => {
    const result = await RxUtil(
        `${Rx.PAYMENT.CREATE_PAYMENT}/${bookingId}`,
        'POST'
    );
    return result;
};

const submitConfirmPaymentAsync = async (bookingId) => {
    let result = await rxSubmitConfirmPaymentAsync(bookingId);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitConfirmPaymentAsync(bookingId);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchListPartnerPackageAsync = async (partnerId) => {
    const result = await RxUtil(
        `${Rx.BOOKING.GET_PARTNER_PACKAGE}/${partnerId}`,
        'GET'
    );
    return result;
};

const fetchListPartnerPackageAsync = async (partnerId) => {
    let result = await rxFetchListPartnerPackageAsync(partnerId);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchListPartnerPackageAsync(partnerId);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchPartnerBusyCalendarAsync = async (partnerId) => {
    const result = await RxUtil(
        `${Rx.CALENDAR.PARTNER_CALENDAR}/${partnerId}`,
        'GET'
    );
    return result;
};

const fetchPartnerBusyCalendarAsync = async (partnerId) => {
    let result = await rxFetchPartnerBusyCalendarAsync(partnerId);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchPartnerBusyCalendarAsync(partnerId);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitScheduleBookingAsync = async (partnerId, body) => {
    const result = await RxUtil(
        `${Rx.BOOKING.SCHEDULE_BOOKING}/${partnerId}`,
        'POST',
        body
    );
    return result;
};

const submitScheduleBookingAsync = async (partnerId, body) => {
    let result = await rxSubmitScheduleBookingAsync(partnerId, body);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitScheduleBookingAsync(partnerId, body);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitCancelBookingAsync = async (bookingId, body) => {
    const result = await RxUtil(
        `${Rx.BOOKING.CANCEL_BOOKING}/${bookingId}`,
        'POST',
        body
    );
    return result;
};

const submitCancelBookingAsync = async (bookingId, body) => {
    let result = await rxSubmitCancelBookingAsync(bookingId, body);

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitCancelBookingAsync(bookingId, body);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchListPartnerAsync = async () => {
    const result = await RxUtil(
        Rx.PARTNER.GET_LIST_PARTNER,
        'GET'
    );
    return result;
};

const fetchListPartnerAsync = async () => {
    let result = await rxFetchListPartnerAsync();

    const handledResult = await Middlewares.handleTokenStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchListPartnerAsync();
    }

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
