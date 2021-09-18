import { CustomButton } from '@components/uiComponents';
import { BookingStatus, ScreenName, Theme } from '@constants/index';
import ToastHelpers from '@helpers/ToastHelpers';
import { setPersonTabActiveIndex, setShowLoaderStore } from '@redux/Actions';
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
    booking, setModalReasonVisible, navigation, fetchListBooking,
    setModalReportVisible, setModalRatingVisible
}) {
    const currentUser = useSelector((state) => state.userReducer.currentUser);

    const dispatch = useDispatch();

    const convertMinutesToUnix = (minutes) => moment(booking.date)
        .startOf('day')
        .add(minutes, 'minutes')
        .unix();

    const isBookingGoingOn = () => {
        const currentUnix = moment().unix();
        const startTimestamp = convertMinutesToUnix(booking.startAt);
        const endTimestamp = convertMinutesToUnix(booking.endAt);

        return startTimestamp <= currentUnix && currentUnix <= endTimestamp;
    };

    const isBookingDone = () => {
        const currentUnix = moment().unix();
        const endTimestamp = convertMinutesToUnix(booking.endAt);

        return endTimestamp < currentUnix;
    };

    const handleShowButtonByStatus = () => {
        const { status } = booking;
        // partner confirmed: payment, cancel
        // customer payment: cancel
        // booking is going on: N/A
        // booking done: complete => report/rating
        if (isBookingGoingOn() || status === BookingStatus.CANCEL) return null;

        if (isBookingDone()) {
            return renderRatingReportBooking();
        }

        if (status === BookingStatus.IS_CONFIRMED) {
            return (
                <>
                    {renderCancelBooking(0.44)}
                    {renderConfirmPaymentButton(0.44)}
                </>
            );
        }

        if (status === BookingStatus.PAID) {
            return (
                renderCancelBooking(0.9)
            );
        }

        return null;
    };

    const onCustomerConfirmPayment = async () => {
        const { walletAmount } = currentUser;
        if (walletAmount < booking.totalAmount) {
            ToastHelpers.renderToast('Số dư không đủ');
            return;
        }

        dispatch(setShowLoaderStore(true));
        const result = await BookingServices.submitConfirmPaymentAsync(booking.id);
        const { data } = result;

        if (data) {
            navigation.navigate(ScreenName.PERSONAL);
            dispatch(setPersonTabActiveIndex(2));
            fetchListBooking();
            ToastHelpers.renderToast(data.message || 'Thao tác thành công.', 'success');
        }
        dispatch(setShowLoaderStore(false));
    };

    const renderRatingReportBooking = () => {
        if (booking.isRated) {
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

    const renderConfirmPaymentButton = (width) => (
        <CustomButton
            onPress={() => {
                onCustomerConfirmPayment(booking.id);
            }}
            buttonStyle={{
                width: SIZES.WIDTH_BASE * (+width)
            }}
            type="active"
            label="Thanh toán"
        />
    );

    const renderButtonPanel = () => (
        <>
            {handleShowButtonByStatus() && (
                <View
                    style={{
                        backgroundColor: COLORS.BLOCK,
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
            )}
        </>
    );
    return (
        <>
            {renderButtonPanel()}
        </>
    );
}
