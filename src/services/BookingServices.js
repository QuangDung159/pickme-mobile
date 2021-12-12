import { Rx } from '@constants/index';
import { CommonHelpers } from '@helpers/index';
import Middlewares from '@middlewares/index';
import { RxUtil } from '@utils/index';

const rxFetchListBookingAsync = async (pageIndex, pageSize, domain = null) => {
    const pagingStr = `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const result = await RxUtil(
        `${Rx.BOOKING.GET_ALL_BOOKING}${pagingStr}`,
        'GET',
        null, domain
    );
    return result;
};

const fetchListBookingAsync = async (pageIndex = 1, pageSize = 100) => {
    let result = await rxFetchListBookingAsync(pageIndex, pageSize);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchListBookingAsync(pageIndex, pageSize, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchListBookingAsPartnerAsync = async (pageIndex, pageSize, domain = null) => {
    const pagingStr = `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    const result = await RxUtil(
        `${Rx.BOOKING.GET_LIST_BOOKING_AS_PARTNER}${pagingStr}`,
        'GET',
        null, domain
    );
    return result;
};

const fetchListBookingAsPartnerAsync = async (pageIndex = 1, pageSize = 100) => {
    let result = await rxFetchListBookingAsPartnerAsync(pageIndex, pageSize);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchListBookingAsPartnerAsync(pageIndex, pageSize, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchPartnerInfoAsync = async (partnerId, domain = null) => {
    const result = await RxUtil(
        `${Rx.PARTNER.PARTNER_DETAIL}/${partnerId}`,
        'GET', null, domain
    );
    return result;
};

const fetchPartnerInfoAsync = async (partnerId) => {
    let result = await rxFetchPartnerInfoAsync(partnerId);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchPartnerInfoAsync(partnerId, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchBookingDetailAsync = async (bookingId, domain = null) => {
    const result = await RxUtil(
        `${Rx.BOOKING.DETAIL_BOOKING}/${bookingId}`,
        'GET',
        null, domain
    );
    return result;
};

const fetchBookingDetailAsync = async (bookingId) => {
    let result = await rxFetchBookingDetailAsync(bookingId);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchBookingDetailAsync(bookingId, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitCompleteBookingAsync = async (bookingId, domain = null) => {
    const result = await RxUtil(
        `${Rx.BOOKING.COMPLETE_BOOKING}/${bookingId}`,
        'POST',
        null, domain
    );
    return result;
};

const submitCompleteBookingAsync = async (bookingId) => {
    let result = await rxSubmitCompleteBookingAsync(bookingId);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitCompleteBookingAsync(bookingId, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitRatingAsync = async (bookingId, body, domain = null) => {
    const result = await RxUtil(
        `${Rx.BOOKING.BOOKING_RATE}/${bookingId}`,
        'POST',
        body, domain
    );
    return result;
};

const submitRatingAsync = async (bookingId, body) => {
    let result = await rxSubmitRatingAsync(bookingId, body);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitRatingAsync(bookingId, body, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitConfirmPaymentAsync = async (bookingId, domain = null) => {
    const result = await RxUtil(
        `${Rx.PAYMENT.CREATE_PAYMENT}/${bookingId}`,
        'POST', null, domain
    );
    return result;
};

const submitConfirmPaymentAsync = async (bookingId) => {
    let result = await rxSubmitConfirmPaymentAsync(bookingId);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitConfirmPaymentAsync(bookingId, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchListPartnerPackageAsync = async (partnerId, domain = null) => {
    const result = await RxUtil(
        `${Rx.BOOKING.GET_PARTNER_PACKAGE}/${partnerId}`,
        'GET', null, domain
    );
    return result;
};

const fetchListPartnerPackageAsync = async (partnerId) => {
    let result = await rxFetchListPartnerPackageAsync(partnerId);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchListPartnerPackageAsync(partnerId, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchPartnerBusyCalendarAsync = async (partnerId, domain = null) => {
    const result = await RxUtil(
        `${Rx.CALENDAR.PARTNER_CALENDAR}/${partnerId}`,
        'GET',
        null, domain
    );
    return result;
};

const fetchPartnerBusyCalendarAsync = async (partnerId) => {
    let result = await rxFetchPartnerBusyCalendarAsync(partnerId);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchPartnerBusyCalendarAsync(partnerId, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitScheduleBookingAsync = async (partnerId, body, domain = null) => {
    const result = await RxUtil(
        `${Rx.BOOKING.SCHEDULE_BOOKING}/${partnerId}`,
        'POST',
        body, domain
    );
    return result;
};

const submitScheduleBookingAsync = async (partnerId, body) => {
    let result = await rxSubmitScheduleBookingAsync(partnerId, body);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitScheduleBookingAsync(partnerId, body, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitCancelBookingAsync = async (bookingId, body, domain = null) => {
    const result = await RxUtil(
        `${Rx.BOOKING.CANCEL_BOOKING}/${bookingId}`,
        'POST',
        body,
        domain
    );
    return result;
};

const submitCancelBookingAsync = async (bookingId, body) => {
    let result = await rxSubmitCancelBookingAsync(bookingId, body);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitCancelBookingAsync(bookingId, body, handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxFetchListPartnerAsync = async (domain = null) => {
    const result = await RxUtil(
        `${Rx.PARTNER.GET_LIST_PARTNER}?pageIndex=1&pageSize=50`,
        'GET', null, domain
    );
    return result;
};

const fetchListPartnerAsync = async () => {
    let result = await rxFetchListPartnerAsync();

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxFetchListPartnerAsync(handledResult.backupDomain);
    }

    return CommonHelpers.handleResByStatus(result);
};

const rxSubmitConfirmAcceptAsync = async (bookingId) => {
    const result = await RxUtil(
        `${Rx.BOOKING.PARTNER_CONFIRM_BOOKING}/${bookingId}`,
        'POST'
    );
    return result;
};

const submitConfirmAcceptAsync = async (bookingId) => {
    let result = await rxSubmitConfirmAcceptAsync(bookingId);

    const handledResult = await Middlewares.handleResponseStatusMiddleware(result);
    if (handledResult) {
        result = await rxSubmitConfirmAcceptAsync(bookingId);
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
    fetchListPartnerAsync,
    submitConfirmAcceptAsync,
    fetchListBookingAsPartnerAsync
};
