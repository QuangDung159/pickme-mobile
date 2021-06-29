import {
    CenterLoader, CustomButton, CustomCheckbox, CustomInput, CustomModal
} from '@components/uiComponents';
import {
    BookingStatus, NowTheme, ScreenName
} from '@constants/index';
import BookingProgressFlow from '@containers/BookingProgressFlow';
import { ToastHelpers } from '@helpers/index';
import {
    setListBookingStore,
    setPersonTabActiveIndex,
    setShowLoaderStore
} from '@redux/Actions';
import { BookingServices } from '@services/index';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View
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

    const showLoaderStore = useSelector((state) => state.appConfigReducer.showLoaderStore);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

    // handler \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    useEffect(
        () => {
            dispatch(setShowLoaderStore(true));
            fetchBookingDetailInfo();

            const eventTriggerGetBookingDetail = navigation.addListener('focus', () => {
                if (from === ScreenName.CREATE_BOOKING) {
                    dispatch(setShowLoaderStore(true));
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

    const fetchBookingDetailInfo = async () => {
        const result = await BookingServices.fetchBookingDetailAsync(bookingId);
        const { data } = result;

        if (data) {
            setBooking(data.data);
        }

        setRefreshing(false);
        dispatch(setShowLoaderStore(false));
    };

    const onClickCompleteBooking = async () => {
        dispatch(setShowLoaderStore(true));
        const result = await BookingServices.submitCompleteBookingAsync(bookingId);
        const { data } = result;

        if (data) {
            renderAlertRatingReport();
        }

        dispatch(setShowLoaderStore(false));
    };

    const sendRating = async () => {
        const result = await BookingServices.submitRatingAsync({
            bookingId,
            description: ratingDesc || 'Rating',
            enthusiasm,
            professional,
            onTime,
            possitive,
            isRecomendForFriends
        });

        const { data } = result;
        if (data) {
            ToastHelpers.renderToast(data.message, 'success');
        }
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
        const { status } = booking;
        // partner confirmed: payment, cancel
        // customer payment: cancel
        // booking is going on: N/A
        // booking done: complete => report/rating
        if (isBookingGoingOn() || status === BookingStatus.CANCEL) return null;

        if (isBookingDone()) {
            return (
                renderCompleteBookingButton(0.9)
            );
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
        dispatch(setShowLoaderStore(true));
        const result = await BookingServices.submitConfirmPaymentAsync(bookingId);
        const { data } = result;

        if (data) {
            navigation.navigate(ScreenName.PERSONAL);
            dispatch(setPersonTabActiveIndex(2));
            fetchListBooking();
            ToastHelpers.renderToast(data.message || 'Thao tác thành công.', 'success');
        }
        dispatch(setShowLoaderStore(false));
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
                            fontSize: SIZES.FONT_H2,
                            color: COLORS.DEFAULT
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
                            fontSize: SIZES.FONT_H2,
                            color: COLORS.DEFAULT
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
            <SafeAreaView
                style={{
                    flex: 1
                }}
            >
                {showLoaderStore ? (
                    <CenterLoader />
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={(
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => onRefresh()}
                                tintColor={COLORS.ACTIVE}
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

                        {booking && (
                            <View
                                style={{
                                    alignSelf: 'center',
                                    marginTop: 5,
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: COLORS.BLOCK,
                                        width: SIZES.WIDTH_BASE
                                    }}
                                >
                                    <CardBooking
                                        booking={booking}
                                        navigation={navigation}
                                    />
                                </View>

                                <View
                                    style={{
                                        backgroundColor: COLORS.BLOCK,
                                        marginTop: 5,
                                        alignContent: 'center'
                                    }}
                                >
                                    <View
                                        style={{
                                            width: SIZES.WIDTH_BASE * 0.9,
                                            alignSelf: 'center',
                                        }}
                                    >
                                        <Text
                                            style={
                                                [
                                                    styles.subTitle,
                                                    {
                                                        color: COLORS.DEFAULT,
                                                        fontSize: SIZES.FONT_H3,
                                                        marginVertical: 20
                                                    }
                                                ]
                                            }
                                        >
                                            {booking.noted}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        backgroundColor: COLORS.BLOCK,
                                        marginTop: 5,
                                    }}
                                >
                                    <BookingProgressFlow
                                        status={booking.status}
                                        partner={booking.partner}
                                        booking={booking}
                                    />
                                </View>

                                {handleShowButtonByStatus() && (
                                    <View
                                        style={{
                                            backgroundColor: COLORS.BLOCK,
                                            marginTop: 5
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
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
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
    },
});
