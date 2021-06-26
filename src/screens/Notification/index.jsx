import { CenterLoader } from '@components/uiComponents';
import { NowTheme, ScreenName } from '@constants/index';
import { ToastHelpers } from '@helpers/index';
import { setListNotification, setNumberNotificationUnread } from '@redux/Actions';
import { NotificationServices } from '@services/index';
import React, { useEffect, useState } from 'react';
import {
    RefreshControl, SafeAreaView, Text, View
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import NotificationItem from './NotificationItem';

const {
    FONT: {
        MONTSERRAT_REGULAR,
    },
    SIZES,
    COLORS
} = NowTheme;

export default function Notification({ navigation }) {
    const [isShowSpinner, setIsShowSpinner] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const listNotification = useSelector(
        (state) => state.notificationReducer.listNotification
    );
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

    const getListNotiFromAPI = async () => {
        const result = await NotificationServices.fetchListNotificationAsync();
        const { data } = result;

        if (data) {
            dispatch(setListNotification(data.data));
            countNumberNotificationUnread(data.data);
        }
        setIsShowSpinner(false);
        setRefreshing(false);
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
        <>
            {listNotification && listNotification.length !== 0 ? (
                <FlatList
                    refreshControl={(
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => onRefresh()}
                        />
                    )}
                    contentContainerStyle={{
                        backgroundColor: COLORS.BASE,
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
            <SafeAreaView
                style={{
                    flex: 1
                }}
            >
                {isShowSpinner ? (
                    <CenterLoader />
                ) : (
                    <>
                        {renderListNoti()}
                    </>
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
