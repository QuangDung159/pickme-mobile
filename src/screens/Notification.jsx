import { Block, Text } from 'galio-framework';
import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationItem } from '../components/businessComponents';
import { CenterLoader } from '../components/uiComponents';
import { NowTheme, Rx, ScreenName } from '../constants';
import { ToastHelpers } from '../helpers';
import { setListNotification, setNumberNotificationUnread } from '../redux/Actions';
import { rxUtil } from '../utils';

export default function Notification({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const listNotification = useSelector(
        (state) => state.notificationReducer.listNotification
    );
    const token = useSelector((state) => state.userReducer.token);
    const isSignInOtherDeviceStore = useSelector((state) => state.userReducer.isSignInOtherDeviceStore);

    const dispatch = useDispatch();

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
        getListNotiFromAPI();
    };

    const countNumberNotificationUnread = (listNotiFromAPI) => {
        let count = 0;
        listNotiFromAPI.forEach((item) => {
            if (!item.isRead) {
                count += 1;
            }
        });

        dispatch(setNumberNotificationUnread(count));
    };

    const getListNotiFromAPI = () => {
        rxUtil(
            Rx.NOTIFICATION.GET_MY_NOTIFICATION,
            'GET',
            null,
            {
                Authorization: token
            },
            (res) => {
                setIsShowSpinner(false);
                setRefreshing(false);

                // set store
                dispatch(setListNotification(res.data.data));
                countNumberNotificationUnread(res.data.data);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
                setRefreshing(false);
            },
            (res) => {
                ToastHelpers.renderToast(res.data.message, 'error');
                setIsShowSpinner(false);
                setRefreshing(false);
            }
        );
    };

    const renderNotiItem = (notiItem) => (
        <NotificationItem
            title="Notification"
            notiItem={notiItem}
            onTriggerRead={() => getListNotiFromAPI()}
            navigation={navigation}
        />
    );

    const renderListNoti = () => (
        <FlatList
            refreshControl={(
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => onRefresh()}
                />
            )}
            contentContainerStyle={{
                backgroundColor: NowTheme.COLORS.BASE,
            }}
            showsVerticalScrollIndicator={false}
            data={listNotification}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <>
                    {renderNotiItem(item)}
                </>
            )}
        />
    );

    try {
        return (
            <>
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <Block
                        flex
                    >
                        {listNotification && listNotification.length !== 0 ? (
                            renderListNoti()
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
                                        color={NowTheme.COLORS.SWITCH_OFF}
                                        style={{
                                            fontFamily: NowTheme.FONT.MONTSERRAT_REGULAR,
                                        }}
                                        size={NowTheme.SIZES.FONT_H2}
                                    >
                                        Danh sách trống
                                    </Text>
                                </Block>
                            </ScrollView>
                        )}

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
