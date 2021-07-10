import {
    CenterLoader
} from '@components/uiComponents';
import { NowTheme, ScreenName } from '@constants/index';
import BookingProgressFlow from '@containers/BookingProgressFlow';
import { ToastHelpers } from '@helpers/index';
import {
    setListBookingStore, setShowLoaderStore
} from '@redux/Actions';
import { BookingServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import {
    Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ButtonPanel from './ButtonPanel';
import CardBooking from './CardBooking';
import RatingModal from './RatingModal';
import ReasonCancelBookingModal from './ReasonCancelBookingModal';
import ReportModal from './ReportModal';

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
                        <RatingModal
                            modalRatingVisible={modalRatingVisible}
                            setModalRatingVisible={setModalRatingVisible}
                        />

                        <ReportModal
                            modalReportVisible={modalReportVisible}
                            setModalReportVisible={setModalReportVisible}
                        />

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

                                <ButtonPanel
                                    booking={booking}
                                    setModalReasonVisible={setModalReasonVisible}
                                    navigation={navigation}
                                    fetchListBooking={fetchListBooking}
                                    renderAlertRatingReport={renderAlertRatingReport}
                                />
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
