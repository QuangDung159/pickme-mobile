export default {
    CALENDAR: {
        MY_CALENDAR: '/Calendars/MyCalendar',
        ADD_CALENDAR: '/Calendars/AddCalendar',
        PARTNER_CALENDAR: '/Calendars/PartnerCalendar'
    },
    AUTHENTICATION: {
        SIGN_UP: '/users/RegisterConfirm',
        LOGIN: '/users/Login',
    },
    BANK: {
        BANK_ACCOUNTS: '/users/BankAccounts',
        ADD_UPDATE_BANK_ACCOUNT: '/Users/AddOrUpdateBankAccount',
        GET_LIST_BANK: '/Banks/Banks',
    },
    USER: {
        CURRENT_USER_INFO: '/users/CurrentUserInfo',
        UPDATE_USER_INFO: '/users/UpdateUserInfo',
        UPLOAD_USER_IMAGE: '/Posts/AddPost',
        REMOVE_USER_IMAGE: '/Posts/RemovePost',
        UPDATE_EXPO_TOKEN: '/Users/UpdateExpoToken',
        GET_OTP_REGISTER: '/users/Register',
        GET_OTP_FORGOT_PASSWORD: '/users/ForGotPassword',
        ADD_VERIFY_DOCUMENT: '/Verify/AddVerifiDocument',
        GET_VERIFICATION_DETAIL: '/Verify/VerificationRequestDetail',
        SUBMIT_VERIFICATION: '/Verify/SubmitVerify',
        GENERATE_OTP_WHEN_CHANGE_DEVICE: '/Devices/CustomerGenerateOTPChangedDeviceId',
        SUBMIT_CHANGE_DEVICE_CONFIRM: '/Devices/CustomerChangedDeviceIdConfirm',
        SUBMIT_FORGOT_PASSWORD_CONFIRM: '/users/ForGotPasswordConfirm',
        SUBMIT_CHANGE_PASSWORD: '/users/changepassword',
        ADD_PACKAGE: '/UserPackages/AddPackage',
        UPDATE_PACKAGE: '/UserPackages/UpdatePackage',
        REPORT_USER: '/Reports/Report',
        UPDATE_PARTNER_INFO: '/users/UpdatePartnerInfo'
    },
    BOOKING: {
        SCHEDULE_BOOKING: '/bookings/ScheduleBooking',
        UPDATE_BOOKING: '/bookings/UpdateBooking',
        GET_LIST_BOOKING_LOCATION: '/Locations/Locations',
        GET_LIST_BOOKING_AS_CUSTOMER: '/bookings/GetMyBookingAsCustomer',
        GET_LIST_BOOKING_AS_PARTNER: '/bookings/GetMyBookingAsPartner',
        PARTNER_CONFIRM_BOOKING: '/bookings/PartnerConfirmBooking',
        CANCEL_BOOKING: '/bookings/CancelBooking',
        COMPLETE_BOOKING: '/bookings/CompleteBooking',
        DETAIL_BOOKING: '/bookings/DetailBooking',
        BOOKING_RATE: '/Ratings/Insert',
        GET_PARTNER_PACKAGE: '/UserPackages/Packages',
        GET_ALL_BOOKING: '/bookings/GetBookings'
    },
    PARTNER: {
        LEADER_BOARD_DIAMOND: '/diamon',
        LEADER_BOARD_BOOKING: '/booking',
        PARTNER_DETAIL: '/users/PartnerDetail',
        GET_LIST_PARTNER: '/users/Partners',
    },
    CASH: {
        GET_CASH_HISTORY: '/users/UserHistories',
        CREATE_CASH_OUT_REQUEST: '/CashOuts/CreateCashOutRequest',
    },
    NOTIFICATION: {
        GET_MY_NOTIFICATION: '/Notifications/Notifications',
        TRIGGER_READ: '/Notifications/Read',
        TRIGGER_READ_ALL: '/Notifications/ReadAll'
    },
    PAYMENT: {
        CREATE_PAYMENT: '/bookings/CustomerMakePayment'
    },
    SYSTEM: {
        CREATE_BUG: '/Systems/CreateBug',
    }
};
