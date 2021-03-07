import { SET_LIST_BOOKING_LOCATION } from '../ActionTypes';

const initState = {
    listBookingLocation: []
};

const locationReducer = (state = initState, action) => {
    const { payload, type } = action;
    switch (type) {
        case SET_LIST_BOOKING_LOCATION: {
            return { ...state, listBookingLocation: payload.listBookingLocation };
        }
        default: {
            return state;
        }
    }
};

export default locationReducer;
