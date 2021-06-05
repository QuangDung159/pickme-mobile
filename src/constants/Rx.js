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
        UPDATE_AVATAR: '/Users/UpdateAvatar',
        UPDATE_USER_INFO: '/users/UpdateUserInfo',
        GET_LIST_IMAGE_BY_USER: '/Users/MyPosts',
        UPLOAD_PROFILE_IMAGE: '/Users/UploadImage',
        REMOVE_PROFILE_IMAGE: '/Users/RemovePost',
        UPDATE_EXPO_TOKEN: '/Users/UpdateExpoToken',
        GET_OTP_REGISTER: '/users/CustomerRegister',
        UPLOAD_VERIFICATION_DOC: '/Users/AddVerifiDocument',
        GET_VERIFICATION_DETAIL: '/Users/VerificationRequestDetail',
        SUBMIT_VERIFICATION: '/Users/SubmitVerify',
        GENERATE_OTP_WHEN_CHANGE_DEVICE: '/users/CustomerGenerateOTPChangedDeviceId',
        SUBMIT_CHANGE_DEVICE_CONFIRM: '/users/CustomerChangedDeviceIdConfirm',
        GENERATE_OTP_WHEN_FORGOT_PASSWORD: '/users/CustomerForGotPasswordOTP',
        SUBMIT_FORGOT_PASSWORD_CONFIRM: '/users/CustomerForGotPasswordConfirm',
        SUBMIT_CHANGE_PASSWORD: '/users/changepassword',
    },
    BANK: {
        BANK_ACCOUNTS: '/users/BankAccounts',
        ADD_BANK_ACCOUNT: '/Users/AddBankAccount',
        GET_LIST_BANK: '/Settings/Banks',
    },
    BOOKING: {
        SCHEDULE_BOOKING: '/bookings/ScheduleBooking',
        UPDATE_BOOKING: '/bookings/UpdateBooking',
        GET_MY_BOOKING_AS_PARTNER: '/bookings/GetMyBookingAsPartner',
        GET_LIST_BOOKING_LOCATION: '/Locations/Locations',
        GET_MY_BOOKING_AS_CUSTOMER: '/bookings/GetMyBookingAsCustomer',
        PARTNER_CONFIRM_BOOKING: '/bookings/PartnerConfirmBooking',
        CANCEL_BOOKING: '/bookings/CancelBooking',
        COMPLETE_BOOKING: '/bookings/CompleteBooking',
        DETAIL_BOOKING: '/bookings/DetailBooking',
        BOOKING_RATE: '/Ratings/Insert'
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
        CREATE_PAYMENT: '/Payments/CreatePayment'
    },
    SYSTEM: {
        GET_QNA: '/faq',
        CREATE_BUG: '/Systems/CreateBug',
        PICK_ME_INFO: '/master'
    }
};
