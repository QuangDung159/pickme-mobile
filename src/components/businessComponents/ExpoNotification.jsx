import {
    setExpoToken,
    setListBookingStore,
    setListCashHistoryStore,
    setListNotification,
    setNotificationReceivedRedux,
    setNumberNotificationUnread
} from '@redux/Actions';
import BookingServices from '@services/BookingServices';
import CashServices from '@services/CashServices';
import NotificationServices from '@services/NotificationServices';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { useDispatch } from 'react-redux';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function ExpoNotification() {
    const notificationListener = useRef();
    const responseListener = useRef();

    const dispatch = useDispatch();

    useEffect(() => {
        registerForPushNotificationsAsync();

        // handle received
        notificationListener.current = Notifications.addNotificationReceivedListener((notificationReceived) => {
            console.log('notificationReceived :>> ', notificationReceived);
            fetchListNotification();

            const notificationType = notificationReceived.request.content.data.Type;
            if (notificationType) handleNotificationByType(notificationType);
        });

        // handle click pop-up
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            const notificationBody = response.notification.request.content.data;
            console.log('notificationBody :>> ', notificationBody);
            dispatch(setNotificationReceivedRedux(notificationBody));

            const notificationType = notificationBody?.Type;
            if (notificationType) handleNotificationByType(notificationType);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert.alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            dispatch(setExpoToken(token));
            console.log(token);
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };

    const fetchListNotification = async () => {
        const result = await NotificationServices.fetchListNotificationAsync();
        const { data } = result;

        if (data) {
            dispatch(setListNotification(data.data));
            countNumberNotificationUnread(data.data);
        }
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

    const handleNotificationByType = (notificationType) => {
        switch (notificationType) {
            case 2: {
                fetchListBooking();
                break;
            }
            case 3: {
                fetchListHistory();
                break;
            }
            case 4:
            {
                fetchListHistory();
                break;
            }
            case 5: {
                fetchListBooking();
                break;
            }
            default: {
                break;
            }
        }
    };

    const fetchListBooking = async () => {
        const result = await BookingServices.fetchListBookingAsync();
        const { data } = result;

        if (data) {
            dispatch(setListBookingStore(data.data));
        }
    };

    const fetchListHistory = async () => {
        const result = await CashServices.fetchCashHistoryAsync();
        const { data } = result;

        if (data) {
            dispatch(setListCashHistoryStore(data.data));
        }
    };

    return (
        <></>
    );
}
