export default {
    CALENDAR: {
        MY_CALENDAR: '/Calendars/MyCalendar',
        ADD_CALENDAR: '/Calendars/AddCalendar',
        PARTNER_CALENDAR: '/Calendars/PartnerCalendar'
    },
    AUTHENTICATION: {
        SIGN_UP: '/users/register',
        LOGIN: '/users/CustomerLogin',
    },
    USER: {
        CURRENT_USER_INFO: '/users/currentuserinfo',
        UPDATE_AVATAR: '/Users/UpdateAvatar',
        UPDATE_USER_INFO: '/users/UpdateUserInfo',
        GET_LIST_IMAGE_BY_USER: '/Users/MyPosts',
        UPLOAD_PROFILE_IMAGE: '/Users/UploadImage',
        REMOVE_PROFILE_IMAGE: '/Users/RemovePost',
    },
    BANK: {
        BANK_ACCOUNTS: '/users/BankAccounts',
        ADD_BANK_ACCOUNT: '/Users/AddBankAccount',
        GET_LIST_BANK: '/Settings/Banks',
    },
    BOOKING: {
        SCHEDULE_BOOKING: '/bookings/ScheduleBooking',
        UDPATE_BOOKING: '/bookings/UpdateBooking',
        GET_MY_BOOKING_AS_PARTNER: '/bookings/GetMyBookingAsPartner',
        GET_LIST_BOOKING_LOCATION: '/Settings/Locations',
        GET_MY_BOOKING_AS_CUSTOMER: '/bookings/GetMyBookingAsCustomer',
        PARTNER_CONFIRM_BOOKING: '/bookings/PartnerConfirmBooking',
        CANCEL_BOOKING: '/bookings/CancelBooking',
        COMPLETE_BOOKING: '/bookings/CompleteBooking',
        DETAIL_BOOKING: '/bookings/DetailBooking',
        BOOKING_RATE: '/Ratings/Insert'
    },
    PARTNER: {
        LEADER_BOARD_DIAMOND: '/Users/LeaderBoadDiamon',
        LEADER_BOARD_LIKE: '/Users/LeaderBoadLike',
        LEADER_BOARD_BOOKING: '/Users/LeaderBoadBooking',
        PARTNER_DETAIL: '/users/PartnerDetail',
        GET_LIST_PARTNER: '/users/Partners',
    },
    CASH_REQUEST: {
        GET_LIST_CASH_IN: '/Cashs/MyCashInRequests',
        GET_LIST_CASH_OUT: '/Cashs/MyCashOutRequests',
        CREATE_CASH_OUT_REQUEST: '/cashs/CreateCashOutRequest'
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
        GET_QNA: '/Systems/GetQnAs',
        CREATE_BUG: '/Systems/CreateBug'
    }
};
