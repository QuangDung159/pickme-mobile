import {
    SET_CURRENT_BOOKING_REDUX
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
        default: {
            return state;
        }
    }
};

export default bookingReducer;
