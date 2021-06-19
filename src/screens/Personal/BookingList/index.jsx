import groupBy from 'lodash/groupBy';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader, Line } from '../../../components/uiComponents';
import {
    BookingStatus, NowTheme, Rx, ScreenName
} from '../../../constants';
import { ToastHelpers } from '../../../helpers';
import { setListBookingStore } from '../../../redux/Actions';
import { rxUtil } from '../../../utils';

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

    const token = useSelector((state) => state.userReducer.token);
    const listBookingStore = useSelector((state) => state.userReducer.listBookingStore);

    const dispatch = useDispatch();

    useEffect(
        () => {
            if (!listBookingStore || listBookingStore.length === 0) {
                getListBooking();
            }
        }, []
    );

    const groupBookingByDate = () => groupBy(listBookingStore, (n) => n.date);

    const getListBooking = () => {
        const pagingStr = '?pageIndex=1&pageSize=100';

        rxUtil(
            `${Rx.BOOKING.GET_MY_BOOKING_AS_CUSTOMER}${pagingStr}`,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setListBookingStore(res.data.data));
                setIsShowSpinner(false);
                setRefreshing(false);
            },
            (res) => {
                setIsShowSpinner(false);
                setRefreshing(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            },
            (res) => {
                setIsShowSpinner(false);
                setRefreshing(false);
                ToastHelpers.renderToast(res.data.message, 'error');
            }
        );
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

        let colorByStatus = COLORS.LIST_ITEM_BACKGROUND_2;

        switch (status) {
            case BookingStatus.CANCEL: {
                colorByStatus = COLORS.BORDER_COLOR;
                break;
            }
            case BookingStatus.FINISH_PAYMENT: {
                colorByStatus = COLORS.LIST_ITEM_BACKGROUND_2;
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
                        backgroundColor: colorByStatus,
                        borderRadius: 5,
                        marginBottom: 10
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
                                color: COLORS.ACTIVE,

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
                                color: COLORS.ACTIVE
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
                            fontSize: SIZES.FONT_H1,
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
                            fontSize: SIZES.FONT_H1,
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
        getListBooking();
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
                        />
                    )}
                    contentContainerStyle={{
                        alignItems: 'center',
                        marginTop: 10
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
                    />
                )}
                contentContainerStyle={{
                    marginTop: 10,
                    paddingBottom: 10
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
                    <View
                        style={{
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
