import { Block, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CenterLoader, Line } from '../../../components/uiComponents';
import { NowTheme, Rx, ScreenName } from '../../../constants';
import { ToastHelpers } from '../../../helpers';
import { setListBookingStore } from '../../../redux/Actions';
import { rxUtil } from '../../../utils';
import CardBooking from './CardBooking';

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
        }, []
    );

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
                    contentContainerStyle={{
                        marginTop: 10,
                        paddingBottom: 10
                    }}
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
                            <Block
                                middle
                            >
                                <Line
                                    borderColor={NowTheme.COLORS.ACTIVE}
                                    borderWidth={0.5}
                                    width={NowTheme.SIZES.WIDTH_BASE}
                                />
                            </Block>
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
                    <Block
                        style={{
                            alignItems: 'center',
                            marginVertical: 15
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                color: NowTheme.COLORS.DEFAULT,
                                size: NowTheme.SIZES.FONT_H2
                            }}
                        >
                            Danh sách trống
                        </Text>
                    </Block>
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
