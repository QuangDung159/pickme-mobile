import { Block, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { NowTheme, Rx, ScreenName } from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setListBookingStore } from '../../redux/Actions';
import { rxUtil } from '../../utils';
import { CenterLoader, Line } from '../uiComponents';
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

            const eventTriggerGetListBooking = navigation.addListener('focus', () => {
                getListBooking();
            });

            return eventTriggerGetListBooking;
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
            () => {
                setIsShowSpinner(false);
                setRefreshing(false);
            },
            () => {
                setIsShowSpinner(false);
                setRefreshing(false);
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
                                    from: ScreenName.BOOKING_LIST
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
                <Block
                    style={{
                        alignItems: 'center',
                        marginVertical: 15
                    }}
                >
                    <Text
                        color={NowTheme.COLORS.SWITCH_OFF}
                        style={{
                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                        }}
                        size={NowTheme.SIZES.FONT_H2}
                    >
                        Bạn không có cuộc hẹn nào sắp tới
                    </Text>
                </Block>
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
