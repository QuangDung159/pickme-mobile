import {
    SET_CURRENT_BOOKING_REDUX,
    SET_LIST_PARTNER_HOME_REDUX
} from '../ActionTypes';

const initState = {
    currentBookingRedux: null
};

const bookingReducer = (state = initState, action) => {
    const { type, payload } = action;
    switch (type) {
        case SET_CURRENT_BOOKING_REDUX: {
            return { ...state, currentBookingRedux: payload.currentBookingRedux };
        }
        case SET_LIST_PARTNER_HOME_REDUX: {
            return { ...state, listPartnerHomeRedux: payload.listPartnerHomeRedux };
        }
        default: {
            return state;
        }
    }
};

export default bookingReducer;
