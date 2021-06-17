import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    FlatList, RefreshControl, Text, View
} from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader, Line } from '../../../components/uiComponents';
import { NowTheme, Rx, ScreenName } from '../../../constants';
import { ToastHelpers } from '../../../helpers';
import { setListBookingStore } from '../../../redux/Actions';
import { rxUtil } from '../../../utils';
import CardBooking from './CardBooking';

const {
    FONT: {
        MONTSERRAT_REGULAR,
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
                setIsShowSpinner(true);
                getListBooking();
            }
            shortListByDate();
        }, []
    );

    const dateToTimestamp = (dateString) => moment(dateString).unix();

    const compare = (a, b) => {
        if (dateToTimestamp(a.date) < dateToTimestamp(b.date)) {
            return 1;
        }
        if (dateToTimestamp(a.date) > dateToTimestamp(b.date)) {
            return -1;
        }
        return 0;
    };

    const shortListByDate = () => {
        const result = listBookingStore.sort(compare);
        dispatch(setListBookingStore(result));
        const arr = groupBookingByDate(result);
        console.log('arr :>> ', arr);
    };

    const groupBookingByDate = (listBooking) => {
        const result = [];
        let day = listBooking[0].date;
        let bookingArr = [];
        listBooking.forEach((item) => {
            if (item.date === day) {
                bookingArr.push(item);
            } else {
                result.push(
                    {
                        day,
                        list: bookingArr
                    }
                );

                day = item.date;
                bookingArr = [];
                bookingArr.push(item);
            }
        });

        return result;
    };

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

    const onRefresh = () => {
        setRefreshing(true);
        getListBooking();
    };

    const renderListBooking = () => (
        <>
            {listBookingStore && listBookingStore.length !== 0 ? (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    refreshControl={(
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => onRefresh()}
                        />
                    )}
                    data={listBookingStore}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback
                            onPress={() => {
                                navigation.navigate(ScreenName.BOOKING_DETAIL, {
                                    bookingId: item.id,
                                });
                            }}
                        >
                            <CardBooking
                                booking={item}
                                key={item.id}
                                navigation={navigation}
                            />
                            <View
                                style={{
                                    alignSelf: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Line
                                    borderColor={COLORS.DEFAULT}
                                    borderWidth={0.5}
                                    width={SIZES.WIDTH_BASE * 0.9}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                />
            ) : (
                <ScrollView
                    refreshControl={(
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => onRefresh()}
                        />
                    )}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            marginVertical: 15
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: MONTSERRAT_REGULAR,
                                color: COLORS.DEFAULT,
                                fontSize: SIZES.FONT_H2
                            }}
                        >
                            Danh sách trống
                        </Text>
                    </View>
                </ScrollView>
            )}

        </>
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <>
                        {renderListBooking()}
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
