import { Block } from 'galio-framework';
import React, { useState } from 'react';
import { RefreshControl } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationItem } from '../components/bussinessComponents';
import { CenterLoader } from '../components/uiComponents';
import {
    IconFamily, NowTheme, Rx
} from '../constants';
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

    const dispatch = useDispatch();

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

    const renderNotiItem = (notiItem) => {
        let iconName = 'home';
        let iconFamily = IconFamily.FONT_AWESOME;
        switch (notiItem.type) {
            case 1: {
                iconName = 'clipboard-list';
                iconFamily = IconFamily.FONT_AWESOME_5;
                break;
            }
            case 3: {
                iconName = 'treasure-chest';
                iconFamily = IconFamily.MATERIAL_COMMUNITY_ICONS;
                break;
            }
            default: {
                break;
            }
        }
        return (
            <NotificationItem
                iconName={iconName}
                iconFamily={iconFamily}
                title="Notification"
                notiItem={notiItem}
                onTriggerRead={() => getListNotiFromAPI()}
                navigation={navigation}
            />
        );
    };

    const renderListNoti = () => (
        <FlatList
            refreshControl={(
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => onRefresh()}
                />
            )}
            contentContainerStyle={{
                backgroundColot: NowTheme.COLORS.BASE,
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
                    <CenterLoader size="large" />
                ) : (
                    <Block>
                        {renderListNoti()}
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
