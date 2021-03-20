import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import {
    Alert,
    Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Rx, ScreenName } from '../../constants';
import { setExpoToken, setListNotification, setNumberNotificationUnread } from '../../redux/Actions';
import { rxUtil } from '../../utils';

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

    const token = useSelector((state) => state.userReducer.token);
    const navigationObj = useSelector((state) => state.appConfigReducer.navigationObj);

    const dispatch = useDispatch();

    useEffect(() => {
        registerForPushNotificationsAsync().then(() => {});

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(
        () => {
        // This listener is fired whenever a notification is received while the app is foregrounded
            notificationListener.current = Notifications.addNotificationReceivedListener(() => {
            // in app trigger
                getListNotiFromAPI();
            });
        }, [token]
    );

    useEffect(
        () => {
            // This listener is fired
        // whenever a user taps on or interacts
        // with a notification (works when app is foregrounded, backgrounded, or killed)
            responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            // on click noti popup outside
                const navigationData = response.notification.request.content.data;
                handleNavigation(navigationData.NavigationId, navigationData.Type);
            });
        }, [navigationObj]
    );

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
                // set store
                dispatch(setListNotification(res.data.data));
                countNumberNotificationUnread(res.data.data);
            },
            () => {},
            () => {}
        );
    };

    const handleNavigation = (navigationId, navigationType) => {
        if (navigationObj) {
            switch (navigationType) {
                case 1: {
                    navigationObj.navigate(ScreenName.BOOKING_DETAIL, { bookingId: navigationId });
                    break;
                }
                case 3: {
                    navigationObj.navigate(ScreenName.WALLET);
                    break;
                }
                default: {
                    break;
                }
            }
        }
    };

    async function registerForPushNotificationsAsync() {
        let expoToken;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert('Failed to get push token for push notification!');
                return;
            }
            expoToken = (await Notifications.getExpoPushTokenAsync()).data;
            dispatch(setExpoToken(expoToken));
        } else {
            Alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }

    return (
        null
    );
}
