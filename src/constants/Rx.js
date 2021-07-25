export default {
    CALENDAR: {
        MY_CALENDAR: '/Calendars/MyCalendar',
        ADD_CALENDAR: '/Calendars/AddCalendar',
        PARTNER_CALENDAR: '/Calendars/PartnerCalendar'
    },
    AUTHENTICATION: {
        SIGN_UP: '/users/CustomerRegisterConfirm',
        LOGIN: '/users/CustomerLogin',
    },
    USER: {
        CURRENT_USER_INFO: '/users/CurrentCustomerInfo',
        UPDATE_USER_INFO: '/users/UpdateCustomerInfo',
        UPLOAD_USER_IMAGE: '/Posts/AddPost',
        REMOVE_USER_IMAGE: '/Posts/RemovePost',
        UPDATE_EXPO_TOKEN: '/Users/UpdateExpoToken',
        GET_OTP_REGISTER: '/users/CustomerRegister',
        ADD_VERIFY_DOCUMENT: '/Verify/AddVerifiDocument',
        GET_VERIFICATION_DETAIL: '/Verify/VerificationRequestDetail',
        // SUBMIT_VERIFICATION: '/Verify/SubmitVerify',
        GENERATE_OTP_WHEN_CHANGE_DEVICE: '/Devices/CustomerGenerateOTPChangedDeviceId',
        SUBMIT_CHANGE_DEVICE_CONFIRM: '/Devices/CustomerChangedDeviceIdConfirm',
        GENERATE_OTP_WHEN_FORGOT_PASSWORD: '/users/CustomerForGotPasswordOTP',
        SUBMIT_FORGOT_PASSWORD_CONFIRM: '/users/CustomerForGotPasswordConfirm',
        SUBMIT_CHANGE_PASSWORD: '/users/changepassword',
        REPORT_USER: '/Reports/Report',
    },
    BANK: {
        BANK_ACCOUNTS: '/users/BankAccounts',
        ADD_BANK_ACCOUNT: '/Users/AddBankAccount',
        GET_LIST_BANK: '/Settings/Banks',
    },
    BOOKING: {
        SCHEDULE_BOOKING: '/bookings/ScheduleBooking',
        UPDATE_BOOKING: '/bookings/UpdateBooking',
        GET_LIST_BOOKING_LOCATION: '/Locations/Locations',
        GET_LIST_BOOKING: '/bookings/GetMyBookingAsCustomer',
        PARTNER_CONFIRM_BOOKING: '/bookings/PartnerConfirmBooking',
        CANCEL_BOOKING: '/bookings/CancelBooking',
        COMPLETE_BOOKING: '/bookings/CompleteBooking',
        DETAIL_BOOKING: '/bookings/DetailBooking',
        BOOKING_RATE: '/Ratings/Insert',
        GET_PARTNER_PACKAGE: '/UserPackages/Packages'
    },
    PARTNER: {
        LEADER_BOARD_DIAMOND: '/diamon',
        LEADER_BOARD_BOOKING: '/booking',
        PARTNER_DETAIL: '/users/PartnerDetail',
        GET_LIST_PARTNER: '/users/Partners',
    },
    CASH: {
        GET_CASH_HISTORY: '/users/UserHistories'
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
        PICK_ME_INFO: '/master',
    }
};
