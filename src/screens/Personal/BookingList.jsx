import { CenterLoader, Line } from '@components/uiComponents';
import {
    BookingStatus, ScreenName, Theme
} from '@constants/index';
import { mappingStatusText } from '@helpers/CommonHelpers';
import { ToastHelpers } from '@helpers/index';
import { setListBookingStore } from '@redux/Actions';
import { BookingServices } from '@services/index';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    RefreshControl, Text, View
} from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

const {
    FONT: {
        TEXT_REGULAR,
        TEXT_BOLD
    },
    SIZES,
    COLORS
} = Theme;

export default function BookingList({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const listBookingStore = useSelector((state) => state.userReducer.listBookingStore);
    const currentUser = useSelector((state) => state.userReducer.currentUser);
    const dispatch = useDispatch();

    useEffect(
        () => {
            if (!listBookingStore || listBookingStore.length === 0) {
                fetchListBooking();
            }
        }, []
    );

    const groupBookingByDate = () => groupBy(listBookingStore, (n) => n.date);

    const fetchListBooking = async () => {
        const res = await BookingServices.fetchListBookingAsync();
        let listBooking = [];

        if (res.data) {
            listBooking = res.data.data;
            dispatch(setListBookingStore(listBooking));
        }

        setIsShowSpinner(false);
        setRefreshing(false);
    };

    const convertMinutesToStringHours = (minutes) => moment.utc()
        .startOf('day')
        .add(minutes, 'minutes')
        .format('HH:mm');

    const renderBookingInfo = (booking) => {
        const {
            partnerName,
            startAt,
            endAt,
            status,
            id,
            idReadAble,
            address,
            customerName,
            customerId
        } = booking;

        const startStr = convertMinutesToStringHours(startAt);
        const endStr = convertMinutesToStringHours(endAt);

        let colorByStatus = COLORS.ACTIVE;
        if (status === BookingStatus.CANCEL) {
            colorByStatus = COLORS.PLACE_HOLDER;
        }

        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    navigation.navigate(ScreenName.BOOKING_DETAIL, {
                        bookingId: id,
                    });
                }}
            >
                <View
                    style={{
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: colorByStatus
                    }}
                >
                    <View
                        style={{
                            padding: 10
                        }}
                    >
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                        >
                            <Text
                                style={{
                                    fontSize: SIZES.FONT_H5,
                                    color: colorByStatus,
                                    fontFamily: TEXT_REGULAR
                                }}
                            >
                                {`${customerId === currentUser.id ? 'Host' : 'Khách hàng'}`}
                            </Text>
                            <Text
                                style={{
                                    fontFamily: TEXT_REGULAR,
                                    fontSize: SIZES.FONT_H5,
                                    color: colorByStatus,
                                }}
                            >
                                {`Mã đơn #${idReadAble}`}
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontFamily: TEXT_BOLD,
                                fontSize: SIZES.FONT_H3,
                                color: colorByStatus,
                            }}
                        >
                            {customerId === currentUser.id ? partnerName : customerName}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: '60%'
                            }}
                        >
                            <Text style={{
                                fontFamily: TEXT_REGULAR,
                                fontSize: SIZES.FONT_H2,
                                color: colorByStatus
                            }}
                            >
                                {startStr}
                            </Text>
                            <Text style={{
                                fontFamily: TEXT_REGULAR,
                                fontSize: SIZES.FONT_H2,
                                color: colorByStatus
                            }}
                            >
                                đến
                            </Text>
                            <Text style={{
                                fontFamily: TEXT_REGULAR,
                                fontSize: SIZES.FONT_H2,
                                color: colorByStatus
                            }}
                            >
                                {endStr}
                            </Text>
                        </View>

                        <Text style={{
                            fontFamily: TEXT_REGULAR,
                            fontSize: SIZES.FONT_H4,
                            color: colorByStatus,
                        }}
                        >
                            {address}
                        </Text>

                        <Text style={{
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H4,
                            color: colorByStatus
                        }}
                        >
                            {mappingStatusText(status)}
                        </Text>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    const renderDateSection = (groupBooking, dateString) => {
        const shortDate = dateString.replace('T00:00:00', '');
        const dateFragment = shortDate.split('-');

        return (
            <View
                style={{
                    flexDirection: 'row',
                    width: SIZES.WIDTH_BASE * 0.9,
                    alignSelf: 'center',
                }}
            >
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.1,
                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontFamily: TEXT_BOLD,
                            fontSize: SIZES.FONT_H1 - 5,
                            color: COLORS.ACTIVE
                        }}
                    >
                        {dateFragment[2]}
                    </Text>
                    <Line
                        borderColor={COLORS.DEFAULT}
                        style={{
                            width: SIZES.WIDTH_BASE * 0.1
                        }}
                    />
                    <Text
                        style={{
                            fontFamily: TEXT_REGULAR,
                            fontSize: SIZES.FONT_H1 - 5,
                            color: COLORS.DEFAULT
                        }}
                    >
                        {dateFragment[1]}
                    </Text>
                </View>
                <View
                    style={{
                        width: SIZES.WIDTH_BASE * 0.8,
                        paddingLeft: 10
                    }}
                >
                    {groupBooking.map((booking) => (
                        <View
                            key={booking.id}
                            style={{
                                marginBottom: 5
                            }}
                        >
                            {renderBookingInfo(booking)}
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchListBooking();
    };

    const renderListDateSection = () => {
        const listBookingByDate = groupBookingByDate(listBookingStore);

        if (JSON.stringify(listBookingByDate) === JSON.stringify({})) {
            return (
                <ScrollView
                    refreshControl={(
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => onRefresh()}
                            tintColor={COLORS.ACTIVE}
                        />
                    )}
                    contentContainerStyle={{
                        alignItems: 'center',
                        marginTop: 5
                    }}
                >
                    <Text
                        style={{
                            fontFamily: TEXT_REGULAR,
                            color: COLORS.DEFAULT,
                            fontSize: SIZES.FONT_H3,
                            marginVertical: 15
                        }}
                    >
                        Danh sách trống
                    </Text>
                </ScrollView>
            );
        }

        const arrayDate = Object.keys(listBookingByDate).sort();

        return (
            <ScrollView
                refreshControl={(
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => onRefresh()}
                        tintColor={COLORS.ACTIVE}
                    />
                )}
                contentContainerStyle={{
                    marginTop: 5,
                    paddingBottom: 5
                }}
                showsVerticalScrollIndicator={false}
            >
                {arrayDate.map((dateString) => (
                    <View
                        key={dateString}
                    >
                        {renderDateSection(listBookingByDate[dateString.toString()], dateString)}
                    </View>
                ))}
            </ScrollView>
        );
    };

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <View
                        style={{
                            backgroundColor: COLORS.BASE,
                            flex: 1
                        }}
                    >
                        {renderListDateSection()}
                    </View>
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
