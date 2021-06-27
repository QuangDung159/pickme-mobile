import { CenterLoader, Line } from '@components/uiComponents';
import {
    BookingStatus, NowTheme, ScreenName
} from '@constants/index';
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
        MONTSERRAT_REGULAR,
        MONTSERRAT_BOLD
    },
    SIZES,
    COLORS
} = NowTheme;

export default function BookingList({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const listBookingStore = useSelector((state) => state.userReducer.listBookingStore);
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
        const result = await BookingServices.fetchListBookingAsync();
        const { data } = result;

        if (data) {
            dispatch(setListBookingStore(data.data));
            setIsShowSpinner(false);
            setRefreshing(false);
        } else {
            setIsShowSpinner(false);
            setRefreshing(false);
        }
    };

    const convertMinutesToStringHours = (minutes) => moment.utc()
        .startOf('day')
        .add(minutes, 'minutes')
        .format('HH:mm');

    const renderBookingInfo = (booking) => {
        const {
            partner,
            startAt,
            endAt,
            statusValue,
            status,
            id,
            idReadAble,
            address
        } = booking;

        const startStr = convertMinutesToStringHours(startAt);
        const endStr = convertMinutesToStringHours(endAt);

        let colorByStatus = COLORS.ACTIVE;

        switch (status) {
            case BookingStatus.CANCEL: {
                colorByStatus = COLORS.DEFAULT;
                break;
            }
            case BookingStatus.FINISH_PAYMENT: {
                colorByStatus = COLORS.ACTIVE;
                break;
            }
            default: {
                break;
            }
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
                        backgroundColor: COLORS.BLOCK,
                        borderRadius: 5,
                        marginBottom: 5
                    }}
                >
                    <View
                        style={{
                            padding: 10
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: MONTSERRAT_BOLD,
                                fontSize: SIZES.FONT_H3,
                                color: colorByStatus,
                            }}
                        >
                            {partner.fullName}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: MONTSERRAT_REGULAR,
                                    fontSize: SIZES.FONT_H5,
                                    color: COLORS.DEFAULT,
                                }}
                            >
                                {`Đơn hẹn #${idReadAble}`}
                            </Text>
                            <Text style={{
                                fontFamily: MONTSERRAT_BOLD,
                                fontSize: SIZES.FONT_H4,
                                color: colorByStatus
                            }}
                            >
                                {statusValue}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 5
                            }}
                        >
                            <Text style={{
                                fontFamily: MONTSERRAT_REGULAR,
                                fontSize: SIZES.FONT_H1 - 8,
                                color: COLORS.ACTIVE
                            }}
                            >
                                {startStr}
                            </Text>
                            <Text style={{
                                fontFamily: MONTSERRAT_REGULAR,
                                fontSize: SIZES.FONT_H1 - 8,
                                color: COLORS.ACTIVE
                            }}
                            >
                                {endStr}
                            </Text>
                        </View>

                        <Text style={{
                            fontFamily: MONTSERRAT_REGULAR,
                            fontSize: SIZES.FONT_H4,
                            color: COLORS.DEFAULT,
                            marginBottom: 5
                        }}
                        >
                            {address}
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
                            fontFamily: MONTSERRAT_BOLD,
                            fontSize: SIZES.FONT_H1 - 5,
                            color: COLORS.ACTIVE
                        }}
                    >
                        {dateFragment[2]}
                    </Text>
                    <Line
                        borderWidth={0.5}
                        borderColor={COLORS.DEFAULT}
                        style={{
                            width: SIZES.WIDTH_BASE * 0.1
                        }}
                    />
                    <Text
                        style={{
                            fontFamily: MONTSERRAT_REGULAR,
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
                            fontFamily: MONTSERRAT_REGULAR,
                            color: COLORS.DEFAULT,
                            fontSize: SIZES.FONT_H3
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
                    <View>
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
                    <>
                        {renderListDateSection()}
                    </>
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
