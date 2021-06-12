import { Block, Text } from 'galio-framework';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert, RefreshControl, ScrollView, StyleSheet
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import {
    CenterLoader, CustomButton, CustomInput, CustomModal, Line
} from '../../components/uiComponents';
import {
    BookingStatus, NowTheme, Rx, ScreenName
} from '../../constants';
import BookingProgressFlow from '../../containers/BookingProgressFlow';
import { ToastHelpers } from '../../helpers';
import { setPersonTabActiveIndex, setShowLoaderStore } from '../../redux/Actions';
import { rxUtil } from '../../utils';
import CardBooking from '../Personal/BookingList/CardBooking';
import ReasonCancelBookingModal from './ReasonCancelBookingModal';

const { FONT, SIZES, COLORS } = NowTheme;

export default function BookingDetail({
    route: {
        params: {
            from,
            bookingId
        }
    },
    navigation
}) {
    const [booking, setBooking] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [modalRatingVisible, setModalRatingVisible] = useState(false);
    const [modalReportVisible, setModalReportVisible] = useState(false);
    const [modalReasonVisible, setModalReasonVisible] = useState(false);
    const [ratingValue, setRatingValue] = useState(4);
    const [reportDesc, setReportDesc] = useState();

    const token = useSelector((state) => state.userReducer.token);
    const showLoaderStore = useSelector((state) => state.appConfigReducer.showLoaderStore);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    useEffect(
        () => {
            fetchBookingDetailInfo();
            const eventTriggerGetBookingDetail = navigation.addListener('focus', () => {
                if (from === ScreenName.CREATE_BOOKING) {
                    fetchBookingDetailInfo();
                }
            });

            return eventTriggerGetBookingDetail;
        }, []
    );

    useEffect(
        () => {
            if (isSignInOtherDeviceStore) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenName.SIGN_IN_WITH_OTP }],
                });
            }
        }, [isSignInOtherDeviceStore]
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchBookingDetailInfo();
    };

    const fetchBookingDetailInfo = () => {
        rxUtil(
            `${Rx.BOOKING.DETAIL_BOOKING}/${bookingId}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                console.log('res.data.data :>> ', res.data.data);
                setBooking(res.data.data);
                setRefreshing(false);
                dispatch(setShowLoaderStore(false));
            },
            (res) => {
                setRefreshing(false);
                dispatch(setShowLoaderStore(false));
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                setRefreshing(false);
                dispatch(setShowLoaderStore(false));
                ToastHelpers.renderToast(res.data.message, 'error');
            }
        );
    };

    const onClickCompleteBooking = () => {
        dispatch(setShowLoaderStore(true));

        renderAlertRatingReport();

        rxUtil(
            `${Rx.BOOKING.COMPLETE_BOOKING}/${bookingId}`,
            'POST',
            null,
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                navigation.navigate(ScreenName.PERSONAL);
                dispatch(setPersonTabActiveIndex(2));
                dispatch(setShowLoaderStore(false));
            },
            (res) => {
                ToastHelpers.renderToast();
                dispatch(setShowLoaderStore(false));
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                ToastHelpers.renderToast(res, 'error');
                dispatch(setShowLoaderStore(false));
            }
        );
    };

    const sendRating = () => {
        rxUtil(
            `${Rx.BOOKING.BOOKING_RATE}/${bookingId}`,
            'POST',
            {
                score: reportDesc ? 2 : ratingValue,
                description: reportDesc || 'Rating'
            },
            {
                Authorization: token
            },
            (res) => ToastHelpers.renderToast(res.data.message, 'success'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error'),
            (res) => ToastHelpers.renderToast(res.data.message, 'error')
        );
    };

    const onChangeReport = (reportInput) => {
        setReportDesc(reportInput);
    };

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
        // partner confirmed: payment, cancel
        // customer payment: cancel
        // booking is going on: N/A
        // booking done: complete => report/rating
        if (isBookingGoingOn() || booking.status === BookingStatus.CANCEL) return null;

        if (isBookingDone()) {
            return (
                renderCompleteBookingButton(0.9)
            );
        }

        if (booking.isConfirm) {
            if (booking.status === BookingStatus.SCHEDULING) {
                return (
                    <>
                        {renderCancelBooking(0.44)}
                        {renderConfirmPaymentButton(0.44)}
                    </>
                );
            }

            if (booking.status === BookingStatus.FINISH_PAYMENT) {
                return (
                    renderCancelBooking(0.9)
                );
            }
        }

        return null;
    };

    const onCustomerConfirmPayment = () => {
        dispatch(setShowLoaderStore(true));

        rxUtil(
            `${Rx.PAYMENT.CREATE_PAYMENT}/${bookingId}`,
            'POST',
            null,
            {
                Authorization: token
            },
            (res) => {
                navigation.navigate(ScreenName.PERSONAL);
                dispatch(setPersonTabActiveIndex(2));
                ToastHelpers.renderToast(res.message || 'Thao tác thành công.', 'success');
            },
            (res) => {
                ToastHelpers.renderToast();
                dispatch(setShowLoaderStore(false));
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                dispatch(setShowLoaderStore(false));
            }
        );
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    const renderAlertRatingReport = () => (
        Alert.alert(
            'Cảm ơn <3',
            'Bạn vui lòng đánh giá hoặc báo cáo về đối tác của chúng tôi.',
            [
                {
                    text: 'Đánh giá',
                    onPress: () => {
                        setModalRatingVisible(true);
                    },
                    style: 'cancel'
                },
                {
                    text: 'Báo cáo',
                    onPress: () => {
                        setModalReportVisible(true);
                    },
                }
            ],
            { cancelable: false }
        )
    );

    const renderRatingModal = () => (
        <CustomModal
            modalVisible={modalRatingVisible}
            renderContent={() => (
                <>
                    <Text
                        size={SIZES.FONT_H2}
                        style={{
                            fontFamily: FONT.MONTSERRAT_REGULAR,
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.8
                        }}
                    >
                        Bạn vui lòng góp ý để chúng tôi phục vụ bạn tốt hơn, cảm ơn.
                    </Text>
                    <Block
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8
                        }}
                    >
                        <AirbnbRating
                            count={5}
                            reviewSize={25}
                            reviews={['Tệ', 'Không ổn', 'Bình thường', 'Tốt', 'Tuyệt vời <3']}
                            defaultRating={ratingValue}
                            size={25}
                            onFinishRating={(ratingNumber) => {
                                setRatingValue(ratingNumber);
                            }}
                        />
                    </Block>

                    <Block center>
                        <CustomButton
                            onPress={() => {
                                sendRating();
                                setModalRatingVisible(false);
                            }}
                            type="active"
                            label="Gửi đánh giá"
                        />
                    </Block>
                </>
            )}
        />
    );

    const renderReportModal = () => (
        <CustomModal
            modalVisible={modalReportVisible}
            renderContent={() => (
                <>
                    <Text
                        size={SIZES.FONT_H2}
                        style={{
                            fontFamily: FONT.MONTSERRAT_REGULAR,
                            marginVertical: 10
                        }}
                    >
                        Vui lòng nhập ý kiến
                    </Text>

                    <CustomInput
                        multiline
                        onChangeText={(reportInput) => onChangeReport(reportInput)}
                        value={reportDesc}
                        inputStyle={[styles.inputWith, {
                            borderRadius: 5,
                        }]}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.8
                        }}
                        placeholder="Nhập mô tả..."
                    />
                    <Block center>
                        <CustomButton
                            onPress={() => {
                                sendRating();
                                setModalReportVisible(false);
                            }}
                            type="active"
                            label="Gửi báo cáo"
                        />
                    </Block>
                </>
            )}
        />
    );

    const renderCompleteBookingButton = (width) => (
        <CustomButton
            nPress={() => {
                onClickCompleteBooking();
            }}
            buttonStyle={{
                width: SIZES.WIDTH_BASE * (+width)
            }}
            type="active"
            label="Hoàn tất buổi hẹn"
        />
    );

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

    const renderConfirmPaymentButton = (width) => (
        <CustomButton
            onPress={() => {
                onCustomerConfirmPayment(bookingId);
            }}
            buttonStyle={{
                width: SIZES.WIDTH_BASE * (+width)
            }}
            type="active"
            label="Thanh toán"
        />
    );

    try {
        return (
            <>
                {showLoaderStore || !booking ? (
                    <CenterLoader />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={(
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => onRefresh()}
                            />
                        )}
                        contentContainerStyle={{
                            paddingBottom: 10
                        }}
                    >
                        {renderRatingModal()}
                        {renderReportModal()}

                        <ReasonCancelBookingModal
                            modalReasonVisible={modalReasonVisible}
                            setModalReasonVisible={setModalReasonVisible}
                            bookingId={bookingId}
                            navigation={navigation}
                        />

                        <Block style={{
                            width: SIZES.WIDTH_BASE * 0.9,
                            alignSelf: 'center',
                            marginTop: 10,
                        }}
                        >
                            <Text style={{
                                fontFamily: FONT.MONTSERRAT_REGULAR,
                            }}
                            >
                                CHI TIẾT ĐƠN HẸN
                            </Text>
                            <Line
                                borderWidth={0.5}
                                borderColor={COLORS.ACTIVE}
                                style={{
                                    marginTop: 10
                                }}
                            />

                            <CardBooking
                                booking={booking}
                                navigation={navigation}
                            />

                            <BookingProgressFlow
                                status={booking.status}
                                partner={booking.partner}
                                booking={booking}
                            />

                            <Text style={{
                                fontFamily: FONT.MONTSERRAT_REGULAR,
                            }}
                            >
                                GHI CHÚ CUỘC HẸN
                            </Text>
                            <Line
                                borderWidth={0.5}
                                borderColor={COLORS.ACTIVE}
                                style={{
                                    marginVertical: 20
                                }}
                            />
                            <Text
                                color={COLORS.DEFAULT}
                                size={SIZES.FONT_H3}
                                style={styles.subTitle}
                            >
                                {booking.noted}
                            </Text>

                            <Block
                                center
                                row
                                style={{
                                    width: SIZES.WIDTH_BASE * 0.9
                                }}
                                space="between"
                            >
                                {handleShowButtonByStatus()}
                            </Block>
                        </Block>
                    </ScrollView>
                )}
            </>
        );
    } catch (exception) {
        console.log('exception :>> ', exception);
        return (
            <>
                {ToastHelpers.renderToast()}
            </>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontFamily: FONT.MONTSERRAT_BOLD,
        marginBottom: 20
    },
    subTitle: {
        fontFamily: FONT.MONTSERRAT_REGULAR,
        marginBottom: 10
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: SIZES.WIDTH_BASE * 0.5,
        width: SIZES.WIDTH_BASE * 0.9,
        marginBottom: 10
    },
    inputWith: {
        width: SIZES.WIDTH_BASE * 0.9,
    },
});
