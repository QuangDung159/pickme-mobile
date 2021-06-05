import { Block, Text } from 'galio-framework';
import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { NowTheme, Rx, ScreenName } from '../../constants';
import { ToastHelpers } from '../../helpers';
import { setCurrentUser } from '../../redux/Actions';
import { rxUtil } from '../../utils';
import { Line } from '../uiComponents';
import CardBooking from './CardBooking';

export default function BookingList({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);

    const { token, currentUser } = useSelector((state) => state.userReducer);
    const { bookingsAsCustomer } = currentUser;

    const dispatch = useDispatch();

    const onRefresh = () => {
        setRefreshing(true);
        fetchCurrentUserInfo();
    };

    const fetchCurrentUserInfo = () => {
        rxUtil(
            Rx.USER.CURRENT_USER_INFO,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                dispatch(setCurrentUser(res.data.data));
                setRefreshing(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setRefreshing(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setRefreshing(false);
            }
        );
    };

    const renderListBooking = () => (
        <>
            {bookingsAsCustomer && bookingsAsCustomer.length !== 0 ? (
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
                    data={bookingsAsCustomer}
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
                {renderListBooking()}
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
