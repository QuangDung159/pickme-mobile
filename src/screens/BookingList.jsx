import { Block, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { CardBooking } from '../components/bussinessComponents';
import { CenterLoader } from '../components/uiComponents';
import { NowTheme, Rx, ScreenName } from '../constants';
import { ToastHelpers } from '../helpers';
import { rxUtil } from '../utils';

export default function BookingList({ navigation }) {
    const [listBooking, setListBooking] = useState([]);
    const [isShowSpinner, setIsShowSpinner] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const token = useSelector((state) => state.userReducer.token);

    useEffect(
        () => {
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
                setListBooking(res.data.data);
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
        <SafeAreaView>
            {listBooking && listBooking.length !== 0 ? (
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
                    data={listBooking}
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
                                renderAtScreen={ScreenName.BOOKING_LIST}
                                navigation={navigation}
                            />
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
                        size={NowTheme.SIZES.FONT_INFO}
                    >
                        Bạn không có cuộc hẹn nào sắp tới
                    </Text>
                </Block>
            )}

        </SafeAreaView>
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader size="large" />
                ) : (
                    <Block style={{
                        backgroundColor: NowTheme.COLORS.BLOCK
                    }}
                    >
                        {renderListBooking()}
                    </Block>
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
