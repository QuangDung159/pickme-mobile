import {
    CenterLoader, CustomButton, CustomCheckbox, CustomInput, CustomModal, Line
} from '@components/uiComponents';
import {
    BookingStatus, NowTheme, Rx, ScreenName
} from '@constants/index';
import BookingProgressFlow from '@containers/BookingProgressFlow';
import { ToastHelpers } from '@helpers/index';
import { setListBookingStore, setPersonTabActiveIndex, setShowLoaderStore } from '@redux/Actions';
import { BookingServices } from '@services/index';
import { rxUtil } from '@utils/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert, RefreshControl, ScrollView, StyleSheet, Text, View
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import CardBooking from './CardBooking';
import ReasonCancelBookingModal from './ReasonCancelBookingModal';

const {
    FONT: {
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

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
    const [reportDesc, setReportDesc] = useState();

    const [enthusiasm, setEnthusiasm] = useState(5);
    const [onTime, setOnTime] = useState(5);
    const [possitive, setPossitive] = useState(5);
    const [professional, setProfessional] = useState(5);
    const [isRecomendForFriends, setIsRecomendForFriends] = useState(true);
    const [ratingDesc, setRatingDesc] = useState('');

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

    const fetchListBooking = async () => {
        const result = await BookingServices.fetchListBookingAsync();
        const { data } = result;

        if (data) {
            dispatch(setListBookingStore(data.data));
            dispatch(setShowLoaderStore(false));
            setRefreshing(false);
        } else {
            setRefreshing(false);
            dispatch(setShowLoaderStore(false));
        }
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
        rxUtil(
            `${Rx.BOOKING.COMPLETE_BOOKING}/${bookingId}`,
            'POST',
            null,
            {
                Authorization: token
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'success');
                renderAlertRatingReport();
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

    const sendRating = () => {
        rxUtil(
            Rx.BOOKING.BOOKING_RATE,
            'POST',
            {
                bookingId,
                description: ratingDesc || 'Rating',
                enthusiasm,
                professional,
                onTime,
                possitive,
                isRecomendForFriends
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
                fetchListBooking();
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
                },
                {
                    text: 'Đóng',
                    style: 'cancel'
                }
            ],
            { cancelable: true }
        )
    );

    const renderIsRecommendSession = () => (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 30,
            }}
        >
            <CustomCheckbox
                label={`Sẽ giới thiệu đối tác với bạn bè ${'<3'}!`}
                onChange={(checked) => {
                    setIsRecomendForFriends(checked);
                }}
                labelStyle={{
                    fontSize: SIZES.FONT_H3,
                    color: COLORS.ACTIVE
                }}
                containerStyle={{
                    width: SIZES.WIDTH_BASE * 0.8
                }}
            />
        </View>
    );

    const renderRatingItem = (label, ratingValue, setRatingValue) => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5
            }}
        >
            <Text
                style={{
                    color: COLORS.ACTIVE,
                    fontFamily: MONTSERRAT_REGULAR,
                    fontSize: SIZES.FONT_H2
                }}
            >
                {label}
            </Text>
            <AirbnbRating
                count={5}
                reviewSize={25}
                defaultRating={ratingValue}
                size={25}
                onFinishRating={(ratingNumber) => {
                    setRatingValue(ratingNumber);
                }}
                showRating={false}
            />
        </View>
    );

    const renderRatingModal = () => (
        <CustomModal
            modalVisible={modalRatingVisible}
            renderContent={() => (
                <>
                    <Text
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
                            width: SIZES.WIDTH_BASE * 0.8,
                            fontSize: SIZES.FONT_H2
                        }}
                    >
                        Bạn vui lòng góp ý để chúng tôi phục vụ bạn tốt hơn, cảm ơn.
                    </Text>
                    <View
                        style={{
                            width: SIZES.WIDTH_BASE * 0.8,
                            marginTop: 20,
                            marginBottom: 10
                        }}
                    >
                        {renderRatingItem('Hăng hái:', enthusiasm, (rating) => setEnthusiasm(rating))}
                        {renderRatingItem('Đúng giờ:', onTime, (rating) => setOnTime(rating))}
                        {renderRatingItem('Tích cực:', possitive, (rating) => setPossitive(rating))}
                        {renderRatingItem('Chuyên nghiệp:', professional, (rating) => setProfessional(rating))}
                    </View>
                    <CustomInput
                        value={ratingDesc}
                        multiline
                        onChangeText={(input) => setRatingDesc(input)}
                        containerStyle={{
                            marginBottom: 20,
                            width: SIZES.WIDTH_BASE * 0.8
                        }}
                        label="Góp ý:"
                        inputStyle={{
                            height: 80,
                        }}
                    />
                    {renderIsRecommendSession()}

                    <View
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        <CustomButton
                            onPress={() => {
                                sendRating();
                                setModalRatingVisible(false);
                            }}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.8
                            }}
                            type="active"
                            label="Gửi đánh giá"
                        />
                    </View>
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
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
                            marginVertical: 10,
                            fontSize: SIZES.FONT_H2
                        }}
                    >
                        Vui lòng nhập ý kiến
                    </Text>

                    <CustomInput
                        multiline
                        onChangeText={(reportInput) => onChangeReport(reportInput)}
                        value={reportDesc}
                        containerStyle={{
                            marginVertical: 10,
                            width: SIZES.WIDTH_BASE * 0.8
                        }}
                        inputStyle={{
                            height: 80
                        }}
                        placeholder="Nhập mô tả..."
                    />
                    <View
                        style={{
                            alignSelf: 'center'
                        }}
                    >
                        <CustomButton
                            onPress={() => {
                                sendRating();
                                setModalReportVisible(false);
                            }}
                            buttonStyle={{
                                width: SIZES.WIDTH_BASE * 0.8
                            }}
                            type="active"
                            label="Gửi báo cáo"
                        />
                    </View>
                </>
            )}
        />
    );

    const renderCompleteBookingButton = (width) => (
        <CustomButton
            onPress={() => {
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
                            fetchListBooking={() => fetchListBooking()}
                        />

                        <View
                            style={{
                                width: SIZES.WIDTH_BASE * 0.9,
                                alignSelf: 'center',
                                marginTop: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: MONTSERRAT_REGULAR,
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

                            <Text
                                style={{
                                    fontFamily: MONTSERRAT_REGULAR,
                                }}
                            >
                                GHI CHÚ CUỘC HẸN
                            </Text>
                            <Line
                                borderWidth={0.5}
                                borderColor={COLORS.ACTIVE}
                                style={{
                                    marginVertical: 10
                                }}
                            />
                            <Text
                                style={
                                    [
                                        styles.subTitle,
                                        {
                                            color: COLORS.DEFAULT,
                                            fontSize: SIZES.FONT_H3,
                                            marginBottom: 20
                                        }
                                    ]
                                }
                            >
                                {booking.noted}
                            </Text>

                            <BookingProgressFlow
                                status={booking.status}
                                partner={booking.partner}
                                booking={booking}
                            />

                            <View
                                style={{
                                    width: SIZES.WIDTH_BASE * 0.9,
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {handleShowButtonByStatus()}
                            </View>
                        </View>
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
        fontFamily: MONTSERRAT_BOLD,
        marginBottom: 20
    },
    subTitle: {
        fontFamily: MONTSERRAT_REGULAR,
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
});
