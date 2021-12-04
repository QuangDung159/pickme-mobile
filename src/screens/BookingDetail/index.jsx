import {
    CenterLoader
} from '@components/uiComponents';
import { ScreenName, Theme } from '@constants/index';
import BookingProgressFlow from '@containers/BookingProgressFlow';
import { ToastHelpers } from '@helpers/index';
import {
    setCurrentBookingRedux, setListBookingStore, setPersonTabActiveIndex, setShowLoaderStore
} from '@redux/Actions';
import { BookingServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import {
    RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ButtonPanel from './ButtonPanel';
import CardBooking from './CardBooking';
import RatingModal from './RatingModal';
import ReasonCancelBookingModal from './ReasonCancelBookingModal';
import ReportModal from './ReportModal';

const {
    FONT: {
        TEXT_REGULAR,
    },
    SIZES,
    COLORS
} = Theme;

export default function BookingDetail({
    route: {
        params: {
            from,
            bookingId
        }
    },
    navigation
}) {
    const [refreshing, setRefreshing] = useState(false);
    const [modalRatingVisible, setModalRatingVisible] = useState(false);
    const [modalReportVisible, setModalReportVisible] = useState(false);
    const [modalReasonVisible, setModalReasonVisible] = useState(false);

    const showLoaderStore = useSelector((state) => state.appConfigReducer.showLoaderStore);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);
    const currentBookingRedux = useSelector((state) => state.bookingReducer.currentBookingRedux);

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
        const res = await BookingServices.fetchListBookingAsync();
        if (res.data) {
            dispatch(setListBookingStore(res.data.data));
        }

        setRefreshing(false);
        dispatch(setShowLoaderStore(false));
    };

    const fetchBookingDetailInfo = async () => {
        const result = await BookingServices.fetchBookingDetailAsync(bookingId);
        const { data } = result;

        if (data) {
            dispatch(setCurrentBookingRedux(data.data));
        }

        setRefreshing(false);
        dispatch(setShowLoaderStore(false));
    };

    const onSendedRating = () => {
        dispatch(setShowLoaderStore(true));
        fetchBookingDetailInfo();
    };

    const onSubmitReason = () => {
        fetchListBooking();
        dispatch(setPersonTabActiveIndex(2));
    };

    // render \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
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
                    >
                        {currentBookingRedux && (
                            <>
                                <RatingModal
                                    modalRatingVisible={modalRatingVisible}
                                    setModalRatingVisible={setModalRatingVisible}
                                    bookingId={currentBookingRedux.id}
                                    onSendedRating={onSendedRating}
                                />

                                <ReportModal
                                    modalReportVisible={modalReportVisible}
                                    setModalReportVisible={setModalReportVisible}
                                    partner={currentBookingRedux.partner}
                                />

                                <ReasonCancelBookingModal
                                    modalReasonVisible={modalReasonVisible}
                                    setModalReasonVisible={setModalReasonVisible}
                                    bookingId={bookingId}
                                    onSubmitReason={() => onSubmitReason()}
                                />

                                {currentBookingRedux && (
                                    <View
                                        style={{
                                            alignSelf: 'center',

                                        }}
                                    >
                                        <CardBooking
                                            booking={currentBookingRedux}
                                            navigation={navigation}
                                        />

                                        <View
                                            style={{
                                                width: SIZES.WIDTH_BASE * 0.9,
                                                alignSelf: 'center',
                                                borderBottomWidth: 0.5,
                                                borderBottomColor: COLORS.ACTIVE
                                            }}
                                        >
                                            <Text
                                                style={
                                                    [
                                                        styles.subTitle,
                                                        {
                                                            color: COLORS.DEFAULT,
                                                            fontSize: SIZES.FONT_H3,
                                                            marginVertical: 15
                                                        }
                                                    ]
                                                }
                                            >
                                                {currentBookingRedux.noted || 'N/a'}
                                            </Text>
                                        </View>

                                        <BookingProgressFlow />

                                        <ButtonPanel
                                            setModalReasonVisible={setModalReasonVisible}
                                            navigation={navigation}
                                            fetchListBooking={fetchListBooking}
                                            setModalReportVisible={setModalReportVisible}
                                            setModalRatingVisible={setModalRatingVisible}
                                        />
                                    </View>
                                )}
                            </>
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
    subTitle: {
        fontFamily: TEXT_REGULAR,
    },
});
