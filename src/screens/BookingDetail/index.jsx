import {
    CenterLoader
} from '@components/uiComponents';
import { ScreenName, Theme } from '@constants/index';
import BookingProgressFlow from '@containers/BookingProgressFlow';
import { ToastHelpers } from '@helpers/index';
import {
    setCurrentBookingRedux, setListBookingStore, setShowLoaderStore
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
        TEXT_BOLD
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
            dispatch(setCurrentBookingRedux(data.data));
        }

        setRefreshing(false);
        dispatch(setShowLoaderStore(false));
    };

    const onSendedRating = () => {
        dispatch(setShowLoaderStore(true));
        fetchBookingDetailInfo();
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
                        contentContainerStyle={{
                            paddingBottom: 5
                        }}
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
                                    navigation={navigation}
                                    fetchListBooking={() => fetchListBooking()}
                                />

                                {currentBookingRedux && (
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
                                                booking={currentBookingRedux}
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
                                                    {currentBookingRedux.noted}
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
                                                status={currentBookingRedux.status}
                                                partner={currentBookingRedux.partner}
                                                booking={currentBookingRedux}
                                            />
                                        </View>

                                        <ButtonPanel
                                            booking={currentBookingRedux}
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
    title: {
        fontFamily: TEXT_BOLD,
        marginBottom: 20
    },
    subTitle: {
        fontFamily: TEXT_REGULAR,
    },
});
