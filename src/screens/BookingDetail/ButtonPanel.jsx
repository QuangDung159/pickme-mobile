import { CustomButton } from '@components/uiComponents';
import { BookingStatus, Theme } from '@constants/index';
import ToastHelpers from '@helpers/ToastHelpers';
import { setCurrentBookingRedux, setShowLoaderStore } from '@redux/Actions';
import BookingServices from '@services/BookingServices';
import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const {
    SIZES,
    COLORS
} = Theme;

export default function ButtonPanel({
    setModalReasonVisible, bookingId,
    setModalReportVisible, setModalRatingVisible
}) {
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const currentBookingRedux = useSelector((state) => state.bookingReducer.currentBookingRedux);

    const dispatch = useDispatch();

    const convertMinutesToUnix = (minutes) => moment(currentBookingRedux.date)
        .startOf('day')
        .add(minutes, 'minutes')
        .unix();

    const isBookingGoingOn = () => {
        const currentUnix = moment().unix();
        const startTimestamp = convertMinutesToUnix(currentBookingRedux.startAt);
        const endTimestamp = convertMinutesToUnix(currentBookingRedux.endAt);

        return startTimestamp <= currentUnix && currentUnix <= endTimestamp;
    };

    const isBookingDone = () => {
        const currentUnix = moment().unix();
        const endTimestamp = convertMinutesToUnix(currentBookingRedux.endAt);

        return endTimestamp < currentUnix;
    };

    const fetchBookingDetailInfo = async () => {
        const result = await BookingServices.fetchBookingDetailAsync(bookingId);
        const { data } = result;

        if (data) {
            dispatch(setCurrentBookingRedux(data.data));
        }
        dispatch(setShowLoaderStore(false));
    };

    const onPartnerConfirmBooking = async () => {
        dispatch(setShowLoaderStore(true));

        const result = await BookingServices.submitConfirmAcceptAsync(currentBookingRedux.id);
        const { data } = result;

        if (data) {
            ToastHelpers.renderToast(data.message || 'Xác nhận thành công.', 'success');
            fetchBookingDetailInfo();
        }
        dispatch(setShowLoaderStore(false));
    };

    const handleShowButtonByStatus = () => {
        const { status, id } = currentBookingRedux;

        // is host
        // booking scheduled: confirm/cancel
        // booking is going on: N/A
        // booking done: complete => report/rating

        // is customer
        // booking scheduled: cancel
        // booking is going on: N/A
        // booking done: complete => report/rating

        if (isBookingGoingOn() || status === BookingStatus.CANCEL) return null;

        if (isBookingDone()) {
            return renderRatingReportBooking();
        }

        if (currentBookingRedux.partnerId === currentUser.id
            && currentBookingRedux.status === BookingStatus.SCHEDULED) {
            return (
                <>
                    <CustomButton
                        onPress={() => {
                            setModalReasonVisible(true);
                        }}
                        type="default"
                        label="Huỷ hẹn"
                    />
                    <CustomButton
                        onPress={() => {
                            onPartnerConfirmBooking(id);
                        }}
                        type="active"
                        label="Xác nhận"
                    />
                </>
            );
        }

        return renderCancelBooking(0.9);

        // if (currentBookingRedux.customerId === currentUser.id && status === BookingStatus.CONFIRMED) {
        //     return (
        //         <>
        //             {renderCancelBooking(0.44)}
        //             {renderConfirmPaymentButton(0.44)}
        //         </>
        //     );
        // }

        // if (status === BookingStatus.PAID) {
        //     return (
        //         renderCancelBooking(0.9)
        //     );
        // }

        // return null;
    };

    // const onCustomerConfirmPayment = async () => {
    //     const { walletAmount } = currentUser;
    //     if (walletAmount < currentBookingRedux.totalAmount) {
    //         ToastHelpers.renderToast('Số dư không đủ');
    //         return;
    //     }

    //     dispatch(setShowLoaderStore(true));
    //     const result = await BookingServices.submitConfirmPaymentAsync(currentBookingRedux.id);
    //     const { data } = result;

    //     if (data) {
    //         navigation.navigate(ScreenName.PERSONAL);
    //         dispatch(setPersonTabActiveIndex(2));
    //         fetchListBooking();
    //         ToastHelpers.renderToast(data.message || 'Thao tác thành công.', 'success');
    //     }
    //     dispatch(setShowLoaderStore(false));
    // };

    const renderRatingReportBooking = () => {
        if (currentBookingRedux.isRated) {
            return renderReportButton(0.9);
        }
        return (
            <>
                {renderReportButton(0.44)}
                {renderRatingButton(0.44)}
            </>
        );
    };

    const renderCancelBooking = (width) => (
        <CustomButton
            onPress={() => {
                setModalReasonVisible(true);
            }}
            buttonStyle={{
                width: SIZES.WIDTH_BASE * (+width)
            }}
            type="default"
            label="Huỷ buổi hẹn"
        />
    );

    const renderReportButton = (width) => (
        <CustomButton
            onPress={() => {
                setModalReportVisible(true);
            }}
            buttonStyle={{
                width: SIZES.WIDTH_BASE * (+width)
            }}
            type="default"
            label="Báo cáo"
        />
    );

    const renderRatingButton = (width) => (
        <CustomButton
            onPress={() => {
                setModalRatingVisible(true);
            }}
            buttonStyle={{
                width: SIZES.WIDTH_BASE * (+width)
            }}
            type="active"
            label="Đánh giá"
        />
    );

    // const renderConfirmPaymentButton = (width) => (
    //     <CustomButton
    //         onPress={() => {
    //             onCustomerConfirmPayment(currentBookingRedux.id);
    //         }}
    //         buttonStyle={{
    //             width: SIZES.WIDTH_BASE * (+width)
    //         }}
    //         type="active"
    //         label="Thanh toán"
    //     />
    // );

    const renderButtonPanel = () => (
        <View
            style={{
                backgroundColor: COLORS.BASE,
                marginTop: 5,
                borderTopWidth: 0.5,
                borderTopColor: COLORS.ACTIVE
            }}
        >
            <View
                style={{
                    width: SIZES.WIDTH_BASE * 0.9,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 20
                }}
            >
                {handleShowButtonByStatus()}
            </View>
        </View>
    );

    return (
        <>
            {renderButtonPanel()}
        </>
    );
}
